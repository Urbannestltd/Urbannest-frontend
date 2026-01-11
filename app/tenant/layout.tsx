import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { TenantSidebar } from "./sidebar"
import { Tabs } from "@chakra-ui/react"
import { UserNav } from "./user-nav"

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
        <div className="flex h-screen">
            <div className="relative w-[290px]">
                <TenantSidebar />
            </div>
            <main className="flex-1 p-8 ">
                <UserNav />
                {children}
            </main>
        </div>
    ) //<><RequireAuth>{children}</RequireAuth></>;
}
