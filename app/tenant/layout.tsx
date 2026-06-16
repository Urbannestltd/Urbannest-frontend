import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { SideBarSetup } from "./page"
import { PageContainer } from "@/components/ui/page-container"
import { TenantSidebar } from "@/components/common/side-bar"
import { Nav } from "@/components/common/nav-bar"

export const metadata: Metadata = {
    title: "Tenant Dashboard",
    description: "Welcome to the Tenant Dashboard",
    keywords: "tenant dashboard",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RequireAuth>
            <div className="flex h-screen">
                <div className="hidden md:block">
                    <TenantSidebar />
                </div>
                <PageContainer left={'17rem'} >
                    <div className=" w-full max-w-[1440px]">
                        <Nav role='tenant' />
                        {children}
                    </div>
                </PageContainer>
            </div>
        </RequireAuth>
    )
}
