'use client'

import { CustomCheckbox, Option } from "@/components/ui/custom-fields"
import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { NotificationFormData } from "@/schema"
import { Box, Flex, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

export const NotifPref = () => {
    const { control } = useForm<NotificationFormData>()
    return (
        <Box w={'full'}>
            <form action="">
                <PageTitle title="Notification Preference" />
                <Divider my={10} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Email Notifications" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Get important updates sent to your email address." />
                    <Stack>
                        <CustomCheckbox name='payments' control={control} options={options[0]} />
                        <CustomCheckbox name='lease' control={control} options={options[1]} />
                        <CustomCheckbox name='maintenance' control={control} options={options[2]} />
                        <CustomCheckbox name='visitors' control={control} options={options[3]} />
                    </Stack>
                </Flex>
            </form>
        </Box>
    )
}

const options: Option[] = [
    {
        label: 'Payments',
        value: 'payments',
        description: 'Get emails about payment confirmations, failed payments, and overdue payments.'
    },
    {
        label: 'Lease',
        value: 'lease',
        description: 'Get emails about lease renewals and important lease dates.'
    },
    {
        label: 'Maintenance',
        value: 'maintenance',
        description: 'Get emails about maintenance messages, status changes, and visit updates.'
    },
    {
        label: 'Visitors',
        value: 'visitors',
        description: 'Get emails when your visitor arrives or has an issue at entry.'
    }
]