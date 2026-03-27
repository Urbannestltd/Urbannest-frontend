import { MainButton } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { Property, usePropertyStore } from "@/store/admin/properties"
import { Flex, HStack, Skeleton } from "@chakra-ui/react"
import { use, useEffect, useState } from "react"
import { LuUser } from "react-icons/lu"
import { Row, useUnitColumns } from "./unit-columns"
import { DataTable } from "@/components/ui/data-table"
import { Tenant } from "./tenant"
import { Modal } from "@/components/ui/dialog"
import { AddUnit } from "./add-unit"

export const Unit = ({ property }: { property?: Property | null }) => {
    const [showTenant, setShowTenant] = useState(false)

    const [selectedRow, setSelectedRow] = useState<Row | null>(null)

    const units = usePropertyStore(state => state.units)
    const fetchUnits = usePropertyStore(state => state.fetchUnits)
    const loading = usePropertyStore(state => state.isLoading)

    useEffect(() => {
        if (property?.id) { fetchUnits(property?.id) }
        console.log(property?.id)
    }, [property?.id])

    const handleTenantClick = (row: Row) => {
        setSelectedRow(row)
        setShowTenant(true)
    }
    const columns = useUnitColumns(handleTenantClick)

    //const FirstFloorUnits = units?.grouped.Unassigned.find((unit) => unit.floor === 1)

    if (!units) {
        return <Flex height={'50vh'} justify={'center'} align={'center'}>No Units for  {property?.name} Found</Flex>
    }


    return (

        <>
            {showTenant ? <Tenant tenant={selectedRow as Row} /> : <> <SectionBox mb={4}>
                <PageTitle title={`Total ${units?.totalUnits} Units`} />
                <HStack justify={'space-between'}>
                    <SearchInput />
                    <Flex>
                        <Modal triggerIcon={<LuUser />} triggerContent="Add Unit" modalContent={<AddUnit />} />
                    </Flex>
                </HStack>
            </SectionBox>
                <SectionBox>
                    <PageTitle title="First Floor" />
                    <DataTable tableName="Units" data={units?.grouped.Unassigned ?? null} emptyDetails={{ title: 'No Units Found', description: 'NonUn', icon: '' }} columns={columns} />
                </SectionBox></>}
        </>
    )
}