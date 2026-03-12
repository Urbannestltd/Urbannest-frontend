import { Divider } from "@/components/ui/divider"
import { Tabs } from "@chakra-ui/react"
import { Overview } from "./overview"
import { Properties } from "@/utils/model"

export const PropertyTabs = ({ property }: { property?: Properties }) => {

    return (
        <Tabs.Root variant={'line'} defaultValue="overview">
            <Tabs.List gap={10}>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="units">Units</Tabs.Trigger>
                <Tabs.Trigger value="tickets">Tickets</Tabs.Trigger>
                <Tabs.Trigger value="Documents">Documents</Tabs.Trigger>
                <Tabs.Indicator bg={'white'} shadow={'none'} />
            </Tabs.List>
            <Divider my={0} />
            <Tabs.Content value="overview">
                <Overview property={property} />
            </Tabs.Content>
            <Tabs.Content value="units"></Tabs.Content>
            <Tabs.Content value="tickets"></Tabs.Content>
            <Tabs.Content value="Documents"></Tabs.Content>

        </Tabs.Root>
    )
}