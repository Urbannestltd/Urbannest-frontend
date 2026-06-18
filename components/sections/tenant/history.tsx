/* eslint-disable react/jsx-key, react/no-children-prop */
import { SectionBox } from "@/components/ui/section-box"
import { Box, Flex, HStack, Menu, Text } from "@chakra-ui/react"
import { PageTitle } from "@/components/ui/page-title"
import { DataTable } from "@/components/ui/data-table"
import { VistorData } from "@/utils/data"
import { LuEllipsisVertical } from "react-icons/lu"
import { Divider } from "@/components/ui/divider"
import { formatDate, formatNumber } from "@/services/date"
import { leaseHistory, paymentHistory, visitorHistory } from "@/store/admin/tenant"
import { Status, Type } from "@/utils/datas"
import { useLeaseHistoryColumns } from "@/app/admin/dashboard/[id]/tenant-columns"


export const VisitorHistorySection = ({ visitorHistory }: { visitorHistory: visitorHistory[] }) => {
    return <SectionBox mt={6}>
        <PageTitle title={'Visitor History'} fontSize={'16px'} />
        <HStack>
            {/*MaintenanceFilter.map((item) => (
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
                            ))*/}
        </HStack>
        <Box mt={6} maxH={'500px'} overflowY={'scroll'}>
            {
                visitorHistory?.length === 0 && <Text className="text-[14px] my-4 satoshi-medium text-center text-[#757575]">No visitors found</Text>}

            {visitorHistory?.map((row, index) => {
                const status = Status.find((status) => status.value === (row?.status ?? 'CHECKED_IN'))
                const frequency = Type.find((status) => status.value === (row?.frequency ?? 'GUEST'))

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
                        <Text className="satoshi-medium text-sm capitalize" >{frequency?.label}</Text>
                    </HStack>
                    {index !== VistorData.visitors.length - 1 && <Divider my={4} />}
                </Box>
            })}

        </Box>
    </SectionBox>
};

export const PaymentHistorySection = ({ paymentHistory }: { paymentHistory: paymentHistory[] }) => {
    return <SectionBox mt={6}>
        <PageTitle title="Payment History" fontSize={'16px'} />
        <Box mt={4} maxH={'500px'} overflowY={'scroll'}>
            {
                paymentHistory?.length === 0 && <Text className="text-[14px] my-4 satoshi-medium text-center text-[#757575]">No payments found</Text>}

            {paymentHistory?.map((item, index) => (
                <><Flex p={2} key={index}>
                    <Box>
                        <Text className="satoshi-bold capitalize">{item.type.toLocaleLowerCase()}</Text>
                        <Text fontSize={'12px'} mb={0.5} className="satoshi-bold" color={'#757575'} >{formatDate(item.date)}</Text>
                    </Box>
                    <Box className={`text-end ${item.status ? 'text-success-400' : 'text-error-400'}`} ml={'auto'}>
                        <Text className="satoshi-bold">{formatNumber(item.amount)}</Text>
                        <Text className=" capitalize" fontSize={'12px'}>{item.status.toLowerCase()}</Text>
                    </Box>
                </Flex>
                    {index !== paymentHistory.length - 1 && <Divider my={4} />}
                </>
            ))}
        </Box>
    </SectionBox>
};

export const LeaseHistorySection = ({ leaseHistory }: { leaseHistory: leaseHistory[] }) => {
    const columns = useLeaseHistoryColumns()
    return <SectionBox mt={6} w={{ base: 'full' }}>
        <PageTitle mt={2} fontSize={'18px'} title="Lease History" />
        <DataTable columns={columns} tableName="Lease History" my={0} data={leaseHistory ?? []} />
    </SectionBox>
}