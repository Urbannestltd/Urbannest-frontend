'use client'
import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { Box, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { FAQ } from "./faq"
import { Modal } from "@/components/ui/dialog"
import { NeedHelp } from "./modal"

export const SupportCenter = () => {
    const [showFAQ, setShowFAQ] = useState(false)
    if (showFAQ) {
        return <FAQ onClose={() => setShowFAQ(false)} />
    }
    return (
        <Box w={'full'}>
            <form action="">
                <PageTitle title="Support Center" />
                <Divider my={10} />
                <Modal size={'md'} modalContent={<NeedHelp />} triggerElement={<Flex mt={4} _hover={{ border: '1px solid gray' }} cursor={'pointer'} border={'1px solid #DDDDDD'} rounded={'8px'} padding={'24px 16px'}>
                    <PageTitle title="Need help?" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Tell us what you need help with and we’ll get back to you." />
                </Flex>} />

                <Flex onClick={() => setShowFAQ(true)} mt={6} _hover={{ border: '1px solid gray' }} cursor={'pointer'} border={'1px solid #DDDDDD'} rounded={'8px'} padding={'24px 16px'}>
                    <PageTitle title="Frequently Asked Questions" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Search frequently asked questions about Urbannest." />
                </Flex>

            </form>
        </Box>
    )
}

