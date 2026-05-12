import { createContext } from 'react';

import type { CurrentUser } from '../services/authApi';

export type AuthContextType = {
    user: CurrentUser | null;
    isLoading: boolean;
    login: (token: string, user: CurrentUser) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
