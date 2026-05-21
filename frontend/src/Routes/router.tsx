import { createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from './RootLayout';
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailsPage from '../pages/CourseDetailsPage/CourseDetailsPage';
import Profile from '../pages/Profile/Profile';
import LearnPage from '../pages/LearnPage/LearnPage';
import AdminLayout from './AdminLayout/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard/AdminDashboard';
import AdminAnalytics from '../components/Admin/Analytics/AdminAnalytics';

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
            { path: 'profile', element: <Profile /> },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <AdminDashboard />,
            },
            {
                path: 'analytics',
                element: <AdminAnalytics />,
            },
        ],
    },
    // TODO: add both into path: learn/ then both slugs as children.
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
