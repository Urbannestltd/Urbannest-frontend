/* eslint-disable react/display-name */
import { Divider } from "@/components/ui/divider"
import { Flex, Tabs } from "@chakra-ui/react"
import { Overview } from "./overview"
import { Unit } from "./unit"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Property } from "@/store/landlord/properties"

interface Props {
    property?: Property | null
    setTab: (tab: string) => void

}

export const PropertyTabs = React.forwardRef<{ handleSave: () => void }, Props>(({ property, setTab }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')
    const [activeTab, setActiveTab] = useState(tab ?? 'overview')


    return (
        <Tabs.Root variant={'line'} value={activeTab} onValueChange={(tab) => setActiveTab(tab.value)} defaultValue={activeTab}>
            <Flex justify={'space-between'}>
                <Tabs.List gap={10}>
                    <Tabs.Trigger value="overview" onClick={() => setTab('Overview')}>Overview</Tabs.Trigger>
                    <Tabs.Trigger value="units" onClick={() => setTab('Units')}>Units</Tabs.Trigger>
                    <Tabs.Indicator bg={'transparent'} shadow={'none'} />
                </Tabs.List>
            </Flex>
            <Divider my={0} />
            <Tabs.Content value="overview">
                <Overview ref={ref} property={property} />
            </Tabs.Content>
            <Tabs.Content value="units">
                <Unit />
            </Tabs.Content>

        </Tabs.Root>
    )
})
