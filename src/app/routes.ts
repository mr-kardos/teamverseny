import { createBrowserRouter } from "react-router";
import { PublicView } from "./pages/PublicView";
import { AdminView } from "./pages/AdminView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicView,
  },
  {
    path: "/admin",
    Component: AdminView,
  },
]);
