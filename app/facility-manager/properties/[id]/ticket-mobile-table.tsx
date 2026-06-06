import { EmptyDetails } from "@/components/ui/data-table"
import { Box, Circle, Flex, HStack, Image, Skeleton, Text } from "@chakra-ui/react"
import ElectricalIcon from '@/app/assets/icons/maintenance-icons/electrical.svg'
import PlumbingIcon from '@/app/assets/icons/maintenance-icons/plumbing.svg'
import SecurityIcon from '@/app/assets/icons/maintenance-icons/safety-security.svg'
import CleaningIcon from '@/app/assets/icons/maintenance-icons/cleaning.svg'
import HvacIcon from '@/app/assets/icons/maintenance-icons/hvc-ac.svg'
import BuildingIcon from '@/app/assets/icons/maintenance-icons/building.svg'
import { SectionBox } from "@/components/ui/section-box"
import { LuEllipsisVertical } from "react-icons/lu"
import { convertMinutes, formatDate } from "@/services/date"
import { Tickets } from "@/store/fm/ticket"
import { useRouter } from "next/navigation"
export const MobileTable = ({ data, loading, emptyDetails, tableName, onRowClick }: { data: Tickets[], loading?: boolean, emptyDetails?: EmptyDetails, onRowClick?: (row: Tickets) => void, tableName?: string }) => {
    const router = useRouter()
    const Status = [
        {
            value: 'PENDING',
            label: 'Open',
            bgColor: '#F5F5F5',
            textColor: '#4A4A4A',
            borderColor: '#F4F4F4',
            circleColor: '#4A4A4A'
        },
        {
            value: 'IN_PROGRESS',
            label: 'In Progress',
            bgColor: '#EFF6FF',
            textColor: '#1D4ED8',
            borderColor: '#DBEAFE',
            circleColor: '#3B82F6'
        },
        {
            value: 'RESOLVED',
            label: 'Resolved',
            bgColor: '#ECFDF5',
            textColor: '#047857',
            borderColor: '#D1FAE5',
            circleColor: '#10B981'
        },
        {
            value: 'ESCALATED',
            label: 'Escalated',
            bgColor: '#FEE2E2',
            textColor: '#991B1B',
            borderColor: '#FECACA',
            circleColor: '#DC2626'
        }
    ]

    const Issue = [
        { value: 'ELECTRICAL', label: 'Electrical', icon: ElectricalIcon },
        { value: 'PLUMBING', label: 'Plumbing', icon: PlumbingIcon },
        { value: 'SECURITY', label: 'Security', icon: SecurityIcon },
        { value: 'CLEANING', label: 'Cleaning', icon: CleaningIcon },
        { value: 'HVAC', label: 'HVC/AC', icon: HvacIcon },
        { value: 'BUILDING', label: 'Building (Walls, Doors, Windows, Ceiling)', icon: BuildingIcon },
        { value: 'SAFETY', label: 'Safety & Security', icon: SecurityIcon },
    ]

    const Priority = [
        { value: 'LOW', label: 'Low', bg: '#F5F5F5', textColor: '#4A4A4A', borderColor: '#F4F4F4' },
        { value: 'MEDIUM', label: 'Medium', bg: '#FFF7ED', textColor: '#975102', borderColor: '#FFEDD5' },
        { value: 'HIGH', label: 'High', bg: '#FEF2F2', textColor: '#B91C1C', borderColor: '#FEE2E2' },
    ]

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
                const issue = Issue.find((issue) => issue.value === row.category)
                const status = Status.find((status) => status.value === row.status)
                const priority = Priority.find((priority) => priority.value === row.priority)

                return (
                    <SectionBox key={index} onClick={() => onRowClick?.(row)} my={'26px'}>
                        <HStack justify={'space-between'} align={'start'}>
                            <Box>
                                <Text className="satoshi-bold text-sm">{row.propertyName}</Text>
                                <Text textTransform={'uppercase'} fontSize={'12px'}>{row.unitName}</Text>
                            </Box>
                            <LuEllipsisVertical />
                        </HStack>
                        <Box mt={'12px'}>
                            <Text className="satoshi-bold ">{row.subject}</Text>
                            <HStack>
                                <Image src={issue?.icon.src} className="size-[12px] mr-[1px] " alt="" />
                                <Text className="capitalize" fontSize={'13px'} children={issue?.label} />
                            </HStack>
                        </Box>
                        <Flex mt={'12px'} justify={'space-between'} align={'center'}>
                            <Flex
                                alignItems={'center'}
                                fontSize={'14px'}
                                fontWeight={'semibold'}
                                p={1}
                                px={0}
                                rounded={'3xl'}
                                justify={'center'}
                                w={'fit'}
                            >
                                <Circle size={'8px'} bg={status?.textColor} mr={1} />
                                <Text className="capitalize" color={status?.circleColor} children={status?.label} />
                            </Flex>
                            <Flex
                                alignItems={'center'}
                                fontSize={'14px'}
                                fontWeight={'semibold'}
                                bg={priority?.bg}
                                border={'1px solid'}
                                borderColor={priority?.borderColor}
                                p={1}
                                px={4}
                                rounded={'3xl'}
                                justify={'center'}
                                placeSelf={'center'}
                                w={'fit'}
                            >
                                <Text className="capitalize" color={priority?.textColor} children={priority?.label} />
                            </Flex>
                        </Flex>
                        <HStack bg={'#F9FAFB'} p={2} rounded={'6px'} mt={'12px'} justify={'space-between'}>
                            <Text fontSize={'xs'}>{formatDate(row.dateSubmitted)}</Text>
                            <Text fontSize={'xs'} color={row.isFixLate ? '#DC2626' : '#303030'}>{/*convertMinutes(row.responseTimeMinutes)*/'-'}</Text>
                        </HStack>


                    </SectionBox>)
            })}
        </Box>
    )
}