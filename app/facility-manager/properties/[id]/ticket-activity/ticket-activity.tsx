
import { SectionBox } from "@/components/ui/section-box"
import { ExpenseLogging } from "./expense-logging"
import { Tabs } from "@chakra-ui/react"
import { Chat } from "./chat"
import { Divider } from "@/components/ui/divider"

export const TicketActivity = ({ id }: { id: string }) => {

    return (
        <SectionBox bg={"#FFFFFF"} mt={8} pt={0} px={0}>
            <Tabs.Root defaultValue={'activity'}>
                <Tabs.List alignContent={'center'} color={''} borderBottom={'1px solid #A9B4B91A'}>
                    <Tabs.Trigger justifyContent={'center'} w={'full'} px={{ base: '12px', md: '32px' }} py={'30px'} _selected={{ fontWeight: 700 }} className="satoshi-bold" value={'activity'}>Ticket Chat</Tabs.Trigger>
                    <Tabs.Trigger justifyContent={'center'} w={'full'} px={{ base: '12px', md: '32px' }} py={'30px'} _selected={{ fontWeight: 700 }} className="satoshi-bold" value={'comments'}>Expense Logging</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={'activity'}>
                    <Chat id={id} />
                </Tabs.Content>
                <Tabs.Content value={'comments'}>
                    <ExpenseLogging id={id} />
                </Tabs.Content>

            </Tabs.Root >



        </SectionBox >
    )
}


