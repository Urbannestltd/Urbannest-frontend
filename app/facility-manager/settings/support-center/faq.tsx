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
        question: 'Who creates FM accounts?',
        answer: 'Only admin can create accounts. The FM receives an invite email and sets up their password from there.'
    },
    {
        question: 'What are the ticket statuses and who controls them?',
        answer: 'Tickets move between Open, In Progress, and Resolved. The FM controls and can reverse all transitions.'
    },
    {
        question: 'What happens when an expense goes over budget?',
        answer: 'The expense enters a pending state and a budget request is automatically sent to admin.'
    },
    {
        question: 'Can the FM delete an expense?',
        answer: 'No, expenses are append-only. The FM can flag one as a mistake for admin to handle.'
    },
    {
        question: 'What can the FM do with agent visit requests?',
        answer: 'Approve, reject, or propose a new date. Tenant-logged visits are informational only.'
    },
    {
        question: 'Who can communicate through ticket chat?',
        answer: 'The FM and tenant within a specific ticket. Admin can post notes only the FM sees.'
    }
]