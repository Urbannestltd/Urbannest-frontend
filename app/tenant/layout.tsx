import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { UserNav } from "./user-nav"
import { SideBarSetup } from "./page"
import { Box, Flex } from "@chakra-ui/react"
import { PageContainer } from "@/components/ui/page-container"

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
                <SideBarSetup />
                <PageContainer left={'15rem'} >
                    <div className=" w-full max-w-[1440px]">
                        <UserNav />
                        {children}
                    </div>
                </PageContainer>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
