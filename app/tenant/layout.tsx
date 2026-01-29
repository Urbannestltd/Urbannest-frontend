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
        <RequireAuth>
            <div className="flex h-screen">
                <div className="relative w-[380px]">
                    <TenantSidebar />
                </div>
                <main className="flex w-full justify-center p-8 ">
                    <div className=" w-full max-w-[1440px]">
                        <UserNav />
                        {children}
                    </div>
                </main>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
