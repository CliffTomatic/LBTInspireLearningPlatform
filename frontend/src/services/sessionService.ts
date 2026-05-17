import { apiFetch } from './api';
import type {
    StartSessionRequest,
    StartSessionResponse,
    HeartbeatRequest,
    EndRequest,
} from '../types/Api/Session';

export async function startSession(request: StartSessionRequest) {
    return apiFetch<StartSessionResponse>('/api/sessions/start', {
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
