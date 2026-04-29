import NavBar from "../NavBar/NavBar";
import { mainNavLinks } from "../../config/navigation";
import "./MainHeader.css";

function MainHeader() {
    return (
        <header className="site-header">
            <div className="site-header__content page-container">
                <div className="site-header_title-container">
                    <h1 className="site-header__title">Pulse</h1>
                    <h1 className="site-header__subtitle">by LearnBasicTech</h1>
                </div>
                <NavBar links={mainNavLinks} />
            </div>
        </header>
    );
}
export default MainHeader;
