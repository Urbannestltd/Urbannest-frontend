import { Avatar } from "@/components/ui/avatar";
import { MainButton } from "@/components/ui/button";
import { CustomSwitch } from "@/components/ui/custom-fields";
import { Modal } from "@/components/ui/dialog";
import { PageTitle } from "@/components/ui/page-title";
import { SectionBox } from "@/components/ui/section-box";
import { landlordPermissionFormData } from "@/schema/admin";
import { formatDate } from "@/services/date"
import { useUserStore } from "@/store/admin/user"
import { Box, Button, Center, Circle, Flex, Grid, GridItem, HStack, Icon, Text, Timeline } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CgTrash } from "react-icons/cg";
import { LuBan, LuChevronRight, LuUserSearch } from "react-icons/lu";
import { AddMemberModal } from "../../dashboard/[id]/add-modal";
import { Progress } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { useColumns } from "./landlord-columns";
import { useMutation } from "@tanstack/react-query";
import { activateUser, suspendUser } from "@/services/admin/user";
import toast from "react-hot-toast";
import { cn } from "@/utils/lib";
import { SuspendPopUp } from "./page";
import { useState } from "react";


export const Agent = ({ userId }: { userId: string }) => {
    const user = useUserStore(state => state.user)
    const fetchUser = useUserStore(state => state.fetchUser)
    const activities = useUserStore(state => state.activities)
    const columns = useColumns()
    const [openSuspendModal, setOpenSuspendModal] = useState(false)
    const isSuspened = user?.status === 'BLOCKED' || user?.status === 'SUSPENDED'
    const [viewFullHistory, setViewFullHistory] = useState(false)

    const allActivities = viewFullHistory ? activities : activities.slice(0, 4)


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
            label: 'Recent Assignment',
            value: user?.occupation ?? 'N/A'
        },
    ]
    const status = [
        {
            value: 'Active Agent',
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




    const activateUsers = useMutation({
        mutationFn: () => activateUser(user?.id ?? userId),
        onSuccess: (response) => {
            toast.success(response.message)
            fetchUser(user?.id ?? userId)
        }
    })

    const handleSuspend = () => {
        if (isSuspened) {
            activateUsers.mutate()
        } else {
            setOpenSuspendModal(true)
        }
    }

    return (
        <div>
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
                        <PageTitle mt={2} mb={2} fontSize={'18px'} title="System Activity Log" />
                        <Timeline.Root maxH={viewFullHistory ? '400px' : '300px'} showLastSeparator>
                            {activities.length === 0 && (
                                <Flex justify={'center'} align={'center'} h={'200px'}>
                                    <Text className="text-[16px] satoshi-medium">No activity found</Text>
                                </Flex>
                            )}
                            {allActivities.map((activity, index) => (
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
                        {activities.length > 4 && (
                            <MainButton onClick={() => setViewFullHistory(prev => !prev)} className="mt-4 bg-[#F8FAFC] text-blue-950 hover:text-white border-none" size="lg" variant='primary' >{viewFullHistory ? 'Show Less' : 'View Full'} History</MainButton>)}
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
                        <Button
                            variant="outline"
                            loading={activateUsers.isPending}
                            color={isSuspened ? '#2A3348' : '#DC2626'} _hover={{ color: 'white' }}
                            onClick={() => handleSuspend()}
                            className={`h-[38px] my-3 justify-between items-center rounded-full text-sm border ${isSuspened ? 'border-[#2A3348] hover:bg-[#2A3348]' : 'border-[#DC2626] hover:bg-[#DC2626]'} w-full px-3 py-5 satoshi-bold`}
                        >
                            <Flex align={"center"}>
                                {isSuspened ? "Activate User Account" : <><Icon as={LuBan} className="mr-2" size={'sm'} />{" "}Suspend User Account</>}
                            </Flex>
                            <Icon as={LuChevronRight} size={'sm'} />
                        </Button>
                    </SectionBox>
                    <Modal size={'sm'} open={openSuspendModal} onOpenChange={(e) => setOpenSuspendModal(e)} className="w-[400px]" modalContent={<SuspendPopUp userId={user?.id ?? userId} onClose={() => setOpenSuspendModal(false)} />} />

                </Box>
            </Flex>
            <SectionBox px={0} mt={6}>
                <div className="px-4 mb-2">
                    <PageTitle title="Portfolio History" fontSize={"16px"} />
                </div>
                <DataTable my={'0px'} data={user?.properties.asAgent ?? []} tableName="Property Portfolio" columns={columns} />

            </SectionBox>
        </div>
    )
}