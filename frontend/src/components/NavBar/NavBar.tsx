import "./NavBar.css";
import { Link } from "react-router-dom";
import type { NavLink } from "../../config/navigation";

type NavBarProps = {
    links: NavLink[];
};

function NavBar({ links }: NavBarProps) {
    return (
        <nav className="nav-bar">
            {links.map((link) => (
                <Link className="nav-bar__link" key={link.href} to={link.href}>
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
export default NavBar;
