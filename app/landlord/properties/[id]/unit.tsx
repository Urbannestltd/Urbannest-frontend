/* eslint-disable react-hooks/set-state-in-effect */
import { MainButton } from "@/components/ui/button"
import { AxiosError } from "axios"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { Box, Flex, HStack, Menu, Portal, Skeleton, Text } from "@chakra-ui/react"
import { use, useEffect, useRef, useState } from "react"
import { LuArrowLeft, LuEllipsisVertical, LuUser } from "react-icons/lu"
import { Row, useUnitColumns } from "./unit-columns"
import { DataTable } from "@/components/ui/data-table"
import { Tenant } from "./tenant"
import { useSearchParams } from "next/navigation"
import { MobileTable } from "./unit-mobile-table"
import { usePropertyStore } from "@/store/landlord/properties"

export const Unit = () => {
    const searchParams = useSearchParams()
    const tenantId = searchParams.get('tenantId')
    const [showTenant, setShowTenant] = useState(!!tenantId)
    const [search, setSearch] = useState('')
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600

    const [selectedRow, setSelectedRow] = useState<Row | null>(null)

    const units = usePropertyStore(state => state.units)
    const property = usePropertyStore(state => state.property)
    const fetchUnits = usePropertyStore(state => state.fetchUnits)
    const loading = usePropertyStore(state => state.isLoadingUnits)
    const ref = useRef<HTMLDivElement>(null)


    useEffect(() => {
        setShowTenant(!!tenantId)
    }, [property?.id])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUnits(property?.id ?? '', search || undefined)
        }, 100)
        return () => clearTimeout(timer)
    }, [search])

    const handleTenantClick = (row: Row) => {
        setSelectedRow(row)
        setShowTenant(true)
    }

    const columns = useUnitColumns(handleTenantClick)




    return (

        <>

            {showTenant ? <><Flex align={'center'} mb={4} fontSize={'12px'} color="#CFAA67" cursor={'pointer'} onClick={() => setShowTenant(false)}>
                <LuArrowLeft size={18} color="#CFAA67" />
                Back
            </Flex><Tenant propertyId={property?.id as string} tenant={selectedRow as Row} /></> : <> <SectionBox mb={4}>
                <PageTitle title={`Total ${units?.length ?? 0} Units`} />
                <HStack mt={2} justify={'space-between'}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(val) => fetchUnits(property?.id as string, val)} />

                </HStack>
            </SectionBox>
                {units?.map((floor, index) => (<SectionBox key={index} my={4}>
                    <Box ref={index === units?.length - 1 ? ref : null}>
                        <PageTitle title={`floor ${index + 1}`} fontSize={{ base: '18px', md: '22px' }} />
                        {isMobile ? <MobileTable onTenantClick={handleTenantClick} data={units ?? []} emptyDetails={{ title: 'No Units Found', description: 'No Units Found', icon: '' }} tableName="Units" /> : <DataTable tableName="Units" data={units ?? null} emptyDetails={{ title: 'No Units Found', description: 'No Units Found', icon: '' }} columns={columns} />}
                    </Box> </SectionBox>))}
            </>}
        </>
    )
}
