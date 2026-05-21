import { MainButton } from "@/components/ui/button"
import { AxiosError } from "axios"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { addUnitFormData } from "@/schema/admin"
import { addUnit, addUnitPayload, editUnit, editUnitPayload } from "@/services/admin/property"
import { usePropertyStore } from "@/store/admin/properties"
import { Box, createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"



export const AddUnit = ({ propertyId, propertyName, onClose, floors, editUnitId, isOpen }: { propertyId: string, isOpen?: boolean, propertyName: string, onClose: () => void, floors?: number, editUnitId?: string }) => {
    const { control, reset, handleSubmit, formState } =
        useForm<addUnitFormData>()
    const unit = usePropertyStore((state) => state.unit)
    const fetchUnit = usePropertyStore((state) => state.fetchUnit)
    const clearUnit = usePropertyStore((state) => state.clearUnit)



    if (!floors) floors = 100

    const Flooors = useMemo(() => createListCollection({
        items: [...Array(floors).keys()].map((floor) => ({
            value: (floor + 1).toString(),
            label: `Floor ${floor + 1}`
        }))
    }), [floors])
    // Effect 1: fetch when modal opens
    useEffect(() => {
        if (!editUnitId || !isOpen) return
        fetchUnit(editUnitId)
    }, [isOpen, editUnitId])

    // Effect 2: reset form once unit is loaded
    useEffect(() => {
        if (!unit || !isOpen || !editUnitId) return
        const floort = Flooors.items.find((floor) => floor.label === unit?.floor)?.value
        reset({
            name: unit?.name,
            floor: [floort as string],
            type: [unit?.type as string]
        })
    }, [unit])

    // Effect 3: clear on close
    useEffect(() => {
        if (!isOpen) {
            reset({})
            clearUnit()
        }
    }, [isOpen])



    const mutation = useMutation({
        mutationFn: (payload: addUnitPayload) => {
            return addUnit(payload)
        },
        onSuccess: () => {
            toast.success('Unit added successfully')
            onClose()
            reset()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const editMutation = useMutation({
        mutationFn: (payload: editUnitPayload) => {
            return editUnit(payload)
        },
        onSuccess: () => {
            toast.success('Unit updated successfully')
            onClose()
            reset()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const stringtoNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace('%', '')) || 0
    }

    const onSubmit = (data: addUnitFormData) => {
        const payload: addUnitPayload = {
            propertyId: editUnitId ? editUnitId : propertyId,
            data: {
                name: data.name,
                floor: data.floor[0],
                type: data.type[0].toUpperCase(),
            }

        }
        if (editUnitId) {
            editMutation.mutate(payload)
        } else {
            mutation.mutate(payload)
        }
    }



    return (
        <Box p={4}>
            <PageTitle
                title="Add A Unit"
                fontSize={"18px"}
                mb={7}
                spacing={0}
                subFontSize={"14px"}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <HStack w={"full"} gap={4}>
                    <CustomInput
                        name='name'
                        width={"full"}
                        required
                        control={control}
                        label="Unit Name"
                        placeholder="Unit Name"
                    />
                    <CustomSelect
                        name='type'
                        width={"full"}
                        control={control}
                        collection={unitType}
                        label="Unit Type"
                        placeholder="Unit Type"
                    />
                </HStack>
                <HStack mt={4} w={"full"} gap={4}>
                    <CustomInput
                        name='property'
                        width={"full"}
                        value={propertyName}
                        readOnly
                        control={control}
                        label="Property"
                        placeholder="Property"
                    />
                    <CustomSelect
                        name='floor'
                        width={"full"}
                        collection={Flooors}
                        required
                        readOnly={unit?.floor ? true : false}
                        control={control}
                        label="Floor"
                        placeholder="Floor"
                    />
                </HStack>
                <Flex mt={10} align={"center"} w={"full"}>
                    <MainButton size="lg" loading={mutation.isPending} type="submit">
                        {editUnitId ? 'Edit' : 'Add'} Unit
                    </MainButton>
                </Flex>
            </form>
        </Box>
    )
}

const unitType = createListCollection({
    items: [
        { value: 'ONE_BEDROOM', label: 'One Bedroom' },
        { value: 'TWO_BEDROOM', label: 'Two Bedroom' },
        { value: 'THREE_BEDROOM', label: 'Three Bedroom' },
        { value: 'FOUR_BEDROOM', label: 'Four Bedroom' },
    ],
})
