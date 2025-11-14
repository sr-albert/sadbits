import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import NotFound from "./modules/Boundaries/NotFound";

const Home = lazy(() => import("@/modules/Home/Home"));

const mainRouter = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={mainRouter} />;
}

export default App;
