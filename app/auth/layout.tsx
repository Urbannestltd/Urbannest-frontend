import { NavBar } from "@/components/common/nav-bar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <><NavBar />{children}</>;
}