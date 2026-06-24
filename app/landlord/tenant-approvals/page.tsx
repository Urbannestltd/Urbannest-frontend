'use client'
import { PageTitle } from "@/components/ui/page-title";
import { Box, createListCollection, Flex, HStack, Span, Text } from "@chakra-ui/react";
import { ApprovalsTabs } from "./tabs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePropertyStore } from "@/store/landlord/properties";
import { useApprovalsStore } from "@/store/landlord/approvals";
import { SearchInput } from "@/components/ui/search-input";
import { CustomSelect } from "@/components/ui/custom-fields";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineFilterListOff, MdRefresh } from "react-icons/md";
import { LuCalendar } from "react-icons/lu";
import { ApprovalFilterFormData } from "@/schema/landlord";
import { getDateRange } from "@/services/date";
import { SectionFlex } from "@/components/ui/section-box";
import { BiSlider } from "react-icons/bi";

export default function TenantApprovals() {
    const [search, setSearch] = useState('')
    const { control, watch, getValues, reset } = useForm<ApprovalFilterFormData>()
    const { fetchApprovalHistory, fetchPendingApprovals, isLoadingPendingApprovals, isLoadingApprovalHistory, pendingApprovals, approvalHistory } = useApprovalsStore((state) => state)
    const [notFoundPending, setNotFoundPending] = useState(false)
    const [notFoundHistory, setNotFoundHistory] = useState(false)
    const { properties, fetchProperties, isLoading } = usePropertyStore(
        (state) => state,
    )
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600
    const watchedValues = watch()


    const hasActiveFilter = !!(
        search ||
        (watchedValues.dateRange?.[0] && watchedValues.dateRange[0] !== "all") ||
        (watchedValues.property?.[0] && watchedValues.property[0] !== "all")
    )

    useEffect(() => {
        fetchApprovalHistory()
        fetchPendingApprovals()
        fetchProperties()
    }, [])

    useEffect(() => {
        const timer = setTimeout(
            () => {
                const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
                fetchApprovalHistory({
                    search,
                    propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                    dateFrom: startDate,
                    dateTo: endDate
                })
                fetchPendingApprovals({
                    search,
                    propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                    dateFrom: startDate,
                    dateTo: endDate
                })

            },
            search ? 100 : 0,
        )

        return () => clearTimeout(timer)
    }, [
        watchedValues.dateRange,
        watchedValues.property,
        search,
    ])

    useEffect(() => {
        if (pendingApprovals.length === 0 && hasActiveFilter) {
            setNotFoundPending(true)
        } else {
            setNotFoundPending(false)
        }
        if (approvalHistory.length === 0 && hasActiveFilter) {
            setNotFoundHistory(true)
        } else {
            setNotFoundHistory(false)
        }
    }, [pendingApprovals.length, approvalHistory.length])


    const propertiees = createListCollection({
        items: properties.map((property) => ({
            label: property.name,
            value: property.id
        }))
    })



    const filters = () => {
        if (isMobile)
            return <Box w={"full"}>
                <HStack justify={"space-between"} w={"full"} mb={4}>
                    <Text className="satoshi-bold text-sm">Quick Filters</Text>
                    <BiSlider color="#5A6061" />
                </HStack>
                <HStack w={"full"} mb={4}>
                    <CustomSelect
                        name="property"
                        control={control}
                        borderColor="transparent"
                        size={"xs"}
                        triggerHeight="20px"
                        width={"full"}
                        placeholder="All Properties"
                        collection={propertiees}
                    />
                    <CustomSelect
                        name='dateRange'
                        control={control}
                        borderColor="transparent"
                        size={"xs"}
                        triggerHeight="20px"
                        width={"full"}
                        placeholder="Date"
                        collection={dateFilter}
                    />
                </HStack>
                <SearchInput value={search} onChange={setSearch} onSearch={(val) => {
                    const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
                    fetchApprovalHistory({
                        search,
                        dateFrom: startDate,
                        dateTo: endDate,
                        propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                    })
                    fetchPendingApprovals({
                        search,
                        dateFrom: startDate,
                        dateTo: endDate,
                        propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                    })
                }} placeholder="" width={"full"} />{" "}
            </Box>

        return <SectionFlex
            w={'full'}
            justify={"space-between"}
            bg={{ base: "#F2F4F4", md: "white" }}
            p={4}
            mt={4}>
            <Flex align={"center"}>
                <Span w={'fit'} mb={1} mr={4}>
                    <CustomSelect
                        name="property"
                        control={control}
                        icon={!isMobile ? HiOutlineBuildingOffice2 : undefined}
                        size={"xs"}
                        triggerHeight="20px"
                        width={"full"}
                        value={"all"}
                        placeholder="All Properties"
                        collection={propertiees}
                    />
                </Span>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    onSearch={(val) => {
                        const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
                        fetchApprovalHistory({
                            search,
                            dateFrom: startDate,
                            dateTo: endDate,
                            propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                        })
                        fetchPendingApprovals({
                            search,
                            dateFrom: startDate,
                            dateTo: endDate,
                            propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                        })
                    }}
                    width={"356px"}
                />
            </Flex>
            <Flex gap={2} w={"15%"} justify={"space-evenly"} align={"center"}>
                <CustomSelect
                    name="dateRange"
                    control={control}
                    borderColor="#F4F4F4"
                    placeholder="Last 30 Days"
                    icon={LuCalendar}
                    collection={dateFilter}
                    width={"full"}
                />
                {
                    watchedValues.property?.length > 0 ||
                        watchedValues.dateRange?.length > 0 ? (
                        <div>
                            <MdOutlineFilterListOff
                                cursor={"pointer"}
                                onClick={() => reset()}
                            />
                        </div>
                    ) : null}
                <Flex w={"fit"}>
                    <MdRefresh onClick={() => fetchProperties()} cursor={"pointer"} color="#94A3B8" className=" size-5" />
                </Flex>
            </Flex>
        </SectionFlex>
    }


    return (
        <Box>
            <PageTitle mt={8} mb={8} title="Tenant Approvals" />
            <ApprovalsTabs
                component={filters()}
            />

        </Box>
    )
}

const dateFilter = createListCollection({
    items: [
        {
            label: "None",
            value: "all",
        },
        { label: "Today", value: "today" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" },
        { label: "This Year", value: "this_year" },
    ],
})
