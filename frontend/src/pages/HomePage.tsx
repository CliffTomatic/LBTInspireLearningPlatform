import VideoCarousel from '../components/VideoCarousel/VideoCarousel';
import HeroBanner from '../components/Home/HeroBanner';
// import LoginModal from '../components/Auth/LoginModal/LoginModal';
// import RegisterModal from '../components/Auth/RegisterModal/RegisterModal';

import { useOutletContext } from 'react-router-dom';
import type { AuthModalContext } from '../routes/RootLayout';

function HomePage() {
    const { openLogin, openRegister } = useOutletContext<AuthModalContext>();

    return (
        <>
            <HeroBanner
                onLoginClick={openLogin}
                onRegisterClick={openRegister}
            />
            <VideoCarousel />
        </>
    );
}

export default HomePage;
