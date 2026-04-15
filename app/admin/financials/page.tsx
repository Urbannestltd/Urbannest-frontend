'use client'
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { SectionFlex } from "@/components/ui/section-box"
import { createListCollection, Flex, HStack, Span } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuCalendar, LuDownload, LuPlus } from "react-icons/lu"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { SearchInput } from "@/components/ui/search-input"
import { MdRefresh } from "react-icons/md"
import { DataTable } from "@/components/ui/data-table"
import { useColumns } from "./columns"
import { useFinancialStore } from "@/store/admin/financial"
import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/dialog"
import { AddExpense } from "./add-expense"
import { Drawers } from "@/components/ui/drawer"
import { exportExpenses } from "@/services/admin/financial"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { filterFormData } from "@/schema/admin"
import { getDateRange } from "@/services/date"

export default function Financials() {
    const { control } = useForm<filterFormData>()
    const columns = useColumns()
    const financials = useFinancialStore(state => state.financials)
    const loading = useFinancialStore(state => state.loading)
    const fetchFinancials = useFinancialStore(state => state.fetchFinancials)
    const [closeModal, setCloseModal] = useState(false)

    useEffect(() => {
        fetchFinancials()
    }, [])

    const cardData: CardData[] = [
        {
            title: 'Total Expected Revenue',
            data: '₦245,000.00',
            emptyMessage: '12% from last month',
        },
        {
            title: 'Total Collected',
            data: '₦198,450.00',
            progress: 50,
        },
        {
            title: 'Outstanding Amount',
            data: '₦46,550.00',
            titleColor: '#9F403D',
            emptyMessage: '14 pending invoices ',
        },
        {
            title: 'Defaulting Tenants',
            data: 8,
            attentionRequired: true,
        }
    ]

    const mutation = useMutation({
        mutationFn: () => {
            return exportExpenses()
        },
        onSuccess: () => {
            toast.success('Expenses exported successfully')
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const exportFinancials = () => {
        mutation.mutate()
    }

    const selectFilter = (value: string) => {
        const { startDate, endDate } = getDateRange(value[0])
        console.log(value[0])
        fetchFinancials({
            startDate: startDate,
            endDate: endDate
        })
    }

    const selectStatus = (value: string) => {
        fetchFinancials({
            type: value[0]
        })
    }



    return (
        <div>
            <HStack my={7} justify={'space-between'}>
                <PageTitle title="Financials" fontSize={'24px'} />
                <Flex w={'290px'} gap={2}>
                    <MainButton size='lg' variant="outline" onClick={exportFinancials} className="h-[41px]" icon={<LuDownload />}>Export</MainButton>
                    <Drawers open={closeModal} onOpenChange={setCloseModal} size={'full'} className="w-[500px] h-full" triggerElement={<MainButton size='lg' className="h-[41px]" fullWidth icon={<LuPlus />}>Add Expense</MainButton>} modalContent={<AddExpense onClose={() => { setCloseModal(false); fetchFinancials() }} />} />
                </Flex>
            </HStack>
            <DashboardCard data={cardData} />
            <SectionFlex justify={'space-between'} mt={9}>
                <Flex align={'center'} >

                    <Span mb={1} mr={4}>
                        <CustomSelect name="property" control={control} icon={HiOutlineBuildingOffice2} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="All Types" collection={propertyTypes} />
                    </Span>
                    <SearchInput width={'356px'} />
                </Flex>
                <Flex gap={2} align={'center'}>
                    <Flex>
                        <CustomSelect name='dateRange' control={control} onChange={selectFilter} icon={LuCalendar} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="Today" collection={dateFilter} />
                    </Flex>
                    <Flex>
                        <CustomSelect name='paymentMethod' control={control} onChange={selectStatus} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="Payment Types" collection={paymentFilter} />
                    </Flex>
                    <Flex>
                        <CustomSelect name='status' control={control} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="All Types" collection={propertyTypes} />
                    </Flex>
                    <MdRefresh color="#94A3B8" className=" size-4" />
                </Flex>
            </SectionFlex>
            <DataTable data={financials ?? []} loading={loading} tableName="Financials" columns={columns} />
        </div>
    )
}


const propertyTypes = createListCollection({
    items: [
        {
            label: 'All Properties',
            value: 'all'
        },
        {
            label: 'Residential',
            value: 'residential'
        },
        {
            label: 'Commercial',
            value: 'commercial'
        }

    ]
})

const dateFilter = createListCollection({
    items: [
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'this_week' },
        { label: 'This Month', value: 'this_month' },
        { label: 'This Year', value: 'this_year' },
    ]
})

const paymentFilter = createListCollection({
    items: [
        { label: 'Rent', value: 'RENT' },
        { label: 'Maintenance', value: 'UTILITY_TOKEN' },
        { label: 'Utility', value: 'UTILITY_BILL' },
        { label: 'Service', value: 'SERVICE_CHARGE' }
    ]
})