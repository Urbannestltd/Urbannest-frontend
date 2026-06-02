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
import { TicketFilterFormData } from "@/schema/fm"

export const Tickets = ({ propertyId }: { propertyId: string }) => {

    const { control, handleSubmit, watch, reset } = useForm<TicketFilterFormData>()
    const columns = useTicketColumns()
    const tickets = useTicketStore(state => state.ticketsPerProperty)
    const fetchAllTickets = useTicketStore(state => state.fetchTicketPerProperty)
    const loading = useTicketStore(state => state.isLoadingPropertyTickets)
    const [search, setSearch] = useState('')
    const isMobile = window.innerWidth < 600
    const watchedValues = watch()

    useEffect(() => {
        if (!propertyId) return
        fetchAllTickets(propertyId)
    }, [propertyId])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllTickets(propertyId, {
                search,
                priority: watchedValues.priority?.[0] === 'all' ? undefined : watchedValues.priority?.[0],
                status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
                category: watchedValues.category?.[0] === 'all' ? undefined : watchedValues.category?.[0],
                //dateRange: watchedValues.dateRange?.[0] === 'all' ? undefined : watchedValues.dateRange?.[0],
                propertyType: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0]
            })
        }, 100)
        return () => clearTimeout(timer)
    }, [watchedValues.status, watchedValues.priority, watchedValues.dateRange, watchedValues.category, watchedValues.property])

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
                        onSearch={(val) => fetchAllTickets(propertyId, { search: val })}
                        width={'308px'} />
                    <Flex justify={'center'} gap={2.5} align={'end'}>
                        <CustomSelect control={control} size={'sm'} name='category' width={'97px'} placeholder="All Types" collection={Issue} />
                    </Flex>
                </Stack>
            </SectionBox >
            {isMobile ?
                <MobileTable data={tickets} tableName="Tickets" emptyDetails={{ icon: emptyTicketIcon.src, title: 'No tickets found', description: 'We couldn’t found any maintenance tickets that match your search.' }} /> : <DataTable data={tickets} loading={loading} tableName="Tickets" onRowClick={(row) => { setId(row.id); setOpenModal(true) }} columns={columns} emptyDetails={{ icon: emptyTicketIcon.src, title: 'No tickets found', description: 'We couldn’t found any maintenance tickets that match your search.' }} />}</>}
        </>
    )
}


const Issue = createListCollection({
    items: [
        { value: 'ELECTRICAL', label: 'Electrical', },
        { value: 'PLUMBING', label: 'Plumbing' },
        { value: 'SECURITY', label: 'Security' },
        { value: 'CLEANING', label: 'Cleaning' },
        { value: 'HVAC', label: 'HVC/AC' },
        { value: 'BUILDING', label: 'Building (Walls, Doors, Windows, Ceiling)' },
        { value: 'SAFETY', label: 'Safety & Security' },
    ]
})

