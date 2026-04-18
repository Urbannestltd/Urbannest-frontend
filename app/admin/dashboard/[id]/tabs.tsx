import { Divider } from "@/components/ui/divider"
import { Button, Flex, Menu, Portal, Tabs, Text } from "@chakra-ui/react"
import { Overview } from "./overview"
import { Property, usePropertyStore } from "@/store/admin/properties"
import { Unit } from "./unit"
import React, { useState } from "react"
import { LuEllipsisVertical } from "react-icons/lu"
import { Tickets } from "./tickets"
import { Modal } from "@/components/ui/dialog"
import { AddMemberModal } from "./add-modal"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { deleteProperty, deleteUnit } from "@/services/admin/property"
import { useRouter } from "next/navigation"
import { editPropertyFormData } from "@/schema/admin"

interface Props {
    property?: Property | null
    setTab: (tab: string) => void
    edit: boolean
    onSave?: (data: {
        amenities: string[]
        images: string[]
        formValues: editPropertyFormData
    }) => void
}

export const PropertyTabs = React.forwardRef<{ handleSave: () => void }, Props>(({ property, setTab, edit, onSave }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    return (
        <Tabs.Root variant={'line'} defaultValue="overview">
            <Flex justify={'space-between'}>
                <Tabs.List gap={10}>
                    <Tabs.Trigger value="overview" onClick={() => setTab('Overview')}>Overview</Tabs.Trigger>
                    <Tabs.Trigger value="units" onClick={() => setTab('Units')}>Units</Tabs.Trigger>
                    <Tabs.Trigger value="tickets" onClick={() => setTab('Tickets')}>Tickets</Tabs.Trigger>
                    <Tabs.Indicator bg={'transparent'} shadow={'none'} />
                </Tabs.List>
                <Menu.Root>
                    <Menu.Trigger>
                        <LuEllipsisVertical size={20} />
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item onClick={() => setIsOpen(true)} value="assign-members" className="satoshi-medium">Assign Members</Menu.Item>
                                <Menu.Item onClick={() => setIsDeleteOpen(true)} value="delete-property" className="satoshi-medium" color={'#C00F0C'}>Delete Property</Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
                <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} size={'xs'} className="h-fit" modalContent={<DeletePopUp data={{ propertyId: property?.id || '' }} />} />
                <Modal open={isOpen} onOpenChange={setIsOpen} size={'cover'} className="w-[600px] h-fit" modalContent={<AddMemberModal propertyId={property?.id} />} />
            </Flex>
            <Divider my={0} />
            <Tabs.Content value="overview">
                <Overview ref={ref} edit={edit} onSave={onSave} property={property} />
            </Tabs.Content>
            <Tabs.Content value="units">
                <Unit property={property} />
            </Tabs.Content>
            <Tabs.Content value="tickets">
                <Tickets propertyId={property?.id || ''} />
            </Tabs.Content>

        </Tabs.Root>
    )
})

export const DeletePopUp = ({ data, onClose }: {
    data: {
        propertyId: string
        unit?: boolean
        unitId?: string
    }, onClose?: () => void
}) => {
    const fetchUnits = usePropertyStore((state) => state.fetchUnits)
    const router = useRouter()

    const propertymutate = useMutation({
        mutationFn: (payload: string) => {
            return deleteProperty(payload)
        },
        onSuccess: () => {
            toast.success('Property removed successfully')
            onClose?.()
            router.push('/admin/dashboard')

        },
        onError: () => {
            toast.error('Failed to remove property')
        }
    })

    const unitmutate = useMutation({
        mutationFn: (payload: string) => {
            return deleteUnit(payload)
        },
        onSuccess: () => {
            toast.success('Unit removed successfully')
            onClose?.()
            fetchUnits(data.propertyId)
        },
        onError: () => {
            toast.error('Failed to remove unit')
        }
    })

    const removeMembers = async () => {
        if (data.unit && data.unitId) {
            return unitmutate.mutate(data.unitId)
        }
        return propertymutate.mutate(data.propertyId)
    }


    return <>
        <Flex direction={'column'} mt={4} p={4} align={'center'}>
            <Text fontSize={'18px'} mb={2} className="satoshi-bold capitalize">Delete{data.unit ? ` this unit` : 'this property?'} </Text>
            <Text w={'full'} textWrap={'wrap'} mb={4} color={'#303030'} textAlign={'center'}  >{data.unit ? 'This will permanently remove this unit from the property. This action cannot be undone.' : 'This will permanently remove this property and all associated units and data. This action cannot be undone.'}</Text>
            <Button h={'45px'} onClick={removeMembers} w={'full'} loading={propertymutate.isPending || unitmutate.isPending} color={'white'} bg={'#C00F0C'}>Remove</Button>
        </Flex>
    </>

}

