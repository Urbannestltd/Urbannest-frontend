import { SectionBox } from "@/components/ui/section-box"
import { Row } from "./unit-columns"
import { Avatar } from "@/components/ui/avatar"
import { Box, Button, Center, Flex, Grid, GridItem, HStack, Link, Menu, Text } from "@chakra-ui/react"
import { CgTrash } from "react-icons/cg"
import { PageTitle } from "@/components/ui/page-title"
import { FiEdit } from "react-icons/fi"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { DataTable } from "@/components/ui/data-table"
import { useLeaseHistoryColumns } from "./tenant-columns"
import { leaseAgreements, VistorData } from "@/utils/data"
import Pfp from '@/app/assets/images/user-avatar.png'
import { MainButton } from "@/components/ui/button"
import { LuEllipsisVertical, LuMail, LuPhone } from "react-icons/lu"
import { Divider } from "@/components/ui/divider"
import { useEffect, useState } from "react"
import { formatDate } from "@/services/date"
import { Modal } from "@/components/ui/dialog"
import { LeaseInfo } from "./lease-info"
import { useAdminTenantStore } from "@/store/admin/tenant"

export const Tenant = ({ tenant }: { tenant: Row }) => {
    const [maintenanceFilter, setMaintenanceFilter] = useState(7)
    const tenants = useAdminTenantStore((state) => state.tenant)
    const fetchTenant = useAdminTenantStore((state) => state.fetchTenant)

    useEffect(() => {
        fetchTenant(tenant.id)
    }, [tenant.id])
    const status = [
        {
            value: 'AVAILABLE',
            label: 'Available',
            bg: '#FEE9E7'
        },
        {
            value: 'OCCUPIED',
            label: 'Occupied',
            bg: '#EBFFEE'
        }
    ]
    const statusDeets = status.find((status) => status.value === tenants?.status)

    const columns = useLeaseHistoryColumns()

    const generalInfo = [
        {
            label: 'Email Address',
            value: tenants?.email ?? 'N/A',
        },
        {
            label: 'Contact Number',
            value: tenants?.phone ?? 'N/A'
        },
        {
            label: 'Emergency Contact No',
            value: tenants?.emergencyContact ?? 'N/A'
        },
        {
            label: 'Date of Birth',
            value: formatDate(tenants?.dateOfBirth) ?? 'N/A'
        },
        {
            label: 'Occupation',
            value: tenants?.occupation ?? 'N/A'
        },
        {
            label: 'Current Employer',
            value: tenants?.employer ?? 'N/A'
        },
    ]
    const LeaseDetails = {
        apartmentName: 'The Wings Court',
        address: '1234 Baker Street, San Francisco',
        rentAmount: '₦12,000,000',
        info: [
            { label: 'Lease Length', value: tenants?.currentLease?.leaseLength ?? 'N/A' },
            { label: 'Lease Start Date', value: formatDate(tenants?.currentLease?.startDate) ?? 'N/A' },
            { label: 'Lease End Date', value: formatDate(tenants?.currentLease?.endDate) ?? 'N/A' },
            { label: 'Service Charge', value: tenants?.currentLease?.serviceCharge ?? 'N/A' },
            { label: 'Move Out Notice', value: tenants?.currentLease?.moveOutNotice ?? 'N/A' },
        ],
        agreement: 'View Agreement'
    }

    const Status = [
        {
            value: 'UPCOMING',
            label: 'Upcoming',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        },
        {
            value: 'checked-in',
            label: 'Checked In',
            bgColor: '#D8E9F9',
            textColor: '#1976D2'
        },
        {
            value: 'checked-out',
            label: 'Checked Out',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        }

    ]

    const stringToNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace('%', '')) || 0
    }


    return (
        <Flex maxW={'full'} justify={'center'} gap={8}>
            <Box>
                <SectionBox w={'748px'}>
                    <HStack justify={'space-between'}>
                        <Flex align={'center'} gap={3}>
                            <Box boxSize={'90px'}>
                                <Avatar size='full' name={tenants?.fullName} src={tenants?.profilePic} />
                            </Box>
                            <Box>
                                <Text className="text-[20px] satoshi-bold">{tenants?.fullName}</Text>
                                <Center py={1} mt={1} color={'#02542D'} className="satoshi-medium text-[14px]" rounded={'full'} bg={statusDeets?.bg}>{statusDeets?.label}</Center>
                            </Box>
                        </Flex>
                        <CgTrash size={20} />
                    </HStack>
                    <Box mt={10}>
                        <PageTitle title="General Information" fontSize={'18px'} />
                        <Grid gapX={20} mt={8} gapY={8} templateColumns={'repeat(3,1fr)'}>
                            {generalInfo.map((info) =>
                                <GridItem key={info.label}>
                                    <Text className="text-[14px] mb-1 satoshi-bold text-[#757575]">{info.label}</Text>
                                    <Text className="text-[16px] satoshi-bold">{info.value}</Text>
                                </GridItem>
                            )}
                        </Grid>
                    </Box>
                </SectionBox>
                <SectionBox mt={6} w={'748px'}>
                    <HStack justify={'space-between'}>
                        <PageTitle mt={2} fontSize={'18px'} title="Lease Information" />
                        <Modal size={'cover'} className="w-[700px]" triggerElement={<FiEdit size={16} />} modalContent={<LeaseInfo />} />

                    </HStack>
                    <Box mt={6}>
                        <HStack>
                            <Box w={'50%'} pb={1.5} borderBottom={'1px solid #F1F1F1'}>
                                <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Current Rent Amount</Text>
                                <Text className="satoshi-bold text-2xl">{tenants?.currentLease?.rentAmount}</Text>
                            </Box>
                            <Box w={'50%'}>
                                <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Lease Expiry</Text>
                                <ProgressCircle showValueText thickness={2} cap={'round'} value={stringToNumber(tenants?.currentLease?.leaseExpiryPercentage)} color={'red'} size={'xs'} />
                            </Box>

                        </HStack>
                        <Grid gapX={'100px'} mt={4.5} gapY={'52px'} alignContent={'space-between'} templateColumns={'repeat(3,1fr)'}>
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
                <SectionBox mt={6} w={'748px'}>
                    <PageTitle mt={2} fontSize={'18px'} title="Lease History" />
                    <DataTable columns={columns} my={0} data={tenants?.leaseHistory ?? []} />
                </SectionBox>
            </Box>
            <Box>
                <SectionBox w={'376px'}>
                    <PageTitle title={'Cohabitants'} fontSize={'16px'} />
                    {
                        tenants?.cohabitants?.map((contact, index) => (
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
                <SectionBox mt={6}>
                    <PageTitle title={'Visitor History'} fontSize={'16px'} />
                    <HStack>
                        {MaintenanceFilter.map((item) => (
                            <Button
                                key={item.value}
                                onClick={() => setMaintenanceFilter(item.value)}
                                w={"72px"}
                                h={"30px"}
                                rounded={"full"}
                                fontSize={"12px"}
                                className={`${maintenanceFilter === item.value
                                    ? "bg-[#F9EBD1]"
                                    : "border border-[#757575]"
                                    }`}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </HStack>
                    <Box mt={6}>
                        {tenants?.visitorHistory?.map((row, index) => {
                            const status = Status.find((status) => status.value === (row?.status ?? 'CHECKED_IN'))

                            return <Box p={1} >
                                <HStack justify={'space-between'} >
                                    <Box>
                                        <Text className="satoshi-bold text-sm capitalize">{row?.name}</Text>
                                        <Text className="satoshi-medium text-sm">{row?.phone}</Text>
                                    </Box>
                                    <Flex gap={1}>
                                        <Flex
                                            alignItems={'center'}
                                            fontSize={'14px'}
                                            fontWeight={'semibold'}
                                            bg={status?.bgColor}
                                            p={1}
                                            px={4}
                                            rounded={'3xl'}
                                            justify={'center'}
                                            w={'fit'}
                                        >
                                            <Text className="capitalize" color={status?.textColor} children={status?.label || row?.status} />
                                        </Flex>
                                        <Menu.Root>
                                            <Menu.Trigger>
                                                <LuEllipsisVertical cursor={'pointer'} />
                                            </Menu.Trigger>
                                            <Menu.Positioner>
                                                <Menu.Content>
                                                    <Menu.ItemGroup gap={3}>
                                                        <Menu.Item mb={2} cursor={'pointer'} value="save-visitor" >Save as Visitor</Menu.Item>
                                                        <Menu.Item my={2} cursor={'pointer'} value="view-details">View Details</Menu.Item>
                                                        <Menu.Item my={2} cursor={'pointer'} value="revoke-access">Revoke Access</Menu.Item>
                                                    </Menu.ItemGroup>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Menu.Root>
                                    </Flex>
                                </HStack>
                                <HStack justify={'space-between'} my={1}>
                                    <Text className="satoshi-bold text-sm">Frequency:</Text>
                                    <Text className="satoshi-medium text-sm capitalize" >{row?.frequency}</Text>
                                </HStack>
                                {index !== VistorData.visitors.length - 1 && <Divider my={4} />}
                            </Box>
                        })}

                    </Box>
                </SectionBox>
                <SectionBox mt={6}>
                    <PageTitle title="Payment History" fontSize={'16px'} />
                    <Box>
                        {tenants?.paymentHistory?.map((item, index) => (
                            <><Flex p={2} key={index}>
                                <Box>
                                    <Text className="satoshi-bold">{item.amount}</Text>
                                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'} >{formatDate(item.date)}</Text>
                                </Box>
                                <Box className={`text-end ${item.status ? 'text-success-400' : 'text-error-400'}`} ml={'auto'}>
                                    <Text className="satoshi-bold">{item.amount}</Text>
                                    <Text fontSize={'12px'}>Payment{' '}{item.status}</Text>
                                </Box>
                            </Flex>
                                {index !== tenants.paymentHistory.length - 1 && <Divider my={4} />}
                            </>
                        ))}
                    </Box>
                </SectionBox>
            </Box>
        </Flex>
    )
}


const PropertyContacts = [
    {
        title: 'Facility Manager',
        name: 'Teniola Khadijah',
        email: 'Teniola.Khadijah@gmail.com',
        pfp: Pfp
    },
    {
        title: 'Agent’s Details',
        name: 'Teniola Khadijah',
        email: 'Teniola.Khadijah@gmail.com',
        pfp: Pfp
    },
]

const MaintenanceFilter = [
    {
        label: "Today",
        value: 7,
    },
    {
        label: "Last Week",
        value: 15,
    },
    {
        label: "Last Month",
        value: 30,
    },
]


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