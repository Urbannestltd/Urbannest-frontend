import { DummyVisitor, PropertyTicket } from "@/utils/model"
import { Box, Flex, HStack, Image, Skeleton, Span, Text } from "@chakra-ui/react"
import ElectricalIcon from '@/app/assets/icons/maintenance-icons/electrical.svg'
import PlumbingIcon from '@/app/assets/icons/maintenance-icons/plumbing.svg'
import SecurityIcon from '@/app/assets/icons/maintenance-icons/safety-security.svg'
import CleaningIcon from '@/app/assets/icons/maintenance-icons/cleaning.svg'
import HvacIcon from '@/app/assets/icons/maintenance-icons/hvc-ac.svg'
import BuildingIcon from '@/app/assets/icons/maintenance-icons/building.svg'
import { SectionBox } from "@/components/ui/section-box"
import { LuCalendar, LuMapPin } from "react-icons/lu"
import { formatDate, formatDateTime, formatDatetoTime } from "@/services/date"
import { EmptyDetails } from "@/components/ui/data-table"
import { DashboardTickets, DashboardVisitor } from "@/store/fm/dashboard"
import { format } from "path"

export const MobileTable = ({ data, loading, emptyDetails, tableName }: { data: DashboardTickets[], loading?: boolean, emptyDetails?: EmptyDetails, tableName?: string }) => {
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
            {data.map((item) => {
                const issues = Issue.find((issue) => issue.value === item.category)
                const priority = Priority.find((priority) => priority.value === item.priority)

                return <SectionBox mt={4}>
                    <HStack color={'#717C82'} justify={'space-between'} fontSize={'12px'}>
                        <HStack>
                            <Image src={issues?.icon.src} className="size-[14px] mr-[1px] " alt="" />
                            <Text className="capitalize" children={issues?.label} />
                        </HStack>
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

                    </HStack>
                    <Text className="satoshi-medium">{item.subject}</Text>
                    <Flex>
                        <HStack color={'#566166'} fontSize={'12px'} mr={4}>
                            <LuMapPin />
                            {item.propertyName}
                        </HStack>
                        <HStack color={'#566166'} fontSize={'12px'} mr={4}>
                            <LuCalendar />
                            {formatDate(item.createdAt)}
                        </HStack>

                    </Flex>

                </SectionBox>
            })}
        </Box>
    )
}

export const MobileTableVisitor = ({ data, loading, emptyDetails, tableName }: { data: DashboardVisitor[], loading?: boolean, emptyDetails?: EmptyDetails, tableName?: string }) => {
    const Type = [
        {
            value: 'request',
            label: 'Request',
            bgColor: '#FFFBEB',
            borderColor: '#EBFFEE',
            textColor: '#BF6A02'
        },
        {
            value: 'inspection',
            label: 'Inspection',
            bgColor: '#EBFFEE',
            borderColor: '#FFFBEB',
            textColor: '#14AE5C'
        },
        {
            value: 'regular',
            label: 'Regular',
            bgColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            textColor: '#4A4A4A'
        }
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
            {data.length > 0 && data.map((item) => {
                const type = Type.find((type) => type.value === item.type)
                return <SectionBox mt={4}>
                    <HStack justify={'space-between'} >
                        <Text className="satoshi-medium">{item.visitorName}</Text>
                        <Flex
                            alignItems={'center'}
                            fontSize={'12px'}
                            fontWeight={'semibold'}
                            bg={type?.bgColor}
                            border={'1px solid'}
                            borderColor={type?.borderColor}
                            p={1}
                            px={4}
                            rounded={'3xl'}
                            justify={'center'}
                            placeSelf={'center'}
                            w={'fit'}
                        >
                            <Text className="capitalize" color={type?.textColor} children={type?.label} />
                        </Flex>
                    </HStack>
                    <HStack mt={1} justify={'space-between'}>
                        <Text fontSize={'14px'} color={'#566166'}>{item.propertyName}</Text>
                        <Text className="satoshi-medium">{formatDatetoTime(item.checkedInAt)}</Text>
                    </HStack>
                </SectionBox>
            })}
        </Box>
    )
}