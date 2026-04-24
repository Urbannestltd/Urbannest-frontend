import { Avatar } from "@/components/ui/avatar";
import { MainButton } from "@/components/ui/button";
import { CustomSwitch } from "@/components/ui/custom-fields";
import { PageTitle } from "@/components/ui/page-title";
import { SectionBox } from "@/components/ui/section-box";
import { adminPermissionFormData } from "@/schema/admin";
import { formatDate } from "@/services/date"
import { useUserStore } from "@/store/admin/user"
import { Box, Center, Circle, Flex, Grid, GridItem, HStack, Text, Timeline } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CgTrash } from "react-icons/cg";
import { useColumns } from "./landlord-columns";
import { useState } from "react";
import { set } from "lodash";


export const Admin = ({ userId }: { userId: string }) => {
    const user = useUserStore(state => state.user)
    const activities = useUserStore(state => state.activities)
    const columns = useColumns()
    const [viewFullHistory, setViewFullHistory] = useState(false)

    const allActivities = viewFullHistory ? activities : activities.slice(0, 4)

    const { control } = useForm<adminPermissionFormData>()

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
    ]
    const status = [

        {
            value: 'OCCUPIED',
            label: 'Occupied',
            bg: '#EBFFEE'
        },
        {
            value: 'Admin',
            label: 'Admin',
            bg: '#F5F5F5'
        }
    ]

    const statusDeets = status.find((status) => status.value === user?.status)


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
                        <Timeline.Root maxH={viewFullHistory ? '400px' : '300px'} overflowY={'scroll'} showLastSeparator>
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
                    <SectionBox p={4} w={'full'}>
                        <HStack w={'full'} justify={'space-between'}>
                            <Text
                                letterSpacing={"1.1px"}
                                mb={6}
                                className="satoshi-bold uppercase text-[#757575] text-[10px]"
                            >
                                permissions editor
                            </Text>
                            <Center bg={'#F5F5F5'} color={'#444444'} px={2} py={1} className="satoshi-medium" fontSize={'12px'} rounded={'full'}>
                                Unrestricted
                            </Center>
                        </HStack>
                        <Box>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Financials" fontSize={'14px'} subText="Allow access to view and manage all system financial records and reports." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='financials' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Properties" fontSize={'14px'} subText="Allow access to create and manage all properties and units." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='properties' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="User Management" fontSize={'14px'} subText="Allow access to manage users, roles, and permissions across the system." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='userManagement' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                            <HStack justify={'space-between'} mb={4} gap={2}>
                                <PageTitle title="Maintenance" fontSize={'14px'} subText="Allow access to view and manage all maintenance tickets." subFontSize={'14px'} spacing={0} />
                                <CustomSwitch name='maintenance' control={control} beforeColor="#E2E8F0" afterColor="#2A3348" />
                            </HStack>
                        </Box>
                    </SectionBox>
                </Box>
            </Flex>
        </div>
    )
}