import { useEffect, useMemo, useState } from 'react';

import { getAdminDashboard } from '../../../../services/adminApi';

import {
    ANALYTICS_TAB_ITEMS,
    type AdminDashboardResponse,
    type AdminSessionRow,
    type AnalyticsTabs,
} from '../../../../types/Admin';

import SummaryCard from '../SummaryCard/SummrayCard';

import OverviewTab from '../tabs/OverviewTab/OverviewTab';
import UsersTab from '../tabs/UsersTab/UsersTab';
import CoursesTab from '../tabs/CoursesTab/CoursesTab';
import SessionsTab from '../tabs/SessionsTab/SessionsTab';

import {
    courseMatchesSearch,
    getSearchPlaceholder,
    sessionMatchesSearch,
    userMatchesSearch,
} from '../../../../utils/admin/analytics/adminAnalyticsSearch';

import { formatSeconds } from '../../../../utils/admin/analytics/adminAnalyticsFormatters';

import {
    getEmptyDashboard,
    normalizeDashboard,
} from '../../../../utils/admin/analytics/adminAnalyticsNormalize';

import './AdminAnalytics.css';

/**
 * Displays the main admin analytics dashboard.
 *
 * @returns The admin analytics page content.
 */
export default function AdminAnalytics() {
    const [dashboard, setDashboard] =
        useState<AdminDashboardResponse>(getEmptyDashboard());

    const [activeTab, setActiveTab] = useState<AnalyticsTabs>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSession, setSelectedSession] =
        useState<AdminSessionRow | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let didCancel = false;

        /**
         * Loads dashboard analytics from the backend API.
         *
         * @returns Nothing.
         */
        async function loadDashboard() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const rawData = await getAdminDashboard();

                // Handles camelCase, PascalCase, and accidental Task/result wrappers.
                const normalizedDashboard = normalizeDashboard(rawData);

                if (!didCancel) {
                    setDashboard(normalizedDashboard);
                    setSelectedSession(
                        normalizedDashboard.recentSessions[0] ?? null,
                    );
                }
            } catch (error) {
                if (!didCancel) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : 'Unknown dashboard error.';

                    console.error('Admin dashboard failed to load:', error);

                    setDashboard(getEmptyDashboard());
                    setSelectedSession(null);
                    setErrorMessage(message);
                }
            } finally {
                if (!didCancel) {
                    setIsLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            didCancel = true;
        };
    }, []);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredUsers = useMemo(() => {
        return dashboard.users.filter((user) =>
            userMatchesSearch(user, normalizedSearch),
        );
    }, [dashboard.users, normalizedSearch]);

    const filteredCourses = useMemo(() => {
        return dashboard.courses.filter((course) =>
            courseMatchesSearch(course, normalizedSearch),
        );
    }, [dashboard.courses, normalizedSearch]);

    const filteredSessions = useMemo(() => {
        return dashboard.recentSessions.filter((session) =>
            sessionMatchesSearch(session, normalizedSearch),
        );
    }, [dashboard.recentSessions, normalizedSearch]);

    if (isLoading) {
        return (
            <main className="admin-page">
                <div className="admin-page__state-card">
                    Loading admin dashboard...
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            {errorMessage && (
                <div className="admin-page__error-banner">
                    <strong>Dashboard warning:</strong> {errorMessage}
                </div>
            )}

            <section className="admin-page__header">
                <div>
                    <p className="admin-page__eyebrow">Admin Dashboard</p>
                    <h1 className="admin-page__title">Platform Analytics</h1>
                    <p className="admin-page__subtitle">
                        Track learners, course progress, enrollments, active
                        sessions, and watch-time behavior.
                    </p>
                </div>

                <div className="admin-page__header-actions">
                    <span className="admin-page__live-pill">
                        {dashboard.summary.activeSessions} active now
                    </span>
                </div>
            </section>

            <div className="admin-page__content">
                <section className="admin-summary-grid">
                    <SummaryCard
                        label="Total Users"
                        value={dashboard.summary.totalUsers.toString()}
                    />
                    <SummaryCard
                        label="Courses"
                        value={dashboard.summary.totalCourses.toString()}
                    />
                    <SummaryCard
                        label="Enrollments"
                        value={dashboard.summary.totalEnrollments.toString()}
                    />
                    <SummaryCard
                        label="Active Sessions"
                        value={dashboard.summary.activeSessions.toString()}
                    />
                    <SummaryCard
                        label="Avg. Progress"
                        value={`${dashboard.summary.averageProgressPercent}%`}
                    />
                    <SummaryCard
                        label="Active Watch Time"
                        value={formatSeconds(
                            dashboard.summary.totalActiveSeconds,
                        )}
                    />
                </section>

                <section className="admin-toolbar">
                    <div className="admin-tabs">
                        {ANALYTICS_TAB_ITEMS.map((tab) => (
                            <button
                                className={
                                    activeTab === tab.id
                                        ? 'admin-tabs__button admin-tabs__button--active'
                                        : 'admin-tabs__button'
                                }
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSearchTerm('');
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab !== 'overview' && (
                        <label className="admin-search">
                            <span className="admin-search__label">Search</span>
                            <input
                                className="admin-search__input"
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder={getSearchPlaceholder(activeTab)}
                            />
                        </label>
                    )}
                </section>

                {activeTab === 'overview' && (
                    <OverviewTab
                        courses={dashboard.courses}
                        sessions={dashboard.recentSessions}
                        selectedSession={selectedSession}
                        onSelectSession={setSelectedSession}
                    />
                )}

                {activeTab === 'users' && <UsersTab users={filteredUsers} />}

                {activeTab === 'courses' && (
                    <CoursesTab courses={filteredCourses} />
                )}

                {activeTab === 'sessions' && (
                    <SessionsTab
                        sessions={filteredSessions}
                        selectedSession={selectedSession}
                        onSelectSession={setSelectedSession}
                    />
                )}
            </div>
        </main>
    );
}
