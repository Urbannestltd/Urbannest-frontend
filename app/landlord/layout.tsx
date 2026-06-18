import { Metadata } from "next"
import { RequireAuth } from "../auth/require-auth"
import { PageContainer } from "@/components/ui/page-container"
import { LandlordSidebar } from "@/components/common/side-bar"
import { Nav } from "@/components/common/nav-bar"

export const metadata: Metadata = {
    title: "Landlord Dashboard",
    description: "Welcome to the Landlord Dashboard",
    keywords: "landlord dashboard",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="flex h-screen ">
            <div className="hidden md:block">
                <LandlordSidebar />
            </div>
            <PageContainer left={'17rem'} >
                <div className=" w-full max-w-[1440px]">
                    <Nav role='landlord' />
                    {children}
                </div>
            </PageContainer>
        </div>

    )
}
