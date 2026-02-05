'use client'
import { addVisitorFormData } from "@/schema"
import { Box, createListCollection, Flex, HStack, IconButton } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { MainButton } from "@/components/ui/button"
import addVisitorIcon from '@/app/assets/icons/add-user-icon.svg'
import Image from "next/image"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { InviteVisitor, InviteVisitorPayload } from "@/services/visitors"
import { formatDateToIso } from "@/services/date"
import dayjs from "dayjs"
import { useVistorsStore, Visitor } from "@/store/visitors"

interface addVisitorProps {
    Submit: () => void
    Open: (isOpen: boolean) => void
}

export const AddVisitorModal = ({ Submit, Open }: addVisitorProps) => {

    const { control, reset, watch, handleSubmit, setValue } = useForm<addVisitorFormData>()
    const addVisitor = useVistorsStore((state) => state.addVisitor)

    const startDate = watch('dateExpected')

    useEffect(() => {
        if (!startDate) return

        const nextDay = dayjs(startDate)
            .add(1, "day")
            .format("YYYY-MM-DD")

        setValue('endDate', nextDay, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }, [startDate, setValue])

    const mutation = useMutation({
        mutationFn: (data: InviteVisitorPayload) => InviteVisitor(data),
        onSuccess: (response, variables: InviteVisitorPayload) => {
            const newVisitor: Visitor = {
                date: variables.startDate,
                code: '',
                type: variables.type,
                isGroupInvite: false,
                frequency: variables.frequency,
                visitorPhone: variables.visitor.phone,
                visitorName: variables.visitor.name,
                id: variables.visitor.name,
                checkInTime: variables.startDate,
                checkOutTime: variables.endDate,
                status: "UPCOMING",
            }
            addVisitor(newVisitor)
            Submit?.()
            reset()

        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })


    const handleAddVisitor = (data: addVisitorFormData) => {
        const start = new Date(`${data.dateExpected}T${data.timeExpected}`)

        const payload: InviteVisitorPayload = {
            visitor: {
                name: data.fullName,
                phone: data.phoneNumber
            },
            frequency: data.accessType[0],
            type: data.visitorType[0],
            startDate: start.toISOString(),
            endDate: formatDateToIso(data.endDate)
        }
        mutation.mutate(payload)
    }

    return (
        <Box p={4}>
            <PageTitle title="Add A Visitor" fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText="Create a visitor pass for guests, deliveries, or service providers." />
            <form onSubmit={handleSubmit(handleAddVisitor)}>
                <HStack w={'full'} gap={4}>
                    <CustomInput name='fullName' width={'full'} required control={control} label="Visitor's Name" placeholder="Full Name" />
                    <CustomInput name='phoneNumber' width={'full'} required control={control} label='Phone Number' placeholder="Phone Number" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomSelect name="visitorType" width={'full'} collection={visitorType} required control={control} label='Visitor Type' placeholder="Visitor Type" />
                    <CustomSelect name="accessType" width={'full'} collection={accessType} required control={control} label='Access Type' placeholder="Access Type" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomInput name='timeExpected' type='time' width={'full'} control={control} label='Time Expected' placeholder="Time Expected" />
                    <CustomInput name='dateExpected' type='date' width={'full'} control={control} label='Date Expected' placeholder="Date Expected" />
                </HStack>
                <Flex mt={10} align={'center'} w={'full'}>
                    <MainButton disabled={mutation.isPending} loading={mutation.isPending} size="lg" type="submit">Add Vistors</MainButton>
                    <IconButton onClick={() => Open(true)} size="lg" className="h-8" rounded={'6px'} border={'1.15px solid #B2B2B2'} ml={4} variant="outline"><Image src={addVisitorIcon} alt="add visitor" /></IconButton>
                </Flex>
            </form>
        </Box>
    )
}

const visitorType = createListCollection({
    items: [
        { label: 'Guest', value: 'GUEST' },
        { label: 'Delivery', value: 'DELIVERY' },
        { label: 'Service Provider', value: 'SERVICE_PROVIDER' },
    ]
})

const accessType = createListCollection({
    items: [
        { label: 'One Off', value: 'ONE_OFF' },
        { label: 'Whole Day', value: 'WHOLE_DAY' },
        { label: 'Recurring', value: 'RECURRING' },
    ]
})