import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { lazy } from "react";
import AppLayout from "./layouts/AppLayout";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={mainRouter} />;
}

export default App;
