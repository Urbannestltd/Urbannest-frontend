import { Box, Button, Center, Flex, HStack, Stack, Text } from "@chakra-ui/react"
import Image from "next/image"
import ApproveIcon from '@/app/assets/icons/facilty-icons/approve-visit.svg'
import { PageTitle } from "@/components/ui/page-title"
import { MainButton } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { ApproveAgent, RejectAgent, RejectPayload, RescheduleAgent, ReschedulePayload } from "@/services/fm/visitor"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { LuBan, LuCalendar, LuCircleX, LuClock } from "react-icons/lu"
import { Divider } from "@/components/ui/divider"
import { useForm } from "react-hook-form"
import { CustomTextarea } from "@/components/ui/custom-fields"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatDate, formatDatetoTime } from "@/services/date"
import { useRef, useState } from "react"

export const ApproveRequestModal = ({ id, onClose, agentData }: { id: string, agentData: { name: string, unit: string }, onClose: () => void }) => {

    const mutation = useMutation({
        mutationFn: (id: string) => ApproveAgent(id),
        onSuccess: () => {
            onClose()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to remove property')
        }
    })

    return <Box p={6} w={'full'}>
        <Image src={ApproveIcon} alt="approve-icon" />
        <PageTitle mt={6} mb={2} title="Approve Visit Request?" />
        <Text textWrap={'wrap'} className="satoshi-medium w-full" fontSize={'14px'} lineHeight={'22.57px'} color={'#566166'}>Approving this request will notify Agent {agentData.name}
            and generate a digital keycard for {agentData.unit}.</Text>
        <Stack mt={6}>
            <MainButton size='lg' loading={mutation.isPending} className="my-1 rounded-full" onClick={() => mutation.mutate(id)}>Approve</MainButton>
            <MainButton size="lg" variant='outline' className="rounded-full" onClick={onClose}>Cancel</MainButton>
        </Stack>


    </Box>
}

export const RejectRequestModal = ({ id, onClose }: { id: string, onClose: () => void }) => {
    const { control, handleSubmit } = useForm<{ reason: string }>()

    const mutation = useMutation({
        mutationFn: (payload: RejectPayload) => RejectAgent(payload),
        onSuccess: () => {
            onClose()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to remove property')
        }
    })

    const onSubmit = (data: { reason: string }) => {
        const payload: RejectPayload = {
            id: id,
            reason: data.reason
        }
        mutation.mutate(payload)
    }

    return <Box>
        <HStack p={4}>
            <Center p={2.5} rounded={'12px'} bg={'#FE898333'}>
                <LuCircleX size={20} color="#9F403D" />
            </Center>
            <Box>
                <Text className="text-lg satoshi-bold">Reject Visit Request?</Text>
                <Text fontSize={'14px'} color={'#566166'}>This will notify the visitor and the host.</Text>
            </Box>
        </HStack>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={4} w={'full'}>
                <Text
                    letterSpacing={"1.1px"}
                    mb={0}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >Reason for rejection (optional)</Text>
                <CustomTextarea borderColor="#F4F4F4" control={control} name="reason" placeholder="Explain why this request is being 
            rejected..." />
                <Flex align={'center'} mt={'30px'} gap={4}>
                    <Button type='submit' w={'50%'} color={'white'} rounded={'full'} bg={'#DC2626'} className="my-2 satoshi-bold" ><LuBan size={16} /> Confirm Rejection</Button>
                    <MainButton size="lg" className="h-[41px]" fullWidth variant='outlineGhost' onClick={onClose}>Cancel</MainButton>
                </Flex>
            </Box>
        </form>


    </Box>
}


export const RescheduleRequestModal = ({ id, onClose, proposedDate }: { id: string, proposedDate: string, onClose: () => void }) => {
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string>('')
    const dateRef = useRef<HTMLInputElement>(null)
    const timeRef = useRef<HTMLInputElement>(null)

    const mutation = useMutation({
        mutationFn: (payload: ReschedulePayload) => RescheduleAgent(payload),
        onSuccess: () => {
            onClose()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to reschedule visit')
        }
    })

    const handlePropose = () => {
        const date = selectedDate || proposedDate.split('T')[0]
        const fallbackTime = proposedDate
            ? `${String(new Date(proposedDate).getHours()).padStart(2, '0')}:${String(new Date(proposedDate).getMinutes()).padStart(2, '0')}`
            : '00:00'
        const time = selectedTime || fallbackTime
        mutation.mutate({ id, proposedDate: `${date}T${time}:00` })
    }

    return <Box p={4}>
        <PageTitle title='Propose New Time?' fontSize={'16px'} />
        <SectionFlex position={'relative'} onClick={() => dateRef.current?.showPicker()} my={4} align={'center'} justify={'space-between'} bg={'#F0F4F7'} cursor='pointer'>
            <Box>
                <Text
                    letterSpacing={"1.1px"}
                    mb={0}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >PROPOSED DATE</Text>
                <Text>{selectedDate ? formatDate(selectedDate) : (formatDate(proposedDate) ?? 'Oct 27, 2023')}</Text>
            </Box>
            <LuCalendar size={20} color="#A9B4B9" />
            <input
                ref={dateRef}
                type='date'
                style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', bottom: 0, left: '50%' }}
                onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value) }}
            />
        </SectionFlex>
        <SectionFlex position={'relative'} onClick={() => timeRef.current?.showPicker()} my={4} align={'center'} justify={'space-between'} bg={'#F0F4F7'} cursor='pointer'>
            <Box>
                <Text
                    letterSpacing={"1.1px"}
                    mb={0}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >PROPOSED TIME</Text>
                <Text>{selectedTime
                    ? (() => { const [h, m] = selectedTime.split(':').map(Number); const p = h >= 12 ? 'PM' : 'AM'; return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}` })()
                    : (formatDatetoTime(proposedDate, true) ?? '02:00 PM')
                }</Text>
            </Box>
            <LuClock size={20} color="#A9B4B9" />
            <input
                ref={timeRef}
                type='time'
                style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', bottom: 0, left: '50%' }}
                onChange={(e) => { if (e.target.value) setSelectedTime(e.target.value) }}
            />
        </SectionFlex>

        <Stack>
            <MainButton size="lg" loading={mutation.isPending} className="my-1 h-[44px] rounded-full" onClick={handlePropose}>Propose New Time</MainButton>
            <MainButton size="lg" variant='outline' className="my-0 h-[44px] rounded-full" onClick={onClose}>Cancel</MainButton>
        </Stack>

    </Box>
}