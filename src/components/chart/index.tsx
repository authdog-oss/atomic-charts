import React, {FC, HTMLAttributes, ReactNode, useEffect, useReducer} from "react";
import * as d3 from "d3";
import {initialState, chartReducer, Dimension, Margin, Data} from "../../store";
import Context from "../../store/context";
import {StyledDiv, StyleProps} from "./styles";
import {useFetch} from "../../hooks";

interface ChartProps extends StyleProps, HTMLAttributes<HTMLDivElement> {
  /** Define x scale for your Chart */
  scaleX?: "scaleLinear" | "scaleTime" | "scaleBand";

  /** Define y scale for your Chart */
  scaleY?: "scaleLinear";

  /** Pass in Data from outside */
  data?: Data;

  /** Override default dimensions with your individual dimensions */
  dimension: Dimension;

  /** Override default margins with your individual margins */
  margin: Margin;

  /** Fetch datas directly using axios. */
  fetch?: any;

  /** Wether the error indicator should be shown. */
  hasError?: boolean;

  /** Wether the loading indicator should be shown. */
  isLoading?: boolean;

  /** Children is mandantory */
  children: ReactNode | ReactNode[];
}

export const Chart: FC<ChartProps> = ({
  data,
  dimension,
  margin,
  scaleX,
  scaleY,
  fetch,
  isLoading,
  hasError,
  children,
  ...rest
}) => {
  const [fetchedData, loading, error] = useFetch({}, fetch);
  const [state, dispatch] = useReducer(chartReducer, initialState);

  const dataToStore = fetchedData || data;
  const loadingState = loading || isLoading;
  const errorState = error || hasError;
  let scaleToStore: any;

  useEffect(() => {
    if (dataToStore.length) {
      const xMin = Math.min(...dataToStore.map((d: Data) => d[0]));
      const xMax = Math.max(...dataToStore.map((d: Data) => d[0]));
      /*      const yMin= Math.min(...dataToStore.map((d: Data) => d[1])); */
      const yMax = Math.max(...dataToStore.map((d: Data) => d[1]));

      /** TODO: refactor this */
      let x;
      let y;
      if (scaleY === "scaleLinear") {
        y = d3
          .scaleLinear()
          .domain([0, yMax])
          .range([dimension.height - state.margin.top, 0]);
      }

      if (scaleX === "scaleTime") {
        x = d3
          .scaleTime()
          .domain([xMin, xMax])
          .range([0, dimension.width - state.margin.right]);
      }

      if (scaleX === "scaleLinear") {
        x = d3
          .scaleLinear()
          .domain([xMin, xMax])
          .range([0, dimension.width - state.margin.right]);
      }

      if (scaleX === "scaleBand") {
        x = d3
          .scaleBand()
          .range([0, dimension.width - margin.left - margin.right])
          .domain(dataToStore.map((d: any) => d[0]))
          .padding(0.1);
      }

      scaleToStore = {x, y};
      dispatch({type: "SET_SCALE", scale: scaleToStore});
      dispatch({type: "SET_DATA", payload: dataToStore});
    }
  }, [dataToStore]);

  useEffect(() => {
    dimension && dispatch({type: "SET_DIMENSION", dimension});
  }, [dimension]);

  useEffect(() => {
    margin && dispatch({type: "SET_MARGIN", margin});
  }, [margin]);

  useEffect(() => {
    dispatch({type: "SET_LOADING", isLoading: loadingState});
  }, [loadingState]);

  useEffect(() => {
    dispatch({type: "SET_ERROR", hasError: errorState});
  }, [errorState]);

  if (!dataToStore.length) {
    return null;
  }

  console.log("###");

  return (
    <Context.Provider value={{state, dispatch}}>
      <StyledDiv {...rest}>
        <svg width={state.dimension.width + 40} height={state.dimension.height + 40}>
          <g transform={`translate(${state.margin.left}, ${state.margin.top})`}>{children}</g>
        </svg>
      </StyledDiv>
    </Context.Provider>
  );
};
