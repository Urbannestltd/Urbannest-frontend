'use client'
import { Box, Button, Tabs, Text } from "@chakra-ui/react"
import Image from "next/image"
import Logo from '@/app/assets/urbannest-logo-white.png'
import { sidebarLinks } from "@/utils/data";
import { LuLogOut, LuSettings } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";


export const TenantSidebar = ({ onClose }: { onClose?: () => void }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { logoutUser } = useAuthStore()

    const getActiveTab = () => {
        if (pathname.includes('tenant/dashboard')) return 'dashboard'
        if (pathname.includes('tenant/lease')) return 'lease'
        if (pathname.includes('tenant/maintenance')) return 'maintenance'
        if (pathname.includes('tenant/visitors')) return 'visitors'
        return 'dashboard'
    };

    const activeTab = getActiveTab();

    const handleLogout = () => {
        logoutUser()
        console.log('logged out')
        router.push('/auth')
    }

    return (
        <Tabs.Root variant={'plain'} orientation='vertical' position={'fixed'} defaultValue={activeTab} zIndex={'modal'} lazyMount unmountOnExit value={activeTab}>
            <Tabs.List className="flex flex-col justify-between" h={'100vh'} w={'280px'} color={'white'} p={'32px 24px'} pr={14} bg={'#141822'}>
                <div>
                    <Image src={Logo} onClick={() => router.push('/')} className="w-[147.5px] mb-[54px]" alt="" />
                    <Text className="satoshi-bold text-[10px] mb-4 tracking-[0.2em] mt-4 uppercase">Menu</Text>
                    {sidebarLinks.map((link) =>
                        <Tabs.Trigger w={'full'} value={link.value} className="" p={2} onClick={() => { router.push(link.href); onClose && onClose() }} key={link.href}>
                            <Image alt='image' src={link.icon} /> {link.title}
                        </Tabs.Trigger>)}
                    <Tabs.Indicator className="satoshi-bold" bg={'#2A3348'} />
                </div>
                <Box className=" mb-4 mt-4 ">
                    <Text className="satoshi-bold text-[10px] mb-4 tracking-[0.2em] mt-4 uppercase">Settings</Text>
                    <Button onClick={() => router.push('/tenant/settings')} className=" hover:bg-button-hover w-full flex justify-start pl-2">
                        <LuSettings /> Settings
                    </Button>
                    <Button onClick={handleLogout} className=" hover:bg-button-hover w-full flex justify-start pl-2">
                        <LuLogOut size={4} />Logout</Button>
                </Box>
            </Tabs.List>
        </Tabs.Root>)
}

