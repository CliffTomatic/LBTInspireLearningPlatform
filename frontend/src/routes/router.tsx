import { createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from './RootLayout';
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailsPage from '../pages/CourseDetailsPage/CourseDetailsPage';
import Profile from '../pages/Profile/Profile';
import LearnPage from '../pages/LearnPage/LearnPage';
import AdminLayout from './AdminLayout/AdminLayout';
import AboutUsPage from '../pages/AboutUsPage/AboutUsPage';
import AdminDashboard from '../pages/Admin/AdminDashboard/AdminDashboard';
import AdminAnalytics from '../components/Admin/Analytics/AdminAnalytics/AdminAnalytics';
import Playground from '../components/Admin/Playground/Playground';

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
            { path: 'about', element: <AboutUsPage /> },
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
            {
                path: 'playground',
                element: <Playground />,
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
