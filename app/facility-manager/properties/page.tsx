'use client'
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { SectionFlex } from "@/components/ui/section-box"
import { Box, createListCollection, Flex, HStack, Span, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuCalendar, LuDownload, LuPlus } from "react-icons/lu"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { SearchInput } from "@/components/ui/search-input"
import { MdOutlineFilterListOff, MdRefresh } from "react-icons/md"
import { DataTable } from "@/components/ui/data-table"
import { useColumns } from "./columns"
import { useEffect, useState } from "react"
import { PropertyFilterFormData } from "@/schema/fm"
import emptyTableIcon from '@/app/assets/icons/empty-state-icons/properties-empty.svg'
import { MobileTable } from "./mobile-table"
import { BiSlider } from "react-icons/bi";
import { useRouter } from "next/navigation"
import { usePropertyStore } from "@/store/fm/properties"


export default function Properties() {
    const { control, watch } = useForm<PropertyFilterFormData>()
    const { properties, fetchProperties, isLoading } = usePropertyStore(state => state)
    const isMobile = window.innerWidth < 600

    const [search, setSearch] = useState('')
    const router = useRouter()

    const formValues = watch()

    useEffect(() => {
        fetchProperties()
    }, [])

    console.log("properties", properties)

    useEffect(() => {
        const timer = setTimeout(() => {

            fetchProperties({
                search,
                // type: formValues.[0],
                occupancy: formValues.occupancy?.[0],
                //propertyId: formValues.property?.[0] === 'all' ? undefined : formValues.property?.[0],
            })
        }, search ? 100 : 0)

        return () => clearTimeout(timer)
    }, [formValues.noOfUnits, formValues.occupancy, formValues.property, search])

    const columns = useColumns()

    const propertyTypes = createListCollection({
        items: [{ label: 'All Properties', value: 'all' }, ...(properties ?? []).map((item) => ({ label: item.name, value: item.name }))]
    })
    return (
        <Box>
            <PageTitle title="Properties" mt={8} />
            <SectionFlex justify={'space-between'} bg={{ base: '#F2F4F4', md: 'white' }} mt={9}>
                {isMobile ? <Box w={'full'}>
                    <HStack justify={'space-between'} w={'full'} mb={4}>
                        <Text className="satoshi-bold text-sm">Quick Filters</Text>
                        <BiSlider color="#5A6061" />

                    </HStack>
                    <HStack w={'full'} mb={4}>
                        <CustomSelect name="property" control={control} borderColor="transparent" size={'xs'} triggerHeight='20px' width={'full'} placeholder="All Types" collection={propertyTypes} />
                        <CustomSelect name='noOfUnits' control={control} borderColor="transparent" size={'xs'} triggerHeight='20px' width={'full'} placeholder="No of Units" collection={paymentFilter} />
                    </HStack>
                    <SearchInput
                        placeholder=""
                        width={'full'} />  </Box> : <>
                    <Flex align={'center'} >

                        <Span mb={1} mr={4}>
                            <CustomSelect name="property" control={control} icon={!isMobile ? HiOutlineBuildingOffice2 : undefined} size={'xs'} triggerHeight='20px' width={'fit'} value={'all'} placeholder="All Types" collection={propertyTypes} />
                        </Span>
                        <SearchInput

                            width={'356px'} />
                    </Flex>
                    <Flex gap={2} w={'20%'} justify={'space-evenly'} align={'center'}>
                        <Flex w={'full'}>
                            <CustomSelect name='occupancy' control={control} size={'xs'} triggerHeight='20px' width={'full'} placeholder="Occupancy" collection={dateFilter} />
                        </Flex>
                        <Flex w={'full'}>
                            <CustomSelect name='noOfUnits' control={control} size={'xs'} triggerHeight='20px' width={'full'} placeholder="No of Units" collection={paymentFilter} />
                        </Flex>

                        {/*formValues.paymentMethod?.length > 0 || formValues.dateRange?.length > 0 || formValues.property?.length > 0 || formValues.status?.length > 0 ?
                            <MdOutlineFilterListOff cursor={'pointer'} onClick={() => reset()} /> : null*/}
                        <Flex w={'fit'}>
                            <MdRefresh color="#94A3B8" className=" size-5" />
                        </Flex>
                    </Flex>
                </>}
            </SectionFlex>
            {isMobile ? <MobileTable data={properties} loading={isLoading} tableName="Properties Assigned" emptyDetails={{ icon: emptyTableIcon, title: 'No Properties Assigned', description: 'No properties have been assigned to your account yet. Your administrator will assign properties to you.' }} /> :
                <DataTable columns={columns} loading={isLoading} onRowClick={(row) => router.push(`/facility-manager/properties/${row.id}`)} data={properties} tableName="Properties Assigned" emptyDetails={{ icon: emptyTableIcon, title: 'No Properties Assigned', description: 'No properties have been assigned to your account yet. Your administrator will assign properties to you.' }} />}
        </Box>
    )
}


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