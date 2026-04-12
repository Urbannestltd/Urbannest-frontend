import { MainButton } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { Property, usePropertyStore } from "@/store/admin/properties"
import { Flex, HStack, Skeleton, Text } from "@chakra-ui/react"
import { use, useEffect, useState } from "react"
import { LuArrowLeft, LuUser } from "react-icons/lu"
import { Row, useUnitColumns } from "./unit-columns"
import { DataTable } from "@/components/ui/data-table"
import { Tenant } from "./tenant"
import { Modal } from "@/components/ui/dialog"
import { AddUnit } from "./add-unit"
import { set } from "lodash"

export const Unit = ({ property }: { property?: Property | null }) => {
    const [showTenant, setShowTenant] = useState(false)
    const [showAddUnit, setShowAddUnit] = useState(false)

    const [selectedRow, setSelectedRow] = useState<Row | null>(null)

    const units = usePropertyStore(state => state.units)
    const fetchUnits = usePropertyStore(state => state.fetchUnits)
    const loading = usePropertyStore(state => state.isLoading)

    useEffect(() => {
        if (property?.id) { fetchUnits(property?.id) }
        setShowTenant(false)
    }, [property?.id])

    const handleTenantClick = (row: Row) => {
        setSelectedRow(row)
        setShowTenant(true)
    }
    const columns = useUnitColumns(handleTenantClick)

    //const FirstFloorUnits = units?.grouped.Unassigned.find((unit) => unit.floor === 1)




    return (

        <>

            {showTenant ? <><Flex align={'center'} mb={4} fontSize={'12px'} color="#CFAA67" cursor={'pointer'} onClick={() => setShowTenant(false)}>
                <LuArrowLeft size={18} color="#CFAA67" />
                Back
            </Flex><Tenant tenant={selectedRow as Row} /></> : <> <SectionBox mb={4}>
                <PageTitle title={`Total ${units?.totalUnits} Units`} />
                <HStack justify={'space-between'}>
                    <SearchInput />
                    <Flex>
                        <Modal open={showAddUnit} onOpenChange={setShowAddUnit} triggerIcon={<LuUser />} triggerContent="Add Unit" modalContent={<AddUnit onClose={() => setShowAddUnit(false)} propertyId={property?.id ?? ''} propertyName={property?.name ?? ''} />} />
                    </Flex>
                </HStack>
            </SectionBox>
                {Object.entries(units?.grouped ?? {}).map(([floorName, floorUnits]) => (<SectionBox my={4}>
                    <PageTitle title={floorName} />
                    <DataTable tableName="Units" data={floorUnits as Row[] ?? null} emptyDetails={{ title: 'No Units Found', description: 'No Units Found', icon: '' }} columns={columns} />
                </SectionBox>))}</>}
        </>
    )
}