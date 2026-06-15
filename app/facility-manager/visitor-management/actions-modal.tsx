import { MainButton } from "@/components/ui/button"
import { CheckOutVisitor, GetStatus, RepeatVisitor, statusResponse } from "@/services/fm/visitor"
import { cn } from "@/utils/lib"
import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { use, useEffect, useState } from "react"
import toast from "react-hot-toast"

export const ActionsModal = ({ type, visitorName, id, onClose, walkin = true }: { type: 'checkout' | 'status', walkin?: boolean, visitorName: string, id: string, onClose: () => void }) => {
    const [status, setStatus] = useState<statusResponse | null>(null)


    useEffect(() => {
        if (type === 'status') {
            const data = GetStatus(id)
            data.then((data) => {
                setStatus(data.data)
            })
        }
    }, [type])


    const mutation = useMutation({
        mutationFn: (id: string) => {
            if (type === 'checkout') {
                return CheckOutVisitor(id, walkin)
            }
            else return GetStatus(id)
        },
        onSuccess: (data) => {
            toast.success(data.message)
            onClose()
        }
    })

    const details: Record<'repeat' | 'checkout' | 'status', { title: string, description: string }> = {
        repeat: {
            title: `Make ${visitorName} a repeat visitor`,
            description: 'Making this visitor a repeat visitor will allow them to check in multiple times.',
        },
        checkout: {
            title: `Mark ${visitorName} as checked out`,
            description: 'Marking this visitor as checked out, confirming that this person has left the building.',
        },
        status: {
            title: ` ${visitorName} Status`,
            description: '',
        },
    }

    const { title, description } = details[type]
    const buttonLabel = type === 'checkout' ? 'Check Out' : 'Get Status'

    return (
        <Flex direction={'column'} align={'center'} py={10} px={5} color={'black'}>
            <Text className="satoshi-bold text-lg my-1">{title}</Text>
            {status ?
                <Box w={'full'} my={3} textAlign={'center'} fontSize={'16px'}>{status.status}</Box>
                : <>
                    <Text textWrap={'wrap'} w={'full'} my={3} textAlign={'center'} fontSize={'16px'}>{description}</Text>

                    {type !== 'checkout' ? <MainButton size='lg' className={"my-2"} loading={mutation.isPending} onClick={() => mutation.mutate(id)}>
                        {buttonLabel}
                    </MainButton> : <Button h={'40px'} rounded={'md'} className="satoshi-medium" my={2} w={'full'} color={'white'} loading={mutation.isPending} onClick={() => mutation.mutate(id)} bg={'#C00F0C'}>{buttonLabel}</Button>}</>
            }
            <MainButton size="lg" variant='outline' onClick={onClose}>Cancel</MainButton>
        </Flex>
    )
}
