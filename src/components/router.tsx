import { createBrowserRouter, Link } from "react-router-dom";
import { Login } from "../pages/login";

export const rootRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <>暂时没写</>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
]);