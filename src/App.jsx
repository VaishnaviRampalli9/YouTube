import Card from "./components/Card";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { getPhotos } from "./util/helperFunctions";
import useLoader from "./util/useLoader";

function App() {
  const {data: photos, error, loaderRef, isLoading} = useLoader(getPhotos);
  console.log("RENDERING APP")

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
