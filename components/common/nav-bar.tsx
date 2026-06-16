"use client"
import Image from "next/image"
import Logo from "@/app/assets/urbannest-logo.png"

export const NavBar = () => {
    return (
        <nav className="mt-10 mx-4">
            <Image className="w-[185px] h-10 mt-4" src={Logo} alt="logo" />
        </nav>
    )
}

import { PageTitle } from "@/components/ui/page-title"
import { Drawer, Flex, HStack, Menu, Portal, Stack } from "@chakra-ui/react"
import { Notifications } from "@/components/common/notifications"
import useAuthStore from "@/store/auth"
import { Avatar } from "@/components/ui/avatar"
import { MdOutlineMenu } from "react-icons/md"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useState } from "react"
import { AdminSidebar, FMSidebar, TenantSidebar } from "@/components/common/side-bar"
import { Drawers } from "../ui/drawer"

export const Nav = ({ role }: { role: "tenant" | "facilitymanager" | "admin" | "landlord" | "agent" }) => {
    const { user } = useAuthStore()
    const pathname = usePathname()
    const isSetting = pathname.includes("settings")
    const isMobile = window.innerWidth < 600
    const logoutUser = useAuthStore((state) => state.logoutUser)
    const [openDrawer, setOpenDrawer] = useState(false)
    const router = useRouter()
    const handleLogout = () => {
        logoutUser()
        toast.success("Logged out")
        router.push("/auth")
    }

    const nav: Record<"tenant" | "facilitymanager" | "admin" | "landlord" | "agent", { path: string, component: React.ReactNode, settingsPath: string, subtitle: string }> = {
        tenant: {
            path: "/tenant/dashboard",
            component: <TenantSidebar onClose={() => setOpenDrawer(false)} />,
            settingsPath: '/tenant/settings',
            subtitle: "Here is what's happening across UrbanNest today."
        },
        facilitymanager: {
            path: "/facility-manager/dashboard",
            component: <FMSidebar onClose={() => setOpenDrawer(false)} />,
            settingsPath: '/facility-manager/settings',
            subtitle: "Here is what's happening across UrbanNest today."
        },
        admin: {
            path: "/admin/dashboard",
            component: <AdminSidebar onClose={() => setOpenDrawer(false)} />,
            settingsPath: '/admin/settings',
            subtitle: ''
        },
        landlord: {
            path: "/landlord/dashboard",
            component: <FMSidebar onClose={() => setOpenDrawer(false)} />,
            settingsPath: '/landlord/settings',
            subtitle: ''
        },
        agent: {
            path: "/agent/dashboard",
            component: <FMSidebar onClose={() => setOpenDrawer(false)} />,
            settingsPath: '/agent/settings',
            subtitle: ''
        }
    }

    const { path, component, settingsPath, subtitle } = nav[role]

    return (
        <HStack mb={4} bg={"transparent"} align={"start"} justify={"space-between"}>
            {isSetting ? (
                <Image
                    className="w-[185px] h-10 mt-4 cursor-pointer"
                    onClick={() => router.push(path)}
                    src={Logo}
                    alt="logo"
                />
            ) : (
                <Stack direction={{ base: "column", md: "row" }}>
                    {isMobile && <Drawers
                        placement="start"
                        open={openDrawer}
                        size={'full'}
                        className="w-[280px]"
                        onOpenChange={setOpenDrawer}
                        modalContent={
                            component
                        }
                        triggerElement={
                            <MdOutlineMenu className="mr-2 md:mr-0" size={24} />
                        }
                    />}
                    <PageTitle
                        spacing={0}
                        title={`Welcome, ${user?.name}`}
                        fontSize={{ base: "20px", md: "25px" }}
                        subText={subtitle + " "}
                    />
                </Stack>
            )}
            <Flex gap={{ base: 2, md: 4 }} align={"center"}>
                <Notifications />
                <Menu.Root variant={"subtle"}>
                    <Menu.Trigger>
                        <Avatar name={user?.name} src={user?.profilePic} size="xs" />
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.ItemGroup>
                                    <Menu.Item className="satoshi-medium" value="profile">
                                        {" "}
                                        <Avatar
                                            name={user?.name}
                                            src={user?.profilePic}
                                            size="xs"
                                        />
                                        {user?.name}
                                    </Menu.Item>
                                    <Menu.Item
                                        value="setings"
                                        onClick={() => router.push(settingsPath)}
                                    >
                                        Settings
                                    </Menu.Item>
                                    <Menu.Item
                                        value="log-out"
                                        color={"red.700"}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.ItemGroup>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
        </HStack>
    )
}
