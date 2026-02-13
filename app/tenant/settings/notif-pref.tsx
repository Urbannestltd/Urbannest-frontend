'use client'

import { CustomCheckbox, Option } from "@/components/ui/custom-fields"
import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { NotificationFormData } from "@/schema"
import { getNotifPreferences, updateNotifPreferences } from "@/services/settings"
import { Box, Flex, Stack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const NotifPref = () => {

    const [notifValues, setNotifValues] = useState<NotificationFormData>()

    useEffect(() => {
        const getNotifValues = async () => {
            const response = await getNotifPreferences()
            setNotifValues(response)
        }
        getNotifValues()
    }, [])

    const { control, handleSubmit } = useForm<NotificationFormData>({ defaultValues: notifValues })

    const mutation = useMutation({
        mutationFn: (payload: NotificationFormData) => updateNotifPreferences(payload),
        onSuccess: () => {
            toast.success('Updated successfully', {
                position: 'top-right',
                duration: 3000,
                style: {
                    background: '#333',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '14px',
                }
            })
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const onSubmit = async (data: NotificationFormData) => {
        console.log('starting update')
        mutation.mutate(data)
    }

    const submitForm = handleSubmit(onSubmit);

    return (
        <Box w={'full'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PageTitle title="Notification Preference" />
                <Divider my={10} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Email Notifications" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Get important updates sent to your email address." />
                    <Stack>
                        <CustomCheckbox name='emailPayments' control={control} onChange={submitForm}
                            value={notifValues?.emailPayments} options={options[0]} />
                        <CustomCheckbox name='emailLease' control={control} onChange={submitForm}
                            value={notifValues?.emailLease} options={options[1]} />
                        <CustomCheckbox name='emailMaintenance' control={control} onChange={submitForm}
                            value={notifValues?.emailMaintenance} options={options[2]} />
                        <CustomCheckbox name='emailVisitors' control={control} onChange={submitForm}
                            value={notifValues?.emailVisitors} options={options[3]} />
                    </Stack>
                </Flex>
            </form>
        </Box>
    )
}

const options = [
    {
        label: 'Payments',
        description: 'Get emails about payment confirmations, failed payments, and overdue payments.'
    },
    {
        label: 'Lease',
        description: 'Get emails about lease renewals and important lease dates.'
    },
    {
        label: 'Maintenance',
        description: 'Get emails about maintenance messages, status changes, and visit updates.'
    },
    {
        label: 'Visitors',
        description: 'Get emails when your visitor arrives or has an issue at entry.'
    }
]