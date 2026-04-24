import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { AdminNav } from "./admin-nav"
import { AdminSideBarSetup } from "./dashboard/page"
import { Box } from "@chakra-ui/react"
import { PageContainer } from "@/components/ui/page-container"

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
                <AdminSideBarSetup />
                <PageContainer left={'17rem'} >
                    <div className=" w-full max-w-[1440px]">
                        <AdminNav />
                        {children}
                    </div>
                </PageContainer>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
