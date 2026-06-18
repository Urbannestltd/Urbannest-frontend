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

interface TenantApprovalsModalProps {
    id: string
    onClose: () => void
    type: 'accept' | 'decline'
}

export const TenantApprovalsModal = ({ type, id, onClose }: TenantApprovalsModalProps) => {
    if (type === 'accept') return <ApproveRequestModal id={id} onClose={onClose} />
    if (type === 'decline') return <RejectRequestModal id={id} onClose={onClose} />

}

const ApproveRequestModal = ({ id, onClose }: { id: string, onClose: () => void }) => {

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
        <PageTitle mt={6} mb={2} title="Approve As Tenant" />
        <Text textWrap={'wrap'} className="satoshi-medium w-full" fontSize={'14px'} lineHeight={'22.57px'} color={'#566166'}>Approving this applicant will notify them and initiate the formal leasing process</Text>
        <Stack mt={6}>
            <MainButton size='lg' loading={mutation.isPending} className="my-1 rounded-md" onClick={() => mutation.mutate(id)}>Approve</MainButton>
            <MainButton size="lg" variant='outline' className="rounded-md" onClick={onClose}>Cancel</MainButton>
        </Stack>


    </Box>
}

const RejectRequestModal = ({ id, onClose }: { id: string, onClose: () => void }) => {
    const { control, handleSubmit } = useForm<{ reason: string }>()

    const mutation = useMutation({
        mutationFn: (payload: RejectPayload) => RejectAgent(payload),
        onSuccess: () => {
            onClose()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to reject tenant')
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
                <Text className="text-lg satoshi-bold">Reject As Tenant</Text>
                <Text fontSize={'14px'} color={'#566166'}>Decline this tenant’s application</Text>
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
                    <Button type='submit' w={'50%'} color={'white'} rounded={'md'} bg={'#DC2626'} className="my-2 satoshi-bold" ><LuBan size={16} /> Confirm Rejection</Button>
                    <MainButton size="lg" className="h-[41px]" fullWidth variant='outline' onClick={onClose}>Cancel</MainButton>
                </Flex>
            </Box>
        </form>


    </Box>
}
