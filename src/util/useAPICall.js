import { useState, useEffect } from "react";
import axios from "axios";

export function useAPICall(requests = [], transform = null, dependencies=[], append =false) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    //   console.log("page is:", page);
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const responses = await Promise.all(requests.map((req) => axios(req)));
        let result = responses.map((res) => res.data);
        if (transform) result = transform(result);

        if (!ignore) {
          setData(prev => append ? [...prev, result] : result);
          setIsLoading(false);
          //   setData((prev) => [...prev, ...pics]);
        }
      } catch (e) {
        if (!ignore) {
          setError("Failed to fetch data " + e.message);
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [...dependencies, append, requests, transform]);

  return { data, isLoading, error };
}
