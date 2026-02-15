import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { UserNav } from "./user-nav"
import { SideBarSetup } from "./page"

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
                <main className="flex w-full justify-center p-4 lg:p-8 ">
                    <div className=" w-full max-w-[1440px]">
                        <UserNav />
                        {children}
                    </div>
                </main>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
