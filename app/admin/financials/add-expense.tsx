import { CustomInput, CustomSelect, CustomTextarea } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { addExpenseFormData } from "@/schema/admin"
import { usePropertyStore } from "@/store/admin/properties"
import { Box, Button, createListCollection, Flex, Grid, HStack, Span, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Row } from "../dashboard/[id]/unit-columns"
import { Divider } from "@/components/ui/divider"
import { MainButton } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { addExpense, addExpensePayload } from "@/services/admin/financial"
import toast from "react-hot-toast"

export const AddExpense = ({ onClose }: { onClose: () => void }) => {
    const properties = usePropertyStore((state) => state.properties)
    const units = usePropertyStore((state) => state.units)
    const { control, watch, reset, handleSubmit } = useForm<addExpenseFormData>()
    const fetchProperties = usePropertyStore((state) => state.fetchProperties)
    const fetchUnits = usePropertyStore((state) => state.fetchUnits)
    const selectedValue = watch('property')
    const options = [
        { label: 'Maintenance', value: 'MAINTENANCE' },
        { label: 'Utilities', value: 'UTILITIES' },
        { label: 'Rent', value: 'RENT' },
        { label: 'Other', value: 'OTHER' }
    ]

    const [selected, setSelected] = useState(options[0])


    useEffect(() => {
        if (!selectedValue) return
        fetchUnits(selectedValue[0])
    }, [selectedValue])
    const props = createListCollection({
        items: properties.map((item) => ({ label: item.propertyName, value: item.propertyId }))
    })
    const unit = createListCollection({
        items: Object.entries(units?.grouped ?? {}).flatMap(([floor, floorUnits]) => (floorUnits as Row[]).map((item) => ({ label: item.name, value: item.id })))
    })

    const mutation = useMutation({
        mutationFn: (payload: addExpensePayload) => addExpense(payload),
        onSuccess: () => {
            toast.success('Expense added successfully')
            reset()
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const onSubmit = (data: addExpenseFormData) => {
        const payload: addExpensePayload = {
            propertyId: data.property[0],
            unitId: data.unit[0],
            date: data.date,
            amount: data.amount,
            category: selected.value,
            description: data.description
        }
        mutation.mutate(payload)
        // console.log(payload)
    }

    return (
        <Box>
            <Box m={4}>
                <PageTitle title="Add New Expense" fontSize={'18px'} subFontSize={'14px'} spacing={0} subText="Log a new operational expense for a property" />
            </Box>
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <Stack gap={2}>
                    <CustomSelect name='property' control={control} labelBold label="Property Selection" collection={props} />
                    <CustomSelect name='unit' control={control} labelBold label="Unit Selection" isLoading={!units} collection={unit} />
                    <CustomSelect name='paymentMethod' control={control} labelBold label="Payment Method" collection={method} />
                    <HStack>
                        <CustomInput name='date' control={control} labelBold label="Date" type="date" />
                        <CustomInput name='amount' control={control} labelBold label="Amount(₦)" type="number" />
                    </HStack>
                    <Text className="satoshi-bold">Category</Text>
                    <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                        {options.map((option) => (
                            <Button
                                key={option.value}
                                px={4}
                                py={6}
                                fontSize={'14px'}
                                cursor={'pointer'}
                                bg={selected.value === option.value ? '#CFAA67' : '#D9E4EA'}
                                color={selected.value === option.value ? 'white' : '#475569'}
                                borderRight={'1px solid #D9D9D9'}
                                _last={{ borderRight: 'none' }}
                                onClick={() => setSelected(option)}
                                transition={'all 0.15s ease'}
                                className="satoshi-medium"
                            >
                                {option.label}
                            </Button>
                        ))}
                    </Grid>
                    <CustomTextarea name='description' control={control} labelBold label="Description" />
                    <Flex mt={4} gap={2}>
                        <MainButton type="submit" size='lg'>Submit</MainButton>
                        <MainButton size="sm" variant='outline'>Cancel</MainButton>
                    </Flex>
                </Stack> </form>
        </Box>
    )
}

const method = createListCollection({
    items: [
        { value: 'BANK_TRANSFER', label: 'Bank' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
    ]
})