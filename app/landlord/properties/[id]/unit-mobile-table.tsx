/* eslint-disable react/jsx-key */
import { EmptyDetails } from "@/components/ui/data-table"
import { Box, Center, Flex, HStack, Skeleton, Text } from "@chakra-ui/react"
import Image from "next/image"
import { Row } from "./unit-columns"
import { SectionBox } from "@/components/ui/section-box"
import { Progress } from "@/components/ui/progress-bar"
import { Divider } from "@/components/ui/divider"
import { Avatar } from "@/components/ui/avatar"
import { formatDate, formatNumber } from "@/services/date"

export const MobileTable = ({ data, loading, emptyDetails, onTenantClick, tableName }: { data: Row[], onTenantClick: (row: Row) => void, loading?: boolean, emptyDetails?: EmptyDetails, tableName?: string }) => {
    const status = [
        {
            value: 'OCCUPIED',
            label: 'Occupied',
            bg: '#EBFFEE',
            textColor: '#047857'
        },
        {

            value: 'AVAILABLE',
            label: 'Vacant',
            bg: '#FEE9E7',
            textColor: '#C2410C'
        }
    ]
    const complaints = (row: number) => {
        if (row >= 0 && row <= 29) { return '#14AE5C' }
        if (row >= 30 && row <= 59) { return '#E8B931' }
        if (row >= 69) { return '#EC221F' }
        return ''
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
    if (loading) return <Skeleton height={'100%'} width={'100%'} />
    return (
        <Box>
            {data.length === 0 && <div className='flex flex-col items-center justify-center my-16 space-y-6'>
                <div className='flex items-center justify-center'>
                    {emptyDetails?.icon ? <Image src={emptyDetails?.icon} alt="" /> : <Box rounded={'full'} className='bg-primary-gold' boxSize={'40px'} />}
                </div>

                <div className='flex flex-col items-center justify-center space-y-2'>
                    <h4 className='text-xl font-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
                    <p className='text-sm text-center font-medium text-[#6A6C88]'>
                        {emptyDetails?.description || `No ${tableName} found`}
                    </p>
                </div>
            </div>}
            {data.map((row, index) => {
                const statusDeets = status.find((status) => status.value === row.status)
                return (
                    <SectionBox my={6}>
                        <HStack align={'start'} justify={'space-between'}>
                            <Box>
                                <Text className="satoshi-bold" color={'#5A6061'} letterSpacing={'0.5px'} fontSize={'10px'}>Unit #</Text>
                                <Text className="satoshi-bold" fontSize={'14px'}>{row.unitName}</Text>
                            </Box>
                            <Center py={1} px={1.5} color={statusDeets?.textColor} fontSize={'12px'} className="satoshi-bold" rounded={'full'} bg={statusDeets?.bg}>{statusDeets?.label}</Center>
                        </HStack>
                        <Divider my={4} />
                        <HStack justify={'space-between'} align={'start'}>
                            <Box fontSize={'14px'}>
                                <Text className="satoshi-bold" >Rent</Text>
                                <Text className="satoshi-medium" fontSize={'15px'} color={'#5A5A5A'}>{formatNumber(row.baseRent)}</Text>
                            </Box>
                            <Box w={'40%'} onClick={() => onTenantClick(row)} fontSize={'14px'}>
                                <Text className="satoshi-bold" >Tenant</Text>
                                <Flex align={'center'} gap={2}>
                                    <Avatar name={row.tenantName} />
                                    <Text className="satoshi-medium">{row.tenantName ?? 'N/A'}</Text>
                                </Flex>
                            </Box>
                        </HStack>
                        {statusDeets?.value === 'OCCUPIED' && <> <Divider my={4} />
                            <HStack justify={'space-between'} align={'start'}>
                                <Box fontSize={'14px'}>
                                    <Text className="satoshi-bold" >Move In Date</Text>
                                    <Text className="satoshi-medium" color={'#5A5A5A'}>{formatDate(row.leaseStartDate)}</Text>
                                </Box>
                                <Box w={'40%'} fontSize={'14px'}>
                                    <Text mb={2} className="satoshi-bold" >Lease Left</Text>
                                    <Progress showValueText value={stringToNumber('0')} color={leaseExpiry(stringToNumber('0'))} info={'help'} />
                                </Box>
                            </HStack>
                            <Box mt={7}>
                                <HStack mb={2} justify={'space-between'} w={'full'}>
                                    <Text className="satoshi-medium text-sm">Complaints</Text>
                                    <Text className="satoshi-medium text-sm">
                                        {//row.complaints.openPercent
                                        }
                                    </Text>

                                </HStack>
                                {/*
                                <Progress
                                    valueText={`${row?.complaints.openPercent ?? 0}`}
                                    value={stringToNumber(
                                        String(row?.complaints.openPercent ?? "0"),
                                    )}
                                    color={complaints(row?.complaints.openPercent ?? 0)}
                                />*/}
                            </Box></>}

                    </SectionBox>
                )
            })}
        </Box>
    )
}