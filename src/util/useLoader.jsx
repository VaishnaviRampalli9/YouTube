/**
 * @template T
 * @param {(page: number) => Promise<T[]>} fetchFunction
 */

import { useEffect, useRef, useState, useCallback } from "react";

export default function useLoader(fetchFunction) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loaderRef = useRef();
  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const mapped = await fetchFunction(pageRef.current);

      setData((prev) => [...prev, ...mapped]);
      pageRef.current += 1;
    } catch (e) {
      setError("Failed to fetch data " + (e?.message || String(e)));
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            fetchData();
          });
        }
      },
      { threshold: 0, rootMargin: "200px" }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchData]);

  return { data, isLoading, error, loaderRef };
}
