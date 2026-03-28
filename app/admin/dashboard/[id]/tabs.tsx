import { Divider } from "@/components/ui/divider"
import { Flex, Menu, Portal, Tabs } from "@chakra-ui/react"
import { Overview } from "./overview"
import { Properties } from "@/utils/model"
import { Property } from "@/store/admin/properties"
import { Unit } from "./unit"
import { useState } from "react"
import { LuEllipsis, LuEllipsisVertical } from "react-icons/lu"
import { Tickets } from "./tickets"
import { Modal } from "@/components/ui/dialog"
import { AddMemberModal } from "./add-modal"

export const PropertyTabs = ({ property, setTab }: { property?: Property | null, setTab: (tab: string) => void }) => {


    return (
        <Tabs.Root variant={'line'} defaultValue="overview">
            <Flex justify={'space-between'}>
                <Tabs.List gap={10}>
                    <Tabs.Trigger value="overview" onClick={() => setTab('Overview')}>Overview</Tabs.Trigger>
                    <Tabs.Trigger value="units" onClick={() => setTab('Units')}>Units</Tabs.Trigger>
                    <Tabs.Trigger value="tickets" onClick={() => setTab('Tickets')}>Tickets</Tabs.Trigger>
                    <Tabs.Indicator bg={'transparent'} shadow={'none'} />
                </Tabs.List>
                <Menu.Root>
                    <Menu.Trigger>
                        <LuEllipsisVertical size={20} />
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Modal triggerElement={<Menu.Item value="assign-members" className="satoshi-medium">Assign Members</Menu.Item>} modalContent={<AddMemberModal propertyId={property?.id} unitId="" />} />
                                <Menu.Item value="delete-property" className="satoshi-medium" color={'#C00F0C'}>Delete Property</Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
            <Divider my={0} />
            <Tabs.Content value="overview">
                <Overview property={property} />
            </Tabs.Content>
            <Tabs.Content value="units">
                <Unit property={property} />
            </Tabs.Content>
            <Tabs.Content value="tickets">
                <Tickets />
            </Tabs.Content>

        </Tabs.Root>
    )
}