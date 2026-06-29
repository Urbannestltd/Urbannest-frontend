"use client"
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { SectionFlex } from "@/components/ui/section-box"
import {
    Box,
    createListCollection,
    Flex,
    HStack,
    Span,
    Text,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuCalendar, LuDownload, LuPlus } from "react-icons/lu"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { SearchInput } from "@/components/ui/search-input"
import { MdOutlineFilterListOff, MdRefresh } from "react-icons/md"
import { DataTable } from "@/components/ui/data-table"
import { useColumns } from "./columns"
import { useEffect, useMemo, useState } from "react"
import emptyTableIcon from "@/app/assets/icons/empty-state-icons/properties-empty.svg"
import notFoundIcon from "@/app/assets/icons/facilty-icons/not-found-icon.svg"
import { MobileTable } from "./mobile-table"
import { BiSlider } from "react-icons/bi"
import { useRouter } from "next/navigation"
import { usePropertyStore } from "@/store/landlord/properties"
import { PropertyFilterFormData } from "@/schema/landlord"
import { getNumberRange } from "@/services/date"

export default function Properties() {
    const { control, watch, getValues, reset } = useForm<PropertyFilterFormData>()
    const { properties, fetchProperties, isLoading } = usePropertyStore(
        (state) => state,
    )
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600
    const watchedValues = watch()

    const [search, setSearch] = useState("")
    const [notFound, setNotFound] = useState(false)
    const router = useRouter()
    const selectedUnitValue = watchedValues.noOfUnits?.[0]
    const selectedOccupancyValue = watchedValues.occupancy?.[0]
    const selectedUnitRange = useMemo(() => getNumberRange(selectedUnitValue), [selectedUnitValue])
    const selectedOccupancyRange = useMemo(() => getNumberRange(selectedOccupancyValue), [selectedOccupancyValue])


    const hasActiveFilter = !!(
        search ||
        (watchedValues.occupancy?.[0] && watchedValues.occupancy[0] !== "all") ||
        (watchedValues.noOfUnits?.[0] && watchedValues.noOfUnits[0] !== "all") ||
        (watchedValues.property?.[0] && watchedValues.property[0] !== "all")
    )


    useEffect(() => {
        fetchProperties()
    }, [])

    useEffect(() => {
        const timer = setTimeout(
            () => {
                fetchProperties({
                    search,
                    minUnits:
                        selectedUnitValue === "all"
                            ? undefined
                            : selectedUnitRange?.min,
                    maxUnits:
                        selectedUnitValue === "all"
                            ? undefined
                            : selectedUnitRange?.max,
                    minOccupancy:
                        selectedOccupancyValue === "all"
                            ? undefined
                            : selectedOccupancyRange?.min,
                    maxOccupancy:
                        selectedOccupancyValue === "all"
                            ? undefined
                            : selectedOccupancyRange?.max,
                    type: watchedValues.property?.[0] === "all" ? undefined : watchedValues.property?.[0],
                })
            },
            search ? 100 : 0,
        )

        return () => clearTimeout(timer)
    }, [
        watchedValues.noOfUnits,
        watchedValues.occupancy,
        watchedValues.property,
        selectedUnitRange,
        selectedUnitValue,
        selectedOccupancyRange,
        selectedOccupancyValue,
        search,
    ])

    useEffect(() => {
        if (!isLoading) {
            setNotFound(hasActiveFilter && properties.length === 0)
        }
    }, [isLoading, properties, hasActiveFilter])

    const columns = useColumns()

    const propertyTypes = createListCollection({
        items: [
            { value: "all", label: "All Types" },
            { value: "RESIDENTIAL", label: "Residential" },
            { value: "COMMERCIAL", label: "Commercial" },
        ],
    })
    return (
        <Box>
            <PageTitle title="Properties" mt={8} />
            <SectionFlex
                justify={"space-between"}
                bg={{ base: "#F2F4F4", md: "white" }}
                mt={9}
            >
                {isMobile ? (
                    <Box w={"full"}>
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
                                placeholder="All Types"
                                collection={propertyTypes}
                            />
                            <CustomSelect
                                name="noOfUnits"
                                control={control}
                                borderColor="transparent"
                                size={"xs"}
                                triggerHeight="20px"
                                width={"full"}
                                placeholder="No of Units"
                                collection={unitFilter}
                            />
                        </HStack>
                        <SearchInput value={search} onChange={setSearch} onSearch={(val) => {
                            fetchProperties({
                                search,
                                // type: formValues.[0],
                                minUnits:
                                    selectedUnitValue === "all"
                                        ? undefined
                                        : selectedUnitRange?.min,
                                maxUnits:
                                    selectedUnitValue === "all"
                                        ? undefined
                                        : selectedUnitRange?.max,
                                minOccupancy:
                                    selectedOccupancyValue === "all"
                                        ? undefined
                                        : selectedOccupancyRange?.min,
                                maxOccupancy:
                                    selectedOccupancyValue === "all"
                                        ? undefined
                                        : selectedOccupancyRange?.max,
                                //propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                            })
                        }} placeholder="" width={"full"} />{" "}
                    </Box>
                ) : (
                    <>
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
                                    placeholder="All Types"
                                    collection={propertyTypes}
                                />
                            </Span>
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSearch={(val) => {
                                    fetchProperties({
                                        search,
                                        // type: formValues.[0],
                                        minUnits:
                                            selectedUnitValue === "all"
                                                ? undefined
                                                : selectedUnitRange?.min,
                                        maxUnits:
                                            selectedUnitValue === "all"
                                                ? undefined
                                                : selectedUnitRange?.max,
                                        minOccupancy:
                                            selectedOccupancyValue === "all"
                                                ? undefined
                                                : selectedOccupancyRange?.min,
                                        maxOccupancy:
                                            selectedOccupancyValue === "all"
                                                ? undefined
                                                : selectedOccupancyRange?.max,
                                        type: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                                    })
                                }}
                                width={"356px"}
                            />
                        </Flex>
                        <Flex gap={2} w={"25%"} justify={"space-evenly"} align={"center"}>
                            <Flex w={"full"}>
                                <CustomSelect
                                    name="occupancy"
                                    control={control}
                                    size={"xs"}
                                    triggerHeight="20px"
                                    width={"full"}
                                    placeholder="Occupancy"
                                    collection={occupancyFilter}
                                />
                            </Flex>
                            <Flex w={"full"}>
                                <CustomSelect
                                    name="noOfUnits"
                                    control={control}
                                    size={"xs"}
                                    triggerHeight="20px"
                                    width={"full"}
                                    placeholder="No of Units"
                                    collection={unitFilter}
                                />
                            </Flex>

                            {watchedValues.noOfUnits?.length > 0 ||
                                watchedValues.property?.length > 0 ||
                                watchedValues.occupancy?.length > 0 ? (
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
                    </>
                )}
            </SectionFlex>
            {isMobile ? (
                <MobileTable
                    data={properties}
                    loading={isLoading}
                    tableName="Properties Assigned"
                    emptyDetails={{
                        icon: emptyTableIcon,
                        title: "No Properties Assigned",
                        description:
                            "No properties have been assigned to your account yet. Your administrator will assign properties to you.",
                    }}
                />
            ) : (
                <DataTable
                    columns={columns}
                    loading={isLoading}
                    onRowClick={(row) =>
                        router.push(`/landlord/properties/${row.id}`)
                    }
                    data={properties ?? []}
                    tableName="Properties Assigned"
                    emptyDetails={{
                        icon: notFound ? notFoundIcon : emptyTableIcon,
                        title: notFound ? "No Results Found" : "No Properties Assigned",
                        description: notFound
                            ? "We couldn’t found a property to match your search"
                            : "No properties have been assigned to your account yet. Your administrator will assign properties to you.",
                    }}
                />
            )}
        </Box>
    )
}

const occupancyFilter = createListCollection({
    items: [
        { label: "All", value: "all" },
        { label: "0-20", value: "0-20" },
        { label: "21-40", value: "21-40" },
        { label: "41-60", value: "41-60" },
        { label: "61-80", value: "61-80" },
        { label: "81-100", value: "81-100" },
    ],
})

const unitFilter = createListCollection({
    items: [
        { label: "All", value: "all" },
        { label: "1-10", value: "1-10" },
        { label: "11-20", value: "11-20" },
        { label: "21-30", value: "21-30" },
        { label: "31-40", value: "31-40" },
        { label: "41-50", value: "41-50" },
        { label: "51-60", value: "51-60" },
        { label: "61-70", value: "61-70" },
        { label: "71-80", value: "71-80" },
        { label: "81-90", value: "81-90" },
        { label: "91-100", value: "91-100" },
        { label: "101-110", value: "101-110" },
        { label: "111-120", value: "111-120" },
        { label: "121-130", value: "121-130" },
        { label: "131-140", value: "131-140" },
        { label: "141-150", value: "141-150" },
    ],
})

