'use client'
import { Heading, Tabs } from "@chakra-ui/react"
import { AccountInfo } from "./account-info"
import { NotifPref } from "./notif-pref"
import { SecurityPrivacy } from "./security-privacy"
import { SupportCenter } from "./support-center/support-center"
import { useEffect } from "react"
import { useSettingStore } from "@/store/settings"

export default function Settings() {

    const fetchSettings = useSettingStore((state) => state.fetchUserSettings);

    useEffect(() => {
        fetchSettings()
    })
    return (
        <Tabs.Root variant={'plain'} defaultValue={'account-info'} orientation="vertical">
            <Tabs.List mt={'50px'} w={'20%'} ml={'36px'}>
                <Heading mb={'42px'} fontSize={'24px'} className="satoshi-bold" letterSpacing={'3px'}>Settings</Heading>
                {Tabss.map((tab, index) => (
                    <Tabs.Trigger _selected={{ fontWeight: 700 }} key={index} p={2} className="w-fit " textAlign={'start'} value={tab.value}>{tab.title}</Tabs.Trigger>
                ))}
                <Tabs.Indicator bg={'#3F4A641A'} rounded={'full'} />
            </Tabs.List>
            <Tabs.Content mt={'116px'} w={'90%'} ml={'96px'} value={'account-info'}>
                <AccountInfo />
            </Tabs.Content>
            <Tabs.Content mt={'126px'} ml={'96px'} w={'90%'} value={'notification-preferences'}>
                <NotifPref />
            </Tabs.Content>
            <Tabs.Content mt={'116px'} ml={'96px'} w={'90%'} value={'security-privacy'}>
                <SecurityPrivacy />
            </Tabs.Content>
            <Tabs.Content mt={'126px'} ml={'96px'} w={'90%'} value={'support-center'}>
                <SupportCenter />
            </Tabs.Content>
        </Tabs.Root>
    )
}

const Tabss = [
    {
        title: 'Account Information',
        value: 'account-info'
    },
    {
        title: 'Notification Preferences',
        value: 'notification-preferences'
    },
    {
        title: 'Security & Privacy',
        value: 'security-privacy'
    },
    {
        title: 'Support Center',
        value: 'support-center'
    }
]