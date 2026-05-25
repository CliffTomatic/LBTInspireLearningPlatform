import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './AdminSidebar.css';
import type { AdminPage } from '../../../types/Admin';

type SidebarItem = {
    slug: AdminPage;
    label: string;
    description: string;
    symbol: string;
};

// Sidebar cards that will be displayed
const sidebarItems: SidebarItem[] = [
    {
        slug: 'dashboard',
        label: 'Dashboard',
        description: 'Main admin overview',
        symbol: '▦',
    },
    {
        slug: 'analytics',
        label: 'Analytics',
        description: 'Learners and progress',
        symbol: '◉',
    },
];

export default function AdminSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const activeItem = currentPath.split('/')[2] ?? 'dashboard';

    const [isOpen, setIsOpen] = useState(() => {
        const savedValue = localStorage.getItem('adminSidebarOpen');

        if (savedValue === null) {
            return true;
        }

        return savedValue === 'true';
    });

    useEffect(() => {
        localStorage.setItem('adminSidebarOpen', String(isOpen));
    }, [isOpen]);

    if (!isOpen) {
        return (
            <button
                className="admin-sidebar-handle admin-sidebar-handle--closed"
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open admin sidebar"
                title="Open sidebar"
            >
                <span className="admin-sidebar-handle__bars">| | |</span>
            </button>
        );
    }

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__top">
                <div>
                    <a href="/" className="noDecor">
                        <p className="admin-sidebar__eyebrow">LBT Pulse</p>
                        <h2 className="admin-sidebar__title">Admin</h2>
                    </a>
                </div>

                <button
                    className="admin-sidebar-handle admin-sidebar-handle--open"
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close admin sidebar"
                    title="Close sidebar"
                >
                    <span className="admin-sidebar-handle__bars">| | |</span>
                </button>
            </div>

            <nav className="admin-sidebar__nav" aria-label="Admin navigation">
                {sidebarItems.map((item) => (
                    <Link
                        className={
                            activeItem === item.slug
                                ? 'admin-sidebar__item admin-sidebar__item--active'
                                : 'admin-sidebar__item'
                        }
                        key={item.slug}
                        type="button"
                        to={`/admin/${item.slug}`}
                    >
                        <span className="admin-sidebar__item-symbol">
                            {item.symbol}
                        </span>

                        <span className="admin-sidebar__item-copy">
                            <span className="admin-sidebar__item-label">
                                {item.label}
                            </span>
                            <span className="admin-sidebar__item-description">
                                {item.description}
                            </span>
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="admin-sidebar__section">
                <p className="admin-sidebar__section-label">Analytics</p>

                <div className="admin-sidebar__mini-card">
                    <span className="admin-sidebar__mini-card-label">
                        Tracking
                    </span>
                    <strong className="admin-sidebar__mini-card-value">
                        Active
                    </strong>
                </div>

                <div className="admin-sidebar__mini-card">
                    <span className="admin-sidebar__mini-card-label">
                        Data Source
                    </span>
                    <strong className="admin-sidebar__mini-card-value">
                        API
                    </strong>
                </div>
            </div>

            <div className="admin-sidebar__footer">
                <p className="admin-sidebar__footer-title">Admin tools</p>
                <p className="admin-sidebar__footer-text">
                    Users, courses, progress, enrollments, sessions, and watch
                    time.
                </p>
            </div>
        </aside>
    );
}
