import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { addUnitFormData } from "@/schema/admin"
import { addUnit, addUnitPayload } from "@/services/admin/property"
import { Box, createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { on } from "events"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const AddUnit = ({ propertyId, propertyName, onClose }: { propertyId: string, propertyName: string, onClose: () => void }) => {
    const { control, reset, handleSubmit, formState } =
        useForm<addUnitFormData>()

    const mutation = useMutation({
        mutationFn: (payload: addUnitPayload) => {
            return addUnit(payload)
        },
        onSuccess: () => {
            toast.success('Property added successfully')
            onClose()
            reset()
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })
    const stringtoNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace('%', '')) || 0
    }

    const onSubmit = (data: addUnitFormData) => {

        const payload: addUnitPayload = {
            propertyId: propertyId,
            data: {
                name: data.name,
                floor: data.floor[0],
                type: data.type[0].toUpperCase(),
            }

        }
        mutation.mutate(payload)
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
                        control={control}
                        label="Floor"
                        placeholder="Floor"
                    />
                </HStack>
                <Flex mt={10} align={"center"} w={"full"}>
                    <MainButton size="lg" type="submit">
                        Add Unit
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

const Flooors = createListCollection({
    items: [
        { value: '1', label: "1" },
        { value: '2', label: "2" },
        { value: '3', label: "3" },
        { value: '4', label: "4" },
        { value: '5', label: "5" },
        { value: '6', label: "6" },
        { value: '7', label: "7" },
        { value: '8', label: "8" },
        { value: '9', label: "9" },
        { value: '10', label: "10" },
    ],
})