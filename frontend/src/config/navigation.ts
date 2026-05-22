export type NavLink = {
    label: string;
    href: string;
}

export const mainNavLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blogs" },
    { label: "Admin", href: "/admin" }
];