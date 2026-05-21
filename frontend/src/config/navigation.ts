export type NavLink = {
    label: string;
    href: string;
}

export const mainNavLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "About", href: "/about" },
    { label: "Connect", href: "/connect" },
    { label: "Admin", href: "/admin" }
];