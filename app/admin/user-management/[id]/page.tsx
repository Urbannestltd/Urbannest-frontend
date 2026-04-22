'use client'
import { PageTitle } from "@/components/ui/page-title";
import { useUserStore } from "@/store/admin/user";
import { Breadcrumb, Flex, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Tenant from "./tenant";
import { Admin } from "./admin";
import { Landlord } from "./landlord";
import { Agent } from "./agent";
import { FacilityManager } from "./facility-manager";

export default function UserPage() {
    const params = useParams();
    const id = params?.id as string
    const user = useUserStore(state => state.user)
    const isLoading = useUserStore(state => state.isLoading)
    const fetchUser = useUserStore(state => state.fetchUser)
    const fetchActivities = useUserStore(state => state.fetchActivities)

    useEffect(() => {
        if (!id) return
        fetchUser(id)
        fetchActivities(id)
    }, [id])


    if (isLoading || !user) {
        return (
            <Flex align={'center'} justify={'center'} p={2}>
                {isLoading ? <Text>Loading...</Text> : <Text className="satoshi-bold text-2xl">User not found</Text>}
            </Flex>
        )
    }
    const roleComponents: Record<string, React.ComponentType<{ userId: string }>> = {
        ADMIN: Admin,
        TENANT: Tenant,
        LANDLORD: Landlord,
        AGENT: Agent,
        FACILITY_MANAGER: FacilityManager
    }
    const RoleComponent = roleComponents[user.role?.toUpperCase()]


    if (!RoleComponent) return null

    return (
        <div>
            <PageTitle title="User Management" fontSize={'22px'} />
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/admin/user-management">
                            User Management
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">
                            {user?.fullName}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <RoleComponent userId={user.id} />
        </div>
    )
}