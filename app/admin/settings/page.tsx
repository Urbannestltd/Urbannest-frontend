'use client'
import { Button, Center, Heading, Tabs } from "@chakra-ui/react"
import { NotifPref } from "./notif-pref"
import { SecurityPrivacy } from "./security-privacy"
import { useEffect } from "react"
import { useSettingStore } from "@/store/tenant/settings"
import { LuX } from "react-icons/lu"

export default function Settings() {
    //const fetchSettings = useSettingStore((state) => state.fetchUserSettings);

    /*useEffect(() => {
        fetchSettings()
    })*/
    return (
        <Tabs.Root variant={'plain'} defaultValue={'notification-preferences'} orientation="vertical">
            <Tabs.List mt={'50px'} w={'20%'} ml={'36px'}>
                <Heading mb={'42px'} fontSize={'24px'} className="satoshi-bold" letterSpacing={'3px'}>Settings</Heading>
                {Tabss.map((tab, index) => (
                    <Tabs.Trigger _selected={{ fontWeight: 700 }} key={index} p={2} className="w-fit " textAlign={'start'} value={tab.value}>{tab.title}</Tabs.Trigger>
                ))}
                <Tabs.Indicator bg={'#3F4A641A'} rounded={'full'} />
            </Tabs.List>
            <Tabs.Content mt={'126px'} ml={'96px'} w={'90%'} value={'notification-preferences'}>
                <NotifPref />
            </Tabs.Content>
            <Tabs.Content mt={'116px'} ml={'96px'} w={'90%'} value={'security-privacy'}>
                <SecurityPrivacy />
            </Tabs.Content>
            <Center boxSize={'30px'} mt={'50px'} rounded={'full'} cursor={'pointer'} onClick={() => window.history.back()} p={1} bg={'#ECEDF0'} ><LuX size={20} /></Center>
        </Tabs.Root>
    )
}

const Tabss = [
    {
        title: 'Notification Preferences',
        value: 'notification-preferences'
    },
    {
        title: 'Security & Privacy',
        value: 'security-privacy'
    },
]