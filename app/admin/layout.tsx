import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { AdminNav } from "./admin-nav"
import { AdminSideBarSetup } from "./dashboard/page"
import { Box } from "@chakra-ui/react"

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
            <div className="flex h-screen">
                <AdminSideBarSetup />
                <Box
                    position="absolute"
                    color="blue.900"
                    top="0rem"
                    left="17rem"
                    p={{ base: 4, md: 8 }}
                    w="calc(100vw - 17rem)"
                    className="scrollbar-hide"
                >
                    <div className=" w-full max-w-[1440px]">
                        <AdminNav />
                        {children}
                    </div>
                </Box>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
