import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./RootLayout";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: () => {},
      },
      { path: "courses", element: <CoursesPage /> },
      { path: "admin", element: <AdminDashboardPage /> },
    ],
  },
]);

export default router;
