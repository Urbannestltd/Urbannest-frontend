
import { CustomInput, CustomSelect, CustomTextarea } from "@/components/ui/custom-fields"
import { AxiosError } from "axios"
import { PageTitle } from "@/components/ui/page-title"
import { usePropertyStore } from "@/store/admin/properties"
import { Box, Button, Center, createListCollection, Flex, Grid, HStack, Span, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Divider } from "@/components/ui/divider"
import { MainButton } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { addExpense, addExpensePayload } from '@/services/fm/ticket'
import toast from "react-hot-toast"
import { AddExpenseFormData } from "@/schema/fm"
import { UploadGallery } from "@/components/ui/gallery-upload"
import { DragAndDrop } from "@/components/ui/add-image"
import { LuFlag } from "react-icons/lu"

export const LogExpense = ({ ticketid, onClose }: { onClose: () => void, ticketid: string }) => {
    const properties = usePropertyStore((state) => state.properties)
    const units = usePropertyStore((state) => state.units)
    const { control, watch, reset, handleSubmit } = useForm<AddExpenseFormData>()
    const fetchProperties = usePropertyStore((state) => state.fetchProperties)
    const fetchUnits = usePropertyStore((state) => state.fetchUnits)
    const options = [
        {
            label: 'Parts',
            value: 'PARTS'
        },
        {
            label: 'Supplies',
            value: 'SUPPLIES'
        },
        {
            label: 'Labor',
            value: 'LABOR'
        },
        {
            label: 'Equipments',
            value: 'EQUIPMENTS'
        },
        {
            label: 'Transport Costs',
            value: 'TRANSPORT_COSTS'
        },
        {
            label: 'Permits',
            value: 'PERMITS'
        }
    ]

    const [selected, setSelected] = useState(options[0])


    const props = createListCollection({
        items: properties.map((item) => ({ label: item.propertyName, value: item.propertyId }))
    })
    const unit = createListCollection({
        items: [
            { label: 'All Units', value: 'all' },
            ...units?.grouped?.flatMap((floorUnits) =>
                floorUnits.units.map((item) => ({
                    label: item.name,
                    value: item.id,
                }))
            ) ?? [],
        ]
    })
    const mutation = useMutation({
        mutationFn: (payload: addExpensePayload) => addExpense(payload),
        onSuccess: () => {
            toast.success('Expense added successfully')
            onClose()
            reset()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const onSubmit = (data: AddExpenseFormData) => {
        const payload: addExpensePayload = {
            id: ticketid,
            data: {
                date: data.date,
                amount: data.amount,
                category: selected.value,
                description: data.description
            }
        }
        mutation.mutate(payload)
        console.log(payload)
    }

    return (
        <Box className=" max-h-[99%] overflow-y-scroll" >
            <Box m={4}>
                <PageTitle title="Add New Expense" fontSize={'18px'} subFontSize={'14px'} spacing={0} subText="Log a new operational expense for a property" />
            </Box>
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <Stack gap={2}>
                    <CustomTextarea name='description' required control={control} labelBold label="Description" />
                    <HStack mt={4}>
                        <CustomInput name='date' required control={control} labelBold label="Date" type="date" />
                        <CustomInput name='amount' required control={control} labelBold label="Amount(₦)" type="number" />
                    </HStack>
                    <Text mt={4} className="satoshi-bold">Category*</Text>
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
                    <Box mt={4}>
                        <Text className="satoshi-bold my-3">Attach Receipt</Text>
                        <DragAndDrop width={'full'} dashed onFileChange={(file) => console.log(file)} />
                    </Box>

                    <Flex mt={4} gap={2}>
                        <MainButton type="submit" loading={mutation.isPending} size='lg'>Log Expense</MainButton>
                        <MainButton size="sm" onClick={onClose} variant='outline'>Cancel</MainButton>
                    </Flex>

                </Stack> </form>
        </Box>
    )
}



export const FlagMistake = ({ onClose }: { onClose?: () => void }) => {
    return (
        <Flex direction={'column'} align={'center'} py={10} px={5} color={'black'}>
            <Center mb={2} bg={'#F2C3914D'} w={12} h={12} rounded={'full'}><LuFlag color="#EA9C48" size={24} /></Center>
            <Text className="satoshi-bold text-lg my-1">Flag Expense as Mistake </Text>
            <Text w={'full'} my={2} textAlign={'center'} textWrap={'wrap'} fontSize={'16px'}>Mark this expense as a mistake if it was logged incorrectly. Flagged expenses are excluded from expense totals and reports.</Text>
            <MainButton size='lg' className="my-2" onClick={onClose}>Flag</MainButton>
            <MainButton size="lg" variant='outline' onClick={onClose}>Cancel</MainButton>
        </Flex>
    )
}

export const DeletePopup = ({ onClose }: { onClose?: () => void }) => {
    return (
        <Flex direction={'column'} align={'center'} py={5} px={5} color={'black'}>
            <Text className="satoshi-bold text-lg my-1">Delete Expense </Text>
            <Text w={'full'} textAlign={'center'} mb={2} textWrap={'wrap'} fontSize={'16px'}>This action is only available shortly after the expense was created and cannot be undone.</Text>
            <Button h={'45px'} w={'full'} color={'white'} bg={'#C00F0C'}>Remove</Button>
        </Flex>
    )
}