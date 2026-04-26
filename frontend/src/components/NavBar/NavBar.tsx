import type { NavLink } from "../../config/navigation";
import "./NavBar.css";
type NavBarProps = {
  links: NavLink[];
};

function NavBar({ links }: NavBarProps) {
  return (
    <div className="nav-bar">
      {links.map((link) => (
        <a className="nav-bar__link" key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </div>
  );
}
export default NavBar;
