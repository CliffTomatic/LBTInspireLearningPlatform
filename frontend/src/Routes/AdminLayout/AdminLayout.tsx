import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar/AdminSidebar';

import './AdminLayout.css';

export default function AdminLayout() {
    return (
        <div className="admin-shell">
            <AdminSidebar />

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
