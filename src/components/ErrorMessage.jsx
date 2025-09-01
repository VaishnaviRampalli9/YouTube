export default function ErrorMessage({message}) {
  return (
    <div className="text-red-500 text-center my-4">
      {message}. Please try again.
    </div>
  );
}
