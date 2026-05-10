import { MainButton } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { TickettData } from "@/utils/data"
import { createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuUser } from "react-icons/lu"
import { useTicketColumns } from "./ticket-columns"
import { Modal } from "@/components/ui/dialog"
import { TenantMaintenanceModal } from "@/app/tenant/maintenance/modal"
import { useEffect, useState } from "react"
import { useTicketStore } from "@/store/admin/tickets"
import TicketPage from "../../maintenance-and-issues/[id]/page"

export const Tickets = ({ propertyId }: { propertyId: string }) => {

    const { control, handleSubmit } = useForm()
    const columns = useTicketColumns()
    const tickets = useTicketStore(state => state.ticketsPerProperty)
    const fetchAllTickets = useTicketStore(state => state.fetchTicketPerProperty)
    const [search, setSearch] = useState('')

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
    return (
        <>{openModal ? < >gggg</> : <>
            <SectionBox>
                <PageTitle title="Maintenance Tickets" fontSize={'18px'} />
                <HStack mt={4} justify={'space-between'}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(val) => fetchAllTickets(propertyId, val)}
                        width={'308px'} />
                    <Flex justify={'center'} gap={2.5} align={'end'}>
                        <CustomSelect control={control} size={'sm'} name="status" width={'97px'} placeholder="All Types" collection={items} />
                        <MainButton size='lg' className="h-[43px]" icon={<LuUser />}>Add Unit</MainButton>
                    </Flex>
                </HStack>
            </SectionBox >
            <DataTable data={tickets} tableName="Tickets" onRowClick={() => setOpenModal(true)} columns={columns} /> </>}
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