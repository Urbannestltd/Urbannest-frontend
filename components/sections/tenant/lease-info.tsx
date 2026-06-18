/* eslint-disable react/jsx-key, react/no-children-prop */
import { SectionBox } from "@/components/ui/section-box"
import { Avatar } from "@/components/ui/avatar"
import { Box, Flex, Grid, HStack, Link, Text } from "@chakra-ui/react"
import { PageTitle } from "@/components/ui/page-title"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { MainButton } from "@/components/ui/button"
import { LuEllipsisVertical, LuMail, LuPhone } from "react-icons/lu"
import { Divider } from "@/components/ui/divider"
import { formatDate, formatNumber, leaseExpiry, stringToNumber } from "@/services/date"
import { cohabitants } from "@/store/admin/tenant"

interface currentLeaseProps {
    agreementUrl: string
    moveOutNotice: string
    endDate: string
    startDate: string
    leaseLength: string
    leaseExpiryPercentage: string
    serviceCharge: number
    rentAmount: number
    leaseId: string
}


export const LeaseInfoSection = ({ currentLease }: { currentLease: currentLeaseProps }) => {
    const LeaseDetails = {
        apartmentName: 'The Wings Court',
        address: '1234 Baker Street, San Francisco',
        rentAmount: '₦12,000,000',
        info: [
            { label: 'Lease Length', value: currentLease?.leaseLength ?? 'N/A' },
            { label: 'Lease Start Date', value: formatDate(currentLease?.startDate) ?? 'N/A' },
            { label: 'Lease End Date', value: formatDate(currentLease?.endDate) ?? 'N/A' },
            { label: 'Service Charge', value: currentLease?.serviceCharge ?? 'N/A' },
            { label: 'Move Out Notice', value: currentLease?.moveOutNotice ?? 'N/A' },
        ],
        agreement: 'View Agreement'
    }

    return <SectionBox mt={6} w={{ base: 'full' }}>
        <HStack justify={'space-between'}>
            <PageTitle mt={2} fontSize={'18px'} title="Lease Information" />
        </HStack>
        <Box mt={6}>
            <HStack justify={{ base: 'space-between', md: 'start' }}>
                <Box w={'50%'} pb={1.5}>
                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Current Rent Amount</Text>
                    <Text className="satoshi-bold text-2xl">{formatNumber(currentLease?.rentAmount)}</Text>
                </Box>
                <Box w={{ base: 'fit', md: '50%' }}>
                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Lease Left</Text>
                    <ProgressCircle showValueText thickness={2} cap={'round'} value={stringToNumber(currentLease?.leaseExpiryPercentage)} color={leaseExpiry(stringToNumber(currentLease?.leaseExpiryPercentage))} size={'xs'} />
                </Box>
            </HStack>
            <Divider />
            <Grid gapX={'100px'} mt={4.5} gapY={'52px'} alignContent={'space-between'} templateColumns={{ base: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }}>
                {LeaseDetails.info.map((item, index) => (
                    <Box key={index}>
                        <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>{item.label}</Text>
                        <Text className="satoshi-bold ">{item.value}</Text>
                    </Box>
                ))}
                <Box>
                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Lease Agreement</Text>
                    <Link className="satoshi-medium underline text-primary-gold">{LeaseDetails.agreement} </Link>
                </Box>
            </Grid>
        </Box>
    </SectionBox>
};

export const CohabitantsSection = ({ cohabitants }: { cohabitants: cohabitants[] }) => {
    return <SectionBox w={{ base: 'full' }}>
        <PageTitle title={'Cohabitants'} fontSize={'16px'} />
        {
            cohabitants?.length === 0 && <Text className="text-[14px] my-4 satoshi-medium text-center text-[#757575]">No cohabitants found</Text>}
        {cohabitants?.map((contact, index) => (
            <Box key={index}>
                <HStack justify={'space-between'}>
                    <Flex mt={2} justify={'start'}>
                        <Avatar size={'lg'} src={contact.photoUrl} name={contact.name} />
                        <Box ml={'11px'} w={'full'}>
                            <Box >
                                <Text className="satoshi-bold">{contact.name}</Text>
                                <Text mt={1} color={'#010F0D'}>{contact.email}</Text>
                            </Box>
                            <Flex mt={3} gap={2}>
                                <MainButton size='lg' icon={<LuPhone />}>Contact</MainButton>
                                <MainButton size='lg' variant="outline" icon={<LuMail />}>Send Email</MainButton>
                            </Flex>
                        </Box>
                    </Flex>
                    <LuEllipsisVertical />
                </HStack>

                {index !== 1 && <Divider my={4} />}
            </Box>
        ))
        }
    </SectionBox>
}