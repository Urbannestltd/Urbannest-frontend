import { Metadata } from "next";
import { RequireAuth } from "../auth/require-auth";

export const metadata: Metadata = {
    title: 'Tour Builder Dashboard | Create Interactive Onboarding Tours',
    description: 'Build, manage, and analyze interactive onboarding tours for your website',
    keywords: 'onboarding, tours, user guide, tutorials, product tours',
};


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <><RequireAuth>{children}</RequireAuth></>;
}
