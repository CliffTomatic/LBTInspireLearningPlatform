import { apiFetch } from './api';
import type {
    ActivateSectionRequest,
    ActivateSectionResponse,
    HeartbeatRequest,
    EndRequest,
} from '../types/Api/Session';

export async function activateSession(request: ActivateSectionRequest) {
    return apiFetch<ActivateSectionResponse>('/api/sessions/activate', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function sendHeartbeat(request: HeartbeatRequest) {
    return apiFetch('/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function endSession(request: EndRequest) {
    return apiFetch('/api/sessions/end', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}
