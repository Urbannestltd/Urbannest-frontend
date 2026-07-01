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
        {questions.map((question) =>
            <Flex key={question.question} direction={'column'} mt={6} border={'1px solid #DDDDDD'} rounded={'8px'} padding={'24px 16px'}>
                <Text fontSize={'18px'} className="satoshi-bold">{question.question}</Text>
                <Text>{question.answer}</Text>
            </Flex>)}
    </>
}

const questions = [
    {
        question: 'Who can add properties?',
        answer: 'Only the admin can add and edit properties. Property details are updated by the admin based on information provided by the landlord.'
    },
    {
        question: 'How do tenant approval requests work?',
        answer: "Review the tenant's details, supporting documents, and application before approving or rejecting the request."
    },
    {
        question: 'What happens when a tenant submits a maintenance request?',
        answer: 'The request is assigned to the appropriate facility manager, who tracks and updates its progress until completion.'
    },
    {
        question: 'What happens if I reject a tenant application?',
        answer: 'The assinged agent and the applicant are notified of the decision, and the unit remains available for other prospective tenants.'
    },
    {
        question: 'Can I edit or remove a property?',
        answer: 'Properties can only be edited or removed by the admin.'
    },
]
