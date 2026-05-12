import { useEffect, useState } from 'react';

import { getCurrentUser } from '../services/authApi';
import type { CurrentUser } from '../services/authApi';

import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<CurrentUser | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCurrentUser() {
            const token = localStorage.getItem('token');

            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch {
                localStorage.removeItem('token');

                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        loadCurrentUser();
    }, []);

    function login(token: string, user: CurrentUser) {
        localStorage.setItem('token', token);
        setUser(user);
    }

    function logout() {
        localStorage.removeItem('token');

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
