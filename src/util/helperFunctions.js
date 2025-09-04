import axios from "axios";

export function randomDuration() {
  const min = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

export function randomAge() {
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

export function randomViews() {
  const views = Math.random() * 2_000_000;
  if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + "M";
  }
  return Math.floor(views / 1000) + "K";
}

export function handleCardClick(download_url) {
  // window.location.href = download_url;
  window.open(download_url, "_blank");
}

export function handleAuthorClick(e, author) {
  e.stopPropagation();
  // window.location.href = `https://www.google.com/search?q=${author}`;
  window.open(`https://www.google.com/search?q=${author}`, "_blank");
}

export async function getPhotos(pageToLoad) {
  const [pics, titles] = await Promise.all([
    axios.get(`https://picsum.photos/v2/list?page=${pageToLoad}&limit=10`).then(r=>r.data),
    axios.get(
      `https://jsonplaceholder.typicode.com/photos?_page=${pageToLoad}&_limit=10`
    ).then(r=>r.data),
  ]);

  return pics.map((pic, index) => ({
    ...pic,
    title: titles[index]?.title || "LOREM IPSUM DOLOR SIT",
    views: randomViews(),
    duration: randomDuration(),
    age: randomAge(),
  }));
}
