import VideoCarousel from '../components/VideoCarousel/VideoCarousel';
import HeroBanner from '../components/Home/HeroBanner';
import LoginModal from '../components/Auth/LoginModal/LoginModal';
import RegisterModal from '../components/Auth/RegisterModal/RegisterModal';

import { useState } from 'react';

function HomePage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <>
            <HeroBanner onLoginClick={() => setIsLoginOpen(true)} />
            <VideoCarousel />
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </>
    );
}

export default HomePage;
