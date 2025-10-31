    import { useRouteError } from "react-router-dom";

    function ErrorView() {
      const error = useRouteError();
      console.error(error);

      return (
        <div id="error-page">
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
          <div>return <a href="/" alt="U-Vote home">home</a> to access your votes and other voter tools. </div>
        </div>
      );
    }

    export default ErrorView;