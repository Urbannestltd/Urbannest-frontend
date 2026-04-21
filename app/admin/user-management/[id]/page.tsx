'use client'
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/dialog";
import { Divider } from "@/components/ui/divider";
import { PageTitle } from "@/components/ui/page-title";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { SectionBox } from "@/components/ui/section-box";
import { formatDate, formatNumber } from "@/services/date";
import { useAdminTenantStore } from "@/store/admin/tenant";
import { useUserStore } from "@/store/admin/user";
import { Box, Breadcrumb, Button, Center, Circle, Field, Flex, Grid, GridItem, HStack, Image, Link, Stack, Switch, Text, Timeline } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { CgTrash } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { LeaseInfo } from "../../dashboard/[id]/lease-info";
import { MainButton } from "@/components/ui/button";
import { LuBan, LuChevronRight, LuCircleX, LuUserSearch } from "react-icons/lu";
import { AddMemberModal } from "../../dashboard/[id]/add-modal";
import { CustomSwitch } from "@/components/ui/custom-fields";
import { useForm } from "react-hook-form";
import { permissionFormData } from "@/schema/admin";

export default function UserPage() {
    const params = useParams();
    const id = params?.id as string
    const user = useUserStore(state => state.user)
    const activities = useUserStore(state => state.activities)
    const fetchActivities = useUserStore(state => state.fetchActivities)
    const fetchUser = useUserStore(state => state.fetchUser)
    const tenant = useAdminTenantStore(state => state.tenant)
    const fetchTenant = useAdminTenantStore(state => state.fetchTenant)
    const { control } = useForm<permissionFormData>()


    useEffect(() => {
        fetchUser(id)
        fetchTenant(id)
        fetchActivities(id)
    }, [id])

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

    const statusDeets = status.find((status) => status.value === user?.status)


    const generalInfo = [
        {
            label: 'Email Address',
            value: user?.email ?? 'N/A',
        },
        {
            label: 'Contact Number',
            value: user?.phone ?? 'N/A'
        },
        {
            label: 'Emergency Contact No',
            value: user?.emergencyContact ?? 'N/A'
        },
        {
            label: 'Date of Birth',
            value: formatDate(user?.dateOfBirth) ?? 'N/A'
        },
        {
            label: 'Occupation',
            value: user?.occupation ?? 'N/A'
        },
        {
            label: 'Current Employer',
            value: user?.employer ?? 'N/A'
        },
    ]
    const LeaseDetails = {
        apartmentName: 'The Wings Court',
        address: '1234 Baker Street, San Francisco',
        rentAmount: '₦12,000,000',
        info: [
            { label: 'Lease Length', value: tenant?.currentLease?.leaseLength ?? 'N/A' },
            { label: 'Lease Start Date', value: formatDate(tenant?.currentLease?.startDate) ?? 'N/A' },
            { label: 'Lease End Date', value: formatDate(tenant?.currentLease?.endDate) ?? 'N/A' },
            { label: 'Service Charge', value: tenant?.currentLease?.serviceCharge ?? 'N/A' },
            { label: 'Move Out Notice', value: tenant?.currentLease?.moveOutNotice ?? 'N/A' },
        ],
        agreement: 'View Agreement'
    }


    const leaseExpiry = (row: number) => {
        if (row >= 0 && row <= 40) { return '#EC221F' }
        if (row >= 41 && row <= 70) { return '#E8B931' }
        if (row >= 71) { return '#14AE5C' }
        return ''
    }

    const stringToNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace('%', '')) || 0
    }

    const activeLease = () => {
        if (tenant?.status === 'Active Lease') {
            return tenant.id
        }
        return ''
    }

    return (
        <div>
            <PageTitle title="User Management" fontSize={'22px'} />
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/admin/user-management">
                            User Management
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">
                            {user?.fullName}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Flex maxW={'full'} justify={'center'} mt={6} gap={8}>
                <Box w={'728px'}>
                    <SectionBox w={'728px'}>
                        <HStack justify={'space-between'}>
                            <Flex align={'center'} gap={3}>
                                <Box boxSize={'90px'}>
                                    <Avatar size='full' name={user?.fullName} src={user?.profileUrl} />
                                </Box>
                                <Box>
                                    <Text className="text-[20px] satoshi-bold">{user?.fullName}</Text>
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
                    <SectionBox mt={6} w={'728px'}>
                        <HStack justify={'space-between'}>
                            <PageTitle mt={2} fontSize={'18px'} title="Lease Information" />
                            <Modal size={'cover'} className="h-fit w-[700px]" triggerElement={<FiEdit cursor={'pointer'} size={16} />} modalContent={<LeaseInfo tenantId={tenant?.id ?? ''} unitId={tenant?.id ?? ''} activeId={activeLease()} />} />

                        </HStack>
                        <Box mt={6}>
                            <HStack>
                                <Box w={'50%'} pb={1.5}>
                                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Current Rent Amount</Text>
                                    <Text className="satoshi-bold text-2xl">{formatNumber(tenant?.currentLease?.rentAmount)}</Text>
                                </Box>
                                <Box w={'50%'}>
                                    <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'}>Lease Expiry</Text>
                                    <ProgressCircle showValueText thickness={2} cap={'round'} value={stringToNumber(tenant?.currentLease?.leaseExpiryPercentage)} color={leaseExpiry(stringToNumber(tenant?.currentLease?.leaseExpiryPercentage))} size={'xs'} />
                                </Box>
                            </HStack>
                            <Divider />
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
                    <SectionBox mt={6} w={'728px'}>
                        <PageTitle mt={2} mb={2} fontSize={'18px'} title="System Activity Log" />
                        <Timeline.Root showLastSeparator>
                            {activities.map((activity, index) => (
                                <Timeline.Item position={'relative'} key={index} title={activity.action} >
                                    <Timeline.Connector>
                                        <Timeline.Separator border={"1px solid #F4F4F4"} />
                                        <Timeline.Indicator bg={'transparent'} >
                                            <Circle size={'10px'} bg={'#CBD5E1'} />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content w={"full"}>
                                        <Flex w={"full"} justify={"space-between"}>
                                            <Box>
                                                <Timeline.Title className="satoshi-bold mb-[6px] capitalize">
                                                    {activity.action.toLowerCase()}
                                                </Timeline.Title>
                                                <Timeline.Description>
                                                    {activity.description}
                                                </Timeline.Description>
                                            </Box>
                                            <Text fontSize={"xs"} textStyle="xs">
                                                {formatDate(activity.createdAt)}
                                            </Text>
                                        </Flex>
                                    </Timeline.Content>

                                </Timeline.Item>
                            ))}
                        </Timeline.Root>
                        <MainButton className="mt-4 bg-[#F8FAFC] text-blue-950 hover:text-white border-none" size="lg" variant='primary' >See All Activity</MainButton>
                    </SectionBox>
                </Box>
                <Box w={'376px'}>
                    <SectionBox p={6} w={'full'}>
                        <Text
                            letterSpacing={"1.1px"}
                            mb={6}
                            className="satoshi-bold uppercase text-[#757575] text-[10px]"
                        >
                            Management Actions
                        </Text>
                        <Modal triggerElement={<MainButton
                            variant="darkGhost"
                            icon={<LuChevronRight />}
                            iconPosition="right"
                            size="lg"
                            className="h-[38px] justify-between  text-lg satoshi-bold"
                        >
                            <Flex align={"center"}>
                                <LuUserSearch className="mr-2" /> Assign / Reassign
                            </Flex>
                        </MainButton>} modalContent={<AddMemberModal />} />
                        <MainButton
                            variant="outline"
                            iconPosition="right"
                            iconColor="#DC2626"
                            icon={<LuChevronRight />}
                            size="lg"
                            onClick={() => { }}
                            className="h-[38px] my-3 justify-between rounded-full border-[#DC2626]  text-lg satoshi-bold"
                        >
                            <Flex color={'#DC2626'} align={"center"}>
                                <LuBan className="mr-2" size={14} />{" "}
                                Suspend User Account
                            </Flex>
                        </MainButton>
                    </SectionBox>
                    <SectionBox p={4} mt={6} w={'full'}>
                        <Text
                            letterSpacing={"1.1px"}
                            mb={6}
                            className="satoshi-bold uppercase text-[#757575] text-[10px]"
                        >
                            permissions editor
                        </Text>
                        <Box>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Tenant Portal" fontSize={'14px'} subText="Allow user to log into the mobile/web
app." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name="tenantPortal" control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Pay Rent Online" fontSize={'14px'} subText="Enable digital payment processing for
this user." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='payRent' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Request Maintenance" fontSize={'14px'} subText="Allow submission of new work orders." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='requestMaintenance' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Visitor Allowance" fontSize={'14px'} subText="Allow user schedule visitors ahead of time." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='visitorAllowance' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>

                        </Box>
                    </SectionBox>
                </Box>

            </Flex>

        </div>
    )
}