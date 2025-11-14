import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import NotFound from "./modules/Boundaries/NotFound";

const ErrorBoundary = lazy(() => import("@/modules/Boundaries/ErrorBoundary"));
const Home = lazy(() => import("@/modules/Home/Home"));
const Task = lazy(() => import("@/modules/TaskManagement/TaskManagement"));
const Setting = lazy(() => import("@/modules/Setting/Setting"));
const SVGEditor = lazy(() => import("@/modules/SVGEditor/SVGEditor"));
const Entertainment = lazy(
  () => import("@/modules/Entertainment/Entertainment")
);

const mainRouter = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "task",
        Component: Task,
      },
      {
        path: "setting",
        Component: Setting,
      },
      {
        path: "svg-editor",
        Component: SVGEditor,
      },
      {
        path: "relax",
        Component: Entertainment,
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
