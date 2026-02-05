'use client'
import { PageTitle } from "@/components/ui/page-title"
import { Drawer, Flex, HStack, Portal } from "@chakra-ui/react"
import { Notifications } from "@/components/common/notifications"
import useAuthStore from "@/store/auth"
import { Avatar } from "@/components/ui/avatar"
import { TenantSidebar } from "./sidebar"
import { MdOutlineMenu } from "react-icons/md"

export const UserNav = () => {
    const { user } = useAuthStore()
    return (
        <HStack justify={"space-between"}>
            <HStack>
                <Drawer.Root placement={'start'}>
                    <Drawer.Trigger className="inline md:hidden">
                        <MdOutlineMenu className="mr-2 md:mr-0" size={24} />
                    </Drawer.Trigger>
                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content w={'fit'}>
                                <TenantSidebar />
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
                <PageTitle spacing={0} title={`Hello, ${user?.name}`} fontSize={{ base: "20px", md: "25px" }} subText="Welcome to your dashboard!" />
            </HStack>
            <Flex gap={{ base: 2, md: 4 }} align={"center"}>
                <Notifications />
                <Avatar
                    name={user?.name}
                    size='xs'
                />
            </Flex>
        </HStack>
    )
}