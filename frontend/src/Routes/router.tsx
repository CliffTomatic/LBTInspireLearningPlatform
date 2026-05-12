import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout';
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import CourseDetailsPage from '../pages/CourseDetailsPage/CourseDetailsPage';
import Profile from '../pages/Profile/Profile';
import LearnPage from '../pages/LearnPage/LearnPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            { path: 'courses', element: <CoursesPage /> },
            { path: 'courses/:courseSlug', element: <CourseDetailsPage /> },
            { path: 'admin', element: <AdminDashboardPage /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
    {
        path: 'learn/:courseSlug',
        element: <LearnPage />,
    },
    {
        path: 'learn/:courseSlug/:sectionSlug',
        element: <LearnPage />,
    },
]);

export default router;
