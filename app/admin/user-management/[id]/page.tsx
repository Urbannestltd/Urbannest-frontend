'use client'
import { PageTitle } from "@/components/ui/page-title";
import { useUserStore } from "@/store/admin/user";
import { Breadcrumb, Button, Flex, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Tenant from "./tenant";
import { Admin } from "./admin";
import { Landlord } from "./landlord";
import { Agent } from "./agent";
import { FacilityManager } from "./facility-manager";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { activateUser, suspendUser } from "@/services/admin/user";

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

export function SuspendPopUp({ userId, onClose }: { userId: string, onClose: () => void }) {
    const fetchUser = useUserStore(state => state.fetchUser)

    const suspendUsers = useMutation({
        mutationFn: () => suspendUser(userId),
        onSuccess: (response) => {
            toast.success(response.message)
            onClose()
            fetchUser(userId)
        }
    })
    return <>
        <Flex direction={'column'} mt={4} p={4} align={'center'}>
            <Text fontSize={'18px'} mb={2} className="satoshi-bold capitalize">Suspend this user</Text>
            <Text w={'full'} textWrap={'wrap'} mb={4} color={'#303030'} textAlign={'center'}  >Are you sure you want to suspend this user? They will lose access to their account until reinstated</Text>
            <Button h={'45px'} onClick={() => suspendUsers.mutate()} w={'full'} color={'white'} bg={'#C00F0C'}>Suspend User</Button>
        </Flex>
    </>
}