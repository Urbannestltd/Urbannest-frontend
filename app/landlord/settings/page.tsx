'use client'
import { Heading, Tabs } from "@chakra-ui/react"
import { useEffect } from "react"
import { AccountInfo } from "./account-info"
import { NotifPref } from "./notif-pref"
import { SecurityPrivacy } from "./security-privacy"
import { SupportCenter } from "./support-center/support-center"
import { useLandlordSettingStore } from "@/store/landlord/settings"

export default function Settings() {
    const fetchSettings = useLandlordSettingStore((state) => state.fetchUserSettings)

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    return (
        <Tabs.Root variant={'plain'} defaultValue={'account-info'} orientation="vertical">
            <Tabs.List mt={'50px'} w={'20%'} ml={'36px'}>
                <Heading mb={'42px'} fontSize={'24px'} className="satoshi-bold" letterSpacing={'3px'}>Settings</Heading>
                {tabs.map((tab) => (
                    <Tabs.Trigger _selected={{ fontWeight: 700 }} key={tab.value} p={2} className="w-fit " textAlign={'start'} value={tab.value}>{tab.title}</Tabs.Trigger>
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

const tabs = [
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
    },
]
