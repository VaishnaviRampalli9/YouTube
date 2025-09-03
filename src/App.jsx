import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

import Card from "./components/Card";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { randomAge, randomDuration, randomViews } from "./util/helperFunctions";

function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loaderRef = useRef();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [pics, titles] = await Promise.all([
        axios.get(`https://picsum.photos/v2/list?page=${page}&limit=10`),
        axios.get(
          `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
        ),
      ]);

      let mapped = pics.data.map((pic, index) => ({
        ...pic,
        title: titles.data[index]?.title || "LOREM IPSUM DOLOR SIT",
        views: randomViews(),
        duration: randomDuration(),
        age: randomAge(),
      }));

      setPhotos((prev) => [...prev, ...mapped]);
      setPage((p) => p + 1);
    } catch (e) {
      setError("Failed to fetch data " + e.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && photos.length > 0) {
          fetchData();
        }
      },
      { threshold: 1.0 } // trigger when fully in view
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLoading, photos, fetchData]);

  return (
    <div className="min-h-screen dark:bg-[rgb(15,15,15)] ">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {photos.map((photo) => (
          <Card key={photo.id} {...photo} />
        ))}
      </ul>
      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingSpinner />}
      {!isLoading && <div ref={loaderRef} className="h-10"></div>}
      {/* sentinel */}
    </div>
  );
}

export default App;
