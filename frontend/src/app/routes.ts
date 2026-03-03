import { createBrowserRouter } from "react-router";
import Root from "./Root";
import HomePage from "./pages/HomePage";
import FeesPage from "./pages/FeesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "fees", Component: FeesPage },
    ],
  },
]);