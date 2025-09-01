import { useEffect, useState } from "react";

import Card from "./components/Card";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

function randomDuration() {
  const min = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

function randomAge() {
  const units = [
    { name: "year", max: 10 },
    { name: "month", max: 11 },
    { name: "day", max: 30 },
    { name: "hour", max: 23 },
    { name: "minute", max: 59 },
  ];
  const unit = units[Math.floor(Math.random() * units.length)];
  const value = Math.floor(Math.random() * unit.max) + 1;
  return value === 0
    ? "Just now"
    : `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
}

function randomViews() {
  const views = Math.random() * 2_000_000;
  if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + "M";
  }
  return Math.floor(views / 1000) + "K";
}

function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const [picssRes, titlesRes] = await Promise.all([
          fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`),
          fetch(
            `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
          ),
        ]);

        if (!picssRes.ok || !titlesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        let pics = await picssRes.json();
        let titles = await titlesRes.json();
        pics = pics.map((pic, index) => ({
          ...pic,
          title: titles[index]?.title || "LOREM IPSUM DOLOR SIT",
          views: randomViews(),
          duration: randomDuration(),
          age: randomAge(),
        }));
        if (!ignore) {
          setPhotos((prev) => [...prev, ...pics]);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setError(e?.message || "Something went wrong");
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      ) {
        setPage((p) => p + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
