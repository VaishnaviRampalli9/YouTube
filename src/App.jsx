import { useEffect, useRef, useState } from "react";

import Card from "./components/Card";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { getPhotos } from "./util/helperFunctions";

let didRun = false;
function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loaderRef = useRef();

  const fetchData = async (pageToLoad) => {
    try {
      setIsLoading(true);
      setError(null);

      const mapped = await getPhotos(pageToLoad);

      setPhotos((prev) => [...prev, ...mapped]);
      setPage(pageToLoad + 1);
    } catch (e) {
      setError("Failed to fetch data " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(!didRun){
      fetchData(1);
      didRun = true;
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && photos.length > 0) {
          fetchData(page);
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLoading, photos, page]);

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
    </div>
  );
}

export default App;
