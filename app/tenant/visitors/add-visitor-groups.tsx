'use client'
import { addVisitorGroupsFormData } from "@/schema"
import { Box, createListCollection, Flex, HStack, IconButton } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { MainButton } from "@/components/ui/button"
import toast from "react-hot-toast"
import { VisitorList } from "./visitor-list"
import { formatDateToIso } from "@/services/date"
import { InviteVisitorBulk, InviteVisitorGroupPayload } from "@/services/visitors"
import { useEffect } from "react"
import dayjs from "dayjs"
import { useMutation } from "@tanstack/react-query"
import { useVistorsStore, Visitor } from "@/store/visitors"
import { CgUserAdd } from "react-icons/cg"

interface addVisitorProps {
    Submit: () => void
    unitid: string
    Open: (isOpen: boolean) => void
}

export const AddVisitorGroupsModal = ({ Submit, unitid, Open }: addVisitorProps) => {
    const { control, reset, handleSubmit, watch, setValue, formState } = useForm<addVisitorGroupsFormData>()
    const visitors = watch('visitorlist') || []
    const addVisitor = useVistorsStore((state) => state.addVisitor)
    const startDate = watch('dateExpected')
    const access = watch('accessType')

    const dateRequirement = () => {
        if (access?.includes('ONE_OFF') || access?.includes('WHOLE_DAY')) {
            return true
        }
        if (access?.includes('RECURRING')) return false
        return false
    }

    const timeRequirement = () => {
        if (access?.includes('ONE_OFF')) {
            return true
        }
        if (access?.includes('WHOLE_DAY') || access?.includes('RECURRING')) return false
        return false
    }

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
        mutationFn: (data: InviteVisitorGroupPayload) => InviteVisitorBulk(data),
        onSuccess: (response, variables) => {
            toast.success('Visitors added successfully')
            const newVisitor: Visitor = {
                date: variables.startDate ?? '',
                code: response.code,
                type: variables.type,
                frequency: variables.frequency,
                isGroupInvite: true,
                visitorPhone: variables.visitors[0].phone,
                visitorName: variables.visitors[0].name,
                id: variables.visitors[0].name,
                checkInTime: '-',
                checkOutTime: '-',
                status: 'UPCOMING',
            }
            addVisitor(newVisitor)
            Submit?.()
            reset()
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })


    const handleAddVisitor = (data: addVisitorGroupsFormData) => {
        const start = () => {
            if (!data.dateExpected || !data.timeExpected) {
                return null
            }
            return (new Date(`${data.dateExpected}T${data.timeExpected}`))
        }
        const payload: InviteVisitorGroupPayload = {
            visitors: data.visitorlist,
            type: data.visitorType?.[0] ?? '',
            unitId: unitid,
            groupName: data.groupName,
            startDate: start() ? start()?.toISOString() : undefined,
            endDate: formatDateToIso(data.endDate)
        }
        console.log(payload)
    }


    return (
        <Box p={4}>
            <PageTitle title="Add A Visitor" fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText="Create a visitor pass for guests, deliveries, or service providers." />
            <form onSubmit={handleSubmit(handleAddVisitor)}>
                <HStack w={'full'} gap={4}>
                    <CustomInput name='groupName' width={'full'} required control={control} label='Group Name' placeholder="Group Name" />
                    <CustomInput name='contactNumber' width={'full'} required control={control} label='Group Contact Number' placeholder="Group Contact Number" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomSelect name="visitorType" width={'full'} collection={visitorType} control={control} label='Visitor Type' placeholder="Visitor Type" />
                    <CustomSelect name="accessType" width={'full'} collection={accessType} control={control} label='Access Type' placeholder="Access Type" />
                </HStack>
                <HStack mt={4} mb={4} w={'full'} gap={4}>
                    <CustomInput name='timeExpected' disabled={!timeRequirement()} type='time' required={timeRequirement()} width={'full'} control={control} label='Time Expected' placeholder="Time Expected" />
                    <CustomInput name='dateExpected' disabled={!dateRequirement()} type='date' required={dateRequirement()} width={'full'} control={control} label='Date Expected' placeholder="Date Expected" />
                </HStack>
                <VisitorList
                    visitors={visitors}
                    onChange={(list) => setValue('visitorlist', list)}

                />
                <Flex mt={10} align={'center'} w={'full'}>
                    <MainButton disabled={mutation.isPending || !formState.isValid} loading={mutation.isPending} size="lg" type="submit">Add Vistors</MainButton>
                    <IconButton size="lg" onClick={() => Open(false)} className="h-8" rounded={'6px'} border={'1.15px solid #B2B2B2'} ml={4} variant="outline"><CgUserAdd color="#B2B2B2" size={1} /></IconButton>
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