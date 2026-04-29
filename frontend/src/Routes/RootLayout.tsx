import { Outlet } from "react-router-dom";

import Footer from '../components/Footer/Footer'
import MainHeader from "../components/MainHeader/MainHeader";

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
