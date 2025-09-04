/**
 * @template T
 * @param {(page: number) => Promise<T[]>} fetchFunction
 */

import { useEffect, useRef, useState, useCallback } from "react";

export default function useLoader(fetchFunction) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const loaderRef = useRef();
  console.log("In Loader");
  
  const fetchData = useCallback(
    async (pageToLoad) => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("pre call");
        const mapped = await fetchFunction(pageToLoad);

        setData((prev) => [...prev, ...mapped]);
        setPage((p) => p + 1);
      } catch (e) {
        setError("Failed to fetch data " + (e?.message || String(e)));
      } finally {
        setIsLoading(false);
        console.log("post  call");
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    console.log("In effect");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          fetchData(page);
        }
      },
      { threshold: 0, rootMargin: "200px" }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLoading, page, fetchData]);

  return { data, error, loaderRef, isLoading };
}
