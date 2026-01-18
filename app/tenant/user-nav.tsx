'use client'
import { PageTitle } from "@/components/ui/page-title"
import { Flex, HStack } from "@chakra-ui/react"
import { Notifications } from "@/components/common/notifications"
import useAuthStore from "@/store/auth"
import { Avatar } from "@/components/ui/avatar"

export const UserNav = () => {
    const { user } = useAuthStore()
    return (
        <HStack justify={"space-between"}>
            <PageTitle title={`Hello, ${user?.name}`} subText="Welcome to your dashboard!" />
            <Flex gap={4} align={"center"}>
                <Notifications />
                <Avatar
                    name={user?.name}
                    size='xs'
                />
            </Flex>
        </HStack>
    )
}