import { Outlet } from 'react-router-dom';

import MainHeader from '../components/MainHeader/MainHeader';
import Footer from '../components/Footer/Footer';

function RootLayout() {
    return (
        <div className="app">
            <MainHeader />
            <main className="app__main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default RootLayout;
