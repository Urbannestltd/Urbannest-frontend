import { PageTitle } from "@/components/ui/page-title";
import { Box, Flex, Grid, HStack, Image, Span, Text, Link } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";

const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-");

    const date = new Date(
        Number(`20${year}`),        // year → 2025
        Number(month) - 1,          // month index
        Number(day)
    );

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: 'long',
        year: "numeric",
    });
};

export default function Lease() {
    return (
        <Box>
            <PageTitle mt={7} mb={5} title="Lease & Payments" />
            <Flex justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
                <HStack>
                    <Image src={rentImage.src} mr={3} w={'165px'} h={'80px'} alt="rent" />
                    <Box>
                        <Text className="satoshi-bold text-[24px]"> {LeaseDetails.apartmentName}</Text>
                        <HStack>
                            <Image alt="location-icon" src={locateIcon.src} />
                            <Text className="satoshi-medium text-[14px] mt-0 ">{LeaseDetails.address}</Text>
                        </HStack>
                    </Box>
                </HStack>
                <MainButton children="Pay Rent" />
            </Flex>
            <Flex gapX={12} mt={12}>
                <Box w={'full'}>
                    <PageTitle mt={2} title="Lease Information" />
                    <Box mt={6} p={'16px 24px'} rounded={'8px'} border={'1px solid #F1F1F1'}>
                        <Box pb={1.5} borderBottom={'1px solid #F1F1F1'}>
                            <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Current Rent Amount</Text>
                            <Text className="satoshi-bold text-2xl">{LeaseDetails.rentAmount}</Text>
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
                                <Link className="satoshi-medium underline text-primary-gold">{LeaseDetails.agreement} </Link>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
                <Box w={'80%'}>
                    <HStack justify={'space-between'}>
                        <PageTitle title="Payment History" />
                        <MainButton size="sm" className="h-[40px]" variant='outline' children="Pay Utilities" />
                    </HStack>
                    <Box mt={6}>
                        {PaymentHistory.map((item, index) => (
                            <Flex p={'16px 24px'} rounded={'8px'} my={'8px'} border={'1px solid #F1F1F1'} key={index}>
                                <Box>
                                    <Text className="satoshi-bold">{item.paymentName}</Text>
                                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'} >{formatDate(item.date)}</Text>
                                </Box>
                                <Box className={`text-end ${item.success ? 'text-success-400' : 'text-error-400'}`} ml={'auto'}>
                                    <Text className="satoshi-bold">{item.amount}</Text>
                                    <Text fontSize={'12px'}>Payment{' '}{item.success ? 'Successful' : 'Failed'}</Text>
                                </Box>
                            </Flex>
                        ))}
                    </Box>
                </Box>
            </Flex >
        </Box >
    )
}

const LeaseDetails = {
    apartmentName: 'The Wings Court',
    address: '1234 Baker Street, San Francisco',
    rentAmount: '₦12,000,000',
    info: [
        { label: 'Lease Length', value: '4 years' },
        { label: 'Lease Start Date', value: '12-11-23' },
        { label: 'Lease End Date', value: '12-11-26' },
        { label: 'Service Charge', value: '₦2,000,000' },
        { label: 'Move Out Notice', value: '1 month' },
    ],
    agreement: 'View Agreement'
}

const PaymentHistory: { paymentName: string; date: string; amount: string; success: boolean }[] = [
    {
        paymentName: 'Electricity',
        date: '13-11-23',
        amount: '₦2,000,000',
        success: true
    },
    {
        paymentName: 'Electricity',
        date: '22-11-23',
        amount: '₦2,000,000',
        success: false
    },
    {
        paymentName: 'Rent Renewal',
        date: '22-11-23',
        amount: '₦12,000,000',
        success: true
    }, {
        paymentName: 'Electricity',
        date: '22-11-23',
        amount: '₦2,000,000',
        success: false
    }, {
        paymentName: 'Electricity',
        date: '22-11-23',
        amount: '₦2,000,000',
        success: true
    }
]