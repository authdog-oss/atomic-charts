import {useEffect, useState} from "react";
import {AxiosResponse, AxiosError, AxiosPromise} from "axios";

export const useFetch = (initialValue: any, fetch: AxiosPromise) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(initialValue);

  /** If fetch is not used return undefined */
  /* 
  if (!fetch) {
    return [undefined, undefined, undefined];
  } */

  useEffect(() => {
    setLoading(true);
    fetch
      .then((res: AxiosResponse) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        setLoading(false);
        setError(true);
        console.error(err);
      });
  }, [fetch]);

  return [data, loading, error];
};
