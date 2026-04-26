export type NavLink = {
    label: string;
    href: string;
}

export const mainNavLinks: NavLink[] = [
    {label: "Home", href: "/"},
    {label: "Courses", href: "/courses"},
    {label: "Admin", href: "/admin"}
];