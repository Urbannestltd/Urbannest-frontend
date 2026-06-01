import { MainButton } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { TickettData } from "@/utils/data"
import { createListCollection, Flex, HStack, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuUser } from "react-icons/lu"
import { useTicketColumns } from "./ticket-columns"
import { Modal } from "@/components/ui/dialog"
import { TenantMaintenanceModal } from "@/app/tenant/maintenance/modal"
import { useEffect, useState } from "react"
import { MobileTable } from "./ticket-mobile-table"
import emptyTicketIcon from '@/app/assets/icons/facilty-icons/ticket-empty.svg'
import { useTicketStore } from "@/store/fm/ticket"
import { TicketPage } from "./ticket"

export const Tickets = ({ propertyId }: { propertyId: string }) => {

    const { control, handleSubmit } = useForm()
    const columns = useTicketColumns()
    const tickets = useTicketStore(state => state.ticketsPerProperty)
    const fetchAllTickets = useTicketStore(state => state.fetchTicketPerProperty)
    const [search, setSearch] = useState('')
    const isMobile = window.innerWidth < 600

    useEffect(() => {
        if (!propertyId) return
        fetchAllTickets(propertyId)
    }, [propertyId])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllTickets(propertyId, search || undefined)
        }, 100)
        return () => clearTimeout(timer)
    }, [search])

    const [openModal, setOpenModal] = useState(false)
    const [id, setId] = useState('')
    return (
        <>{openModal ? <TicketPage id={id} /> : <>
            <SectionBox>
                <PageTitle title="Maintenance Tickets" fontSize={'18px'} />
                <Stack direction={{ base: 'column', md: 'row' }} mt={4} justify={'space-between'}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(val) => fetchAllTickets(propertyId, val)}
                        width={'308px'} />
                    <Flex justify={'center'} gap={2.5} align={'end'}>
                        <CustomSelect control={control} size={'sm'} name="status" width={'97px'} placeholder="All Types" collection={items} />
                    </Flex>
                </Stack>
            </SectionBox >
            {isMobile ?
                <MobileTable data={tickets} tableName="Tickets" emptyDetails={{ icon: emptyTicketIcon.src, title: 'No tickets found', description: 'We couldn’t found any maintenance tickets that match your search.' }} /> : <DataTable data={tickets} tableName="Tickets" onRowClick={(row) => { setId(row.id); setOpenModal(true) }} columns={columns} emptyDetails={{ icon: emptyTicketIcon.src, title: 'No tickets found', description: 'We couldn’t found any maintenance tickets that match your search.' }} />}</>}
        </>
    )
}

const items = createListCollection({
    items: [
        { label: 'All Types', value: 'all' },
        { label: 'Type 1', value: 'type1' },
        { label: 'Type 2', value: 'type2' },
        { label: 'Type 3', value: 'type3' },
        { label: 'Type 4', value: 'type4' },
        { label: 'Type 5', value: 'type5' },
        { label: 'Type 6', value: 'type6' },
    ]
})