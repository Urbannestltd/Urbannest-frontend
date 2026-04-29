import { MainButton } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { SectionBox } from "@/components/ui/section-box"
import { Property, usePropertyStore } from "@/store/admin/properties"
import { Box, Flex, HStack, Menu, Portal, Skeleton, Text } from "@chakra-ui/react"
import { use, useEffect, useRef, useState } from "react"
import { LuArrowLeft, LuEllipsisVertical, LuUser } from "react-icons/lu"
import { Row, useUnitColumns } from "./unit-columns"
import { DataTable } from "@/components/ui/data-table"
import { Tenant } from "./tenant"
import { Modal } from "@/components/ui/dialog"
import { AddUnit } from "./add-unit"
import { set } from "lodash"
import { useMutation } from "@tanstack/react-query"
import { addUnit, addUnitPayload, deleteFloor, deleteFloorPayload } from "@/services/admin/property"
import toast from "react-hot-toast"
import { useSearchParams } from "next/navigation"

export const Unit = () => {
    const searchParams = useSearchParams()
    const tenantId = searchParams.get('tenantId')
    const [showTenant, setShowTenant] = useState(!!tenantId)
    const [showAddUnit, setShowAddUnit] = useState(false)
    const [showEditUnit, setShowEditUnit] = useState(false)
    const [editId, setEditId] = useState<string>()
    const [search, setSearch] = useState('')

    const [selectedRow, setSelectedRow] = useState<Row | null>(null)

    const units = usePropertyStore(state => state.units)
    const property = usePropertyStore(state => state.property)
    const fetchUnits = usePropertyStore(state => state.fetchUnits)
    const loading = usePropertyStore(state => state.isLoading)
    const ref = useRef<HTMLDivElement>(null)


    useEffect(() => {
        setShowTenant(!!tenantId)
    }, [property?.id])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) fetchUnits(property?.id ?? '', search)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const handleTenantClick = (row: Row) => {
        setSelectedRow(row)
        setShowTenant(true)
    }

    const handleEdit = (id: string) => {
        setEditId(id)
        setShowEditUnit(true)
    }
    const columns = useUnitColumns(handleTenantClick, property?.id ?? '', property?.name ?? '', handleEdit)

    const mutation = useMutation({
        mutationFn: (payload: addUnitPayload) => {
            return addUnit(payload)
        },
        onSuccess: () => {
            toast.success('Floor added successfully')
            fetchUnits(property?.id ?? '')
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const deleteFloorMutation = useMutation({
        mutationFn: (data: deleteFloorPayload) => {
            return deleteFloor(data)
        },
        onSuccess: () => {
            toast.success('Floor deleted successfully')
            fetchUnits(property?.id ?? '')
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const handleDelete = (floor: string) => {
        const payload: deleteFloorPayload = {
            propertyId: property?.id ?? '',
            floor: floor
        }
        deleteFloorMutation.mutate(payload)
    }

    const onSubmit = () => {
        const payload: addUnitPayload = {
            propertyId: property?.id ?? '',
            data: {
                name: '',
                floor: `${property?.noOfFloors as number + 1}`,
                type: 'ONE_BEDROOM',
            }
        }
        mutation.mutate(payload)
    }




    return (

        <>

            {showTenant ? <><Flex align={'center'} mb={4} fontSize={'12px'} color="#CFAA67" cursor={'pointer'} onClick={() => setShowTenant(false)}>
                <LuArrowLeft size={18} color="#CFAA67" />
                Back
            </Flex><Tenant tenant={selectedRow as Row} /></> : <> <SectionBox mb={4}>
                <PageTitle title={`Total ${units?.totalUnits ?? 0} Units`} />
                <HStack mt={2} justify={'space-between'}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        onSearch={(val) => fetchUnits(property?.id as string, val)} />
                    <Flex gap={2}>
                        <Modal open={showAddUnit} onOpenChange={setShowAddUnit} triggerSize="sm" triggerIcon={<LuUser />} triggerContent="Add Unit" modalContent={<AddUnit onClose={() => { setShowAddUnit(false); fetchUnits(property?.id ?? '') }} propertyId={property?.id ?? ''} floors={units?.grouped.length} propertyName={property?.name ?? ''} />} />
                        <MainButton variant="outline" size="sm" loading={mutation.isPending} onClick={() => onSubmit()}>Add Floor</MainButton>
                    </Flex>
                </HStack>
            </SectionBox>
                {units?.grouped.map((floor, index) => (<SectionBox key={floor.floor} my={4}>
                    <Box ref={index === units?.grouped.length - 1 ? ref : null}>
                        <HStack justify={'space-between'}>
                            <PageTitle title={floor.floor} />
                            <Menu.Root>
                                <Menu.Trigger>
                                    <LuEllipsisVertical size={20} />
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item value="delete-floor" className="satoshi-medium" onClick={() => handleDelete(floor.floor)} color={'#C00F0C'}>Delete Floor</Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </HStack>
                        <DataTable tableName="Units" data={floor.units ?? null} emptyDetails={{ title: 'No Units Found', description: 'No Units Found', icon: '' }} columns={columns} />
                    </Box> </SectionBox>))}
                <Modal open={showEditUnit} onOpenChange={setShowEditUnit} modalContent={<AddUnit isOpen={showEditUnit} onClose={() => { setShowEditUnit(false); fetchUnits(property?.id as string) }} propertyId={property?.id as string} propertyName={property?.name as string} editUnitId={editId} />} />

            </>}
        </>
    )
}