import { apiFetch } from './api';

import type { AdminDashboardResponse } from '../types/Admin';

export function getAdminDashboard() {
    return apiFetch<AdminDashboardResponse>('/api/admin/dashboard');
}
