import { useEffect, useState } from "react";
import { throttle } from "lodash";
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

  useEffect(() => {
    let ignore = false;
    console.log("page is:", page);
    async function fetchData() {
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

        if (!ignore) {
          setPhotos((prev) => [...prev, ...mapped]);
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
        setError("Failed to fetch data " + e.message);
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [page]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        !isLoading &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200
      ) {
        setPage((p) => p + 1);
      }
    }, 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  return (
    <div className="min-h-screen dark:bg-[rgb(15,15,15)] ">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {photos.map((photo) => (
          <Card key={photo.id} {...photo} />
        ))}
      </ul>
      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default App;
