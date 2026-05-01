import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./RootLayout";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import LearnPage from "../pages/LearnPage/LearnPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
                loader: () => { },
            },
            { path: "courses", element: <CoursesPage /> },
            { path: "courses/:courseSlug", element: <CourseDetailsPage /> },
            { path: "admin", element: <AdminDashboardPage /> },
        ],
    },
    {
        path: "learn/:courseSlug",
        element: <LearnPage />,
        loader: () => { },
    },
]);

export default router;
