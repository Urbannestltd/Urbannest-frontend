import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { Flex, HStack, Text } from "@chakra-ui/react"
import { FaArrowLeft } from "react-icons/fa"

export const FAQ = ({ onClose }: { onClose?: () => void }) => {
    return <>
        <HStack>
            <FaArrowLeft cursor={'pointer'} onClick={onClose} size={14} />
            <PageTitle title="Frequently Asked Questions" />
        </HStack>
        <Divider my={10} />
        {Questions.map((question) =>
            <Flex direction={'column'} mt={6} border={'1px solid #DDDDDD'} rounded={'8px'} padding={'24px 16px'}>
                <Text fontSize={'18px'} className="satoshi-bold">{question.question}</Text>
                <Text>{question.answer}</Text>
            </Flex>)}
    </>
}

const Questions = [
    {
        question: 'Can I see proof of my past payments?',
        answer: 'Yes. All successful payments are recorded and available in your payment history'
    },
    {
        question: 'How do I submit a maintenance request?',
        answer: 'Go to Maintenance & Issues, select the issue category, and add a brief description.'
    },
    {
        question: 'How will I know if someone is working on my request?',
        answer: 'You’ll receive updates when the status changes or when facility management sends a message.'
    },
    {
        question: 'What if the issue isn’t resolved?',
        answer: 'You can reply to the maintenance thread to follow up or provide more details.'
    }
]