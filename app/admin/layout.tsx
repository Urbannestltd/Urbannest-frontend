import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { PageContainer } from "@/components/ui/page-container"
import { AdminSidebar } from "@/components/common/side-bar"
import { Nav } from "@/components/common/nav-bar"

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Welcome to the Admin Dashboard",
    keywords: "admin dashboard",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RequireAuth>
            <div className="flex h-screen ">
                <div className="hidden md:block">
                    <AdminSidebar />
                </div>
                <PageContainer left={'17rem'} >
                    <div className=" w-full max-w-[1440px]">
                        <Nav role='admin' />
                        {children}
                    </div>
                </PageContainer>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
