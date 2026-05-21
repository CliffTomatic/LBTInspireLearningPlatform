import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./RootLayout";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CourseDetailsPage from "../pages/CourseDetailsPage/CourseDetailsPage";
import LearnPage from "../pages/LearnPage/LearnPage";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import ConnectPage from "../pages/ConnectPage/ConnectPage";

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
            { path: "about", element: <AboutUsPage /> },
            { path: "connect", element: <ConnectPage /> },
            { path: "admin", element: <AdminDashboardPage /> },
        ],
    },
    {
        path: "learn/:courseSlug",
        element: <LearnPage />,
        loader: () => { },
    },
    {
        path: "learn/:courseSlug/:sectionSlug",
        element: <LearnPage />,
    }
]);

export default router;
