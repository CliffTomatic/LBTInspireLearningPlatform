import { Outlet } from 'react-router-dom';

import MainHeader from '../components/MainHeader/MainHeader';
import Footer from '../components/Footer/Footer';

import { useState } from 'react';
import LoginModal from '../components/Auth/LoginModal/LoginModal';
import RegisterModal from '../components/Auth/RegisterModal/RegisterModal';

export type AuthModalContext = {
    openLogin: () => void;
    openRegister: () => void;
};

export default function RootLayout() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    function openLogin() {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    }

    function openRegister() {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    }

    function closeAuthModals() {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
    }

    return (
        <div className="app">
            <MainHeader
                onLoginClick={openLogin}
                onRegisterClick={openRegister}
            />
            <main className="app__main">
                <Outlet context={{ openLogin, openRegister }} />
            </main>
            <LoginModal
                isOpen={isLoginOpen}
                onClose={closeAuthModals}
                onSwitchToRegister={openRegister}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={closeAuthModals}
                onSwitchToLogin={openLogin}
            />
            <Footer />
        </div>
    );
}
