import './NavBar.css';

import { Link } from 'react-router-dom';

import type { NavLink } from '../../config/navigation';
import { useAuth } from '../../context/useAuth';

type NavBarProps = {
    links: NavLink[];
    onLoginClick: () => void;
    onRegisterClick: () => void;
};

function NavBar({ links, onLoginClick, onRegisterClick }: NavBarProps) {
    const { user, isLoading, logout } = useAuth();

    return (
        <nav className="nav-bar">
            {links.map((link) => (
                <Link className="nav-bar__link" key={link.href} to={link.href}>
                    {link.label}
                </Link>
            ))}

            <div className="nav-bar__auth">
                {isLoading ? null : user ? (
                    <div className="nav-bar__profile-menu">
                        <Link
                            className="nav-bar__profile-trigger"
                            to="/profile"
                        >
                            <span>{user.displayName}</span>
                            <span className="nav-bar__profile-arrow">▾</span>
                        </Link>

                        <div className="nav-bar__profile-dropdown">
                            <button
                                className="nav-bar__dropdown-button"
                                type="button"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            className="nav-bar__button"
                            type="button"
                            onClick={onLoginClick}
                        >
                            Login
                        </button>

                        <button
                            className="nav-bar__button nav-bar__button--primary"
                            type="button"
                            onClick={onRegisterClick}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
export default NavBar;
