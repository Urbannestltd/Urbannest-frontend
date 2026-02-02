'use client'
import { PageTitle } from "@/components/ui/page-title";
import { Box, Flex, Grid, HStack, Image, Span, Text, Link, Skeleton, SkeletonText } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";
import { useLeaseStore } from "@/store/lease";
import http from "@/services/https";
import endpoints from "@/services/endpoint";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { payRent, PayRentPayload, verifyPayment } from "@/services/payment";
import { formatDate, formatDateDash, formatNumber } from "@/services/date";
import { useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { UtilitiesModal } from "./modal";
import { usePaymentHistoryStore } from "@/store/payment";
import emptyStateIcon from '@/app/assets/icons/empty-state-icons/payment.svg'


export default function Lease() {
    const lease = useLeaseStore((state) => state.lease);
    const fetchLease = useLeaseStore((state) => state.fetchLease);
    const leaseLoading = useLeaseStore((state) => state.isLoading);
    const history = usePaymentHistoryStore((state) => state.history);
    const loading = usePaymentHistoryStore((state) => state.isLoading);
    const fetchPaymentHistory = usePaymentHistoryStore((state) => state.fetchPaymentHistory);

    useEffect(() => {
        fetchLease()
        fetchPaymentHistory()
    }, [])


    const LeaseDetails = {
        info: [
            { label: 'Lease Length', value: lease?.contract.daysRemaining },
            { label: 'Lease Start Date', value: formatDateDash(lease?.contract.startDate) },
            { label: 'Lease End Date', value: formatDateDash(lease?.contract.endDate) },
            { label: 'Service Charge', value: '₦2,000,000' },
            { label: 'Move Out Notice', value: '1 month' },
        ],
        agreement: 'View Agreement'

    }
    const mutation = useMutation({
        mutationFn: (data: PayRentPayload) => { return payRent(data) },
        onSuccess: (response) => {
            localStorage.setItem("payment_reference", response.data.reference)
            console.log(response.data.reference)
            window.location.href = response.data.url
        },

        onError: (error) => {
            toast.error(`Error logging in please try again: ${error?.message}`)
        }
    })
    const downloadLease = async () => {
        if (lease?.document.canDownload) {
            try {
                await http.get(endpoints.downloadLease(lease.id))
                toast.success('Lease downloaded successfully')
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                }
            }
        }
        else {
            toast.error('Lease not found')
        }
    }
    const PayMyRent = () => {
        if (lease) {
            const payload: PayRentPayload = {
                isRenewal: true,
                unitId: lease.property.unitId,
                durationUnit: 'YEAR',
                durationValue: 1,
                amount: lease.contract.rentAmount
            }
            return mutation.mutate(payload)
        }
        else {
            toast.error('Lease not found')
        }
    }

    useEffect(() => {
        const reference = localStorage.getItem("payment_reference")
        if (!reference) return
        verifyPayment(reference)
    }, [])

    return (
        <Box>
            <PageTitle mt={7} mb={5} title="Lease & Payments" />
            <Flex justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
                <HStack>
                    <Image src={rentImage.src} mr={3} w={'165px'} h={'80px'} alt="rent" />

                    {leaseLoading ?
                        <Box>
                            <SkeletonText w={'300px'} mb={2} noOfLines={1} h={'20px'} />
                            <SkeletonText w={'400px'} noOfLines={1} h={'20px'} />
                        </Box> :
                        <Box>
                            <Text className="satoshi-bold text-[24px]"> {lease?.property.unit}</Text>
                            <HStack>
                                <Image alt="location-icon" src={locateIcon.src} />
                                <Text className="satoshi-medium text-[14px] mt-0 ">{lease?.property.name}, {lease?.property.address}</Text>
                            </HStack>
                        </Box>}
                </HStack>
                <MainButton disabled={leaseLoading} onClick={PayMyRent} children="Pay Rent" />
            </Flex>
            <Flex gapX={12} mt={12}>
                <Box w={'full'}>
                    <PageTitle mt={2} title="Lease Information" />
                    {leaseLoading ? <Skeleton height={'300px'} mt={6} rounded={'8px'} /> :
                        <Box mt={6} p={'16px 24px'} rounded={'8px'} border={'1px solid #F1F1F1'}>
                            <Box pb={1.5} borderBottom={'1px solid #F1F1F1'}>
                                <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Current Rent Amount</Text>
                                <Text className="satoshi-bold text-2xl"> {formatNumber(lease?.contract.rentAmount)}</Text>
                            </Box>
                            <Grid gapX={'100px'} mt={4.5} gapY={'52px'} templateColumns={'repeat(3,1fr)'}>
                                {LeaseDetails.info.map((item, index) => (
                                    <Box key={index}>
                                        <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>{item.label}</Text>
                                        <Text className="satoshi-bold ">{item.value}</Text>
                                    </Box>
                                ))}
                                <Box>
                                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Lease Agreement</Text>
                                    <Link onClick={downloadLease} className="satoshi-medium underline text-primary-gold">{LeaseDetails.agreement} </Link>
                                </Box>
                            </Grid>
                        </Box>}
                </Box>
                <Box w={'80%'}>
                    <HStack justify={'space-between'}>
                        <PageTitle title="Payment History" />
                        <Modal triggerSize="sm" modalContent={<UtilitiesModal />} triggerVariant={'outline'} triggerContent={'Pay Utilities'} />
                    </HStack>
                    <Box maxH={'450px'} overflowY={'scroll'} mt={6}>
                        {loading ? (
                            <>
                                <Skeleton p={'16px'} h={'90px'} rounded={'8px'} my={'8px'} border={'1px solid #F1F1F1'} />
                                <Skeleton p={'16px'} h={'90px'} rounded={'8px'} my={'8px'} border={'1px solid #F1F1F1'} />
                                <Skeleton p={'16px'} h={'90px'} rounded={'8px'} my={'8px'} border={'1px solid #F1F1F1'} />
                                <Skeleton p={'16px'} h={'90px'} rounded={'8px'} my={'8px'} border={'1px solid #F1F1F1'} />
                            </>
                        ) :
                            history.map((item, index) => {

                                if (history.length === 0)
                                    return (
                                        <div className='flex flex-col items-center justify-center space-y-6'>
                                            <div className='flex items-center justify-center'>
                                                <Image src={emptyStateIcon} alt="" />
                                            </div>

                                            <div className='flex flex-col items-center justify-center space-y-2'>
                                                <h4 className='text-xl font-bold text-[#070A2C]'> No payments yet</h4>
                                                <p className='text-sm font-medium text-[#303030]'>
                                                    Your rent and other payments will show up here once you make your first payment.
                                                </p>
                                            </div>
                                        </div>
                                    )
                                return (
                                    <Flex p={'16px 24px'} rounded={'8px'} my={'8px'} border={'1px solid #F1F1F1'} key={index}>
                                        <Box>
                                            <Text className="satoshi-bold">{item.description}</Text>
                                            <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'} >{formatDate(item.date)}</Text>
                                        </Box>
                                        <Box className={`text-end ${item.status ? 'text-success-400' : 'text-error-400'}`} ml={'auto'}>
                                            <Text className="satoshi-bold">{item.amount}</Text>
                                            <Text fontSize={'12px'}>Payment{' '}{item.status === 'PAID' ? 'Successful' : 'Failed'}</Text>
                                        </Box>
                                    </Flex>
                                )
                            })}
                    </Box>
                </Box>
            </Flex >
        </Box >
    )
}

{/*
    apartmentName: 'The Wings Court',
    address: '1234 Baker Street, San Francisco',
    rentAmount: '₦12,000,000',
    info: [
        { label: 'Lease Length', value: lease?.contract.leaseLength },
        { label: 'Lease Start Date', value: '12-11-23' },
        { label: 'Lease End Date', value: '12-11-26' },
        { label: 'Service Charge', value: '₦2,000,000' },
        { label: 'Move Out Notice', value: '1 month' },
    ],
    agreement: 'View Agreement'
*/}

