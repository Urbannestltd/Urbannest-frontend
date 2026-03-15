import { MainButton } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { Property, usePropertyStore } from "@/store/admin/properties"
import { Flex, HStack } from "@chakra-ui/react"
import { use, useEffect } from "react"
import { LuUser } from "react-icons/lu"
import { useUnitColumns } from "./unit-columns"
import { DataTable } from "@/components/ui/data-table"

export const Unit = ({ property }: { property?: Property | null }) => {
    const columns = useUnitColumns()
    const units = usePropertyStore(state => state.units)
    const fetchUnits = usePropertyStore(state => state.fetchUnits)

    useEffect(() => {
        if (property?.id) { fetchUnits(property?.id) }
    }, [])

    return (

        <>
            <SectionBox>
                <PageTitle title={`Total 17 Units`} />
                <HStack justify={'space-between'}>
                    <SearchInput />
                    <Flex>
                        <MainButton icon={<LuUser />}>Add Unit</MainButton>
                    </Flex>
                </HStack>
            </SectionBox>
            <SectionBox>
                <PageTitle title="First Floor" />
                <DataTable tableName="Units" data={units?.grouped.Unassigned ?? null} columns={columns} />
            </SectionBox>
        </>
    )
}