'use client'
import { PageTitle } from "@/components/ui/page-title"
import { Drawer, Flex, HStack, Menu, Portal } from "@chakra-ui/react"
import { Notifications } from "@/components/common/notifications"
import useAuthStore from "@/store/auth"
import { Avatar } from "@/components/ui/avatar"
import { TenantSidebar } from "./sidebar"
import { MdOutlineMenu } from "react-icons/md"
import { usePathname, useRouter } from "next/navigation"
import Image from 'next/image'
import Logo from '@/app/assets/urbannest-logo.png'
import { useSettingStore } from "@/store/settings"
import toast from "react-hot-toast"
import { useState } from "react"

export const UserNav = () => {
    const { user } = useAuthStore()
    const pathname = usePathname();
    const isSetting = pathname.includes('settings');
    const logoutUser = useAuthStore((state) => state.logoutUser)
    const [openDrawer, setOpenDrawer] = useState(false)
    const router = useRouter();
    const handleLogout = () => {
        logoutUser()
        toast.success('Logged out')
        console.log('logged out')
        router.push('/auth')
    }

    return (
        <HStack justify={"space-between"
        }>
            {
                isSetting ? <Image className='w-[185px] h-10 mt-4 cursor-pointer' onClick={() => router.push('/tenant/dashboard')} src={Logo} alt="logo" /> : <HStack>
                    <Drawer.Root open={openDrawer} onOpenChange={(e) => setOpenDrawer(e.open)} placement={'start'}>
                        <Drawer.Trigger className="inline md:hidden">
                            <MdOutlineMenu className="mr-2 md:mr-0" size={24} />
                        </Drawer.Trigger>
                        <Portal>
                            <Drawer.Backdrop />
                            <Drawer.Positioner>
                                <Drawer.Content w={'fit'}>
                                    <TenantSidebar onClose={() => setOpenDrawer(false)} />
                                </Drawer.Content>
                            </Drawer.Positioner>
                        </Portal>
                    </Drawer.Root>
                    <PageTitle spacing={0} title={`Hello, ${user?.name}`} fontSize={{ base: "20px", md: "25px" }} subText="Welcome to your dashboard!" />
                </HStack>
            }
            < Flex gap={{ base: 2, md: 4 }} align={"center"} >
                <Notifications />
                <Menu.Root variant={'subtle'}>
                    <Menu.Trigger>
                        <Avatar
                            name={user?.name}
                            src={user?.profilePic}
                            size='xs'
                        />
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.ItemGroup>
                                    <Menu.Item className="satoshi-medium" value='profile'> <Avatar
                                        name={user?.name}
                                        src={user?.profilePic}
                                        size='xs'
                                    />{user?.name}</Menu.Item>
                                    <Menu.Item value="setings" onClick={() => router.push('/tenant/settings')}>Settings</Menu.Item>
                                    <Menu.Item value="log-out" color={'red.700'} onClick={handleLogout}>Logout</Menu.Item>
                                </Menu.ItemGroup></Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex >
        </HStack >
    )
}