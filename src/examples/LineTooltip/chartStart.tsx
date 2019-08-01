import React, { FC } from "react";
import * as d3 from "d3";
import styled from "styled-components";

import { Dimensions } from "../../components/types";
import { Chart } from "../../components";

const StyledDiv = styled.div`
  svg {
  }
`;

interface Props {
  data: any;
}

export const ChartStart: FC<Props> = ({ data }) => {
  /* const [ref, size] = useComponentSize(); */

  const outerHight = 500;
  const outerWidth = 800;
  const margin = { top: 20, right: 20, bottom: 20, left: 40 };
  const width = outerWidth - margin.left * 2 - margin.right;
  const height = outerHight - margin.top - margin.bottom;

  const d: Dimensions = {
    width,
    height,
    margin
  };

  const xMin = Math.min(...data.map((d: any) => d[0]));
  const xMax = Math.max(...data.map((d: any) => d[0]));
  const yMax = Math.max(...data.map((d: any) => d[1]));

  const y = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.top, 0]);

  const x = d3
    .scaleTime()
    .domain([xMin, xMax])
    .range([0, width - margin.right]);

  const scales = { x, y };

  console.log("chart page", data);

  return (
    <StyledDiv>
      <Chart data={data} />
    </StyledDiv>
  );
};