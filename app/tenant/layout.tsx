import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { UserNav } from "./user-nav"
import { SideBarSetup } from "./page"
import { Box } from "@chakra-ui/react"

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
                        <UserNav />
                        {children}
                    </div>
                </Box>
            </div>
        </RequireAuth>
    ) //<>{children}</RequireAuth></>;
}
