import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 w-full h-screen"
      id="error-page"
    >
      <h1 className="text-xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500 font-semibold">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link
        to={'/setup'}
        className="text-gray-50 font-semibold bg-blue-400 p-2 rounded-md"
      >
        back to setup
      </Link>
    </div>
  );
}
