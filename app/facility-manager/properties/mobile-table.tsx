import { SectionBox } from "@/components/ui/section-box"
import { Box, Center, Flex, HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import rentImage from '@/app/assets/images/lease-image.png'
import { da } from "zod/v4/locales"
import { LuEllipsisVertical } from "react-icons/lu"
import { Divider } from "@/components/ui/divider"
import { Progress } from "@/components/ui/progress-bar"
import { EmptyDetails } from "@/components/ui/data-table"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Properties } from "@/store/fm/properties"

export const MobileTable = ({ data, loading, emptyDetails, tableName }: { data: Properties[], loading?: boolean, emptyDetails?: EmptyDetails, tableName?: string }) => {
    const router = useRouter()
    const occupancy = (row: number | string) => {
        const value = typeof row === "string"
            ? parseFloat(row.replace("%", ""))
            : row

        if (isNaN(value)) return ''
        if (value >= 0 && value <= 49) return '#FEE9E7'
        if (value >= 50 && value <= 69) return '#FFFBEB'
        if (value >= 70) return '#EBFFEE'
        return ''
    }
    const complaints = (row: number) => {
        if (row >= 0 && row <= 29) { return '#14AE5C' }
        if (row >= 30 && row <= 59) { return '#E8B931' }
        if (row >= 69) { return '#EC221F' }
        return ''
    }
    const types = [
        { value: 'SINGLE_UNIT', label: 'Single Unit' },
        { value: 'MULTI_UNIT', label: 'Multi Unit' },
        { value: 'COMMERCIAL', label: 'Commercial' },
        { value: 'RESIDENTIAL', label: 'Residential' },
    ]

    if (loading) return <Skeleton height={'100%'} width={'100%'} />
    return (<> {data?.length === 0 && <div className='flex flex-col items-center justify-center my-20 space-y-6'>
        <div className='flex items-center justify-center'>
            {emptyDetails?.icon ? <Image src={emptyDetails?.icon} alt="" /> : <Box rounded={'full'} className='bg-primary-gold' boxSize={'40px'} />}
        </div>

        <div className='flex flex-col items-center justify-center space-y-2'>
            <h4 className='text-2xl satoshi-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
            <p className='text-[16px] px-8 text-center font-medium text-[#6A6C88]'>
                {emptyDetails?.description || `No ${tableName} found`}
            </p>
        </div>
    </div>}
        {data?.length > 0 && <SectionBox mt={4}>{
            data.map((item) => {
                const occupance = occupancy(item.occupancyRate)
                const complaint = complaints(item.complaints)


                return (
                    <Box w={'full'} border={'1px solid #A9B4B926'} cursor={'pointer'} onClick={() => router.push(`/facility-manager/properties/${item.id}`)} rounded={'4px'} overflow={'hidden'} my={4}>
                        <Flex justify={'end'} w={'full'} p={2} h={'138px'} bgImage={`url(${item.images[0] ?? rentImage.src})`} bgPos={'center'} bgRepeat={'no-repeat'} backgroundSize={'cover'}>
                            <HStack bg={'#FFFFFFE5'} h={'fit'} rounded={'2px'} px={2} py={1} border={'1px solid #A9B4B933'} w={'fit'}>
                                <Text className="satoshi-bold" fontSize={'12px'} letterSpacing={'0.55px'} color={'#545F73'} textTransform={'uppercase'}>
                                    {types.find((type) => type.value === item.type)?.label}
                                </Text>
                                <LuEllipsisVertical color="#545F73" />
                            </HStack>
                        </Flex>
                        <Box p={4}>
                            <Flex justify={'space-between'}>
                                <VStack align={'start'} gap={2}>
                                    <Text className="satoshi-bold" fontSize={'16px'} color={'#4A4A4A'}>{item.name}</Text>
                                    <Text className="satoshi-medium" fontSize={'14px'} color={'#566166'}>{item.address}</Text>
                                </VStack>
                                <VStack align={'start'} gap={2}>
                                    <Text className="satoshi-bold uppercase" fontSize={'12px'} color={'#566166'}>Units</Text>
                                    <Text className="satoshi-medium" fontSize={'16px'} color={'#757575'}>{item.unitCount}</Text>
                                </VStack>
                            </Flex>
                            <Divider my={2} />
                            <HStack justify={'space-between'}>
                                <VStack align={'start'} gap={2}>
                                    <Text className="satoshi-bold" fontSize={'12px'} color={'#4A4A4A'}>Complaints</Text>
                                    <div className="w-[109px]">
                                        <Progress showValueText value={item.complaints} color={complaint} info={item.complaints} />
                                    </div>

                                </VStack>
                                <VStack align={'start'} gap={2}>
                                    <Text className="satoshi-bold" fontSize={'12px'} color={'#4A4A4A'}>Occupancy</Text>
                                    <Center px={2} w={'50px'} fontSize={'12px'} rounded={'full'} bg={occupance}>
                                        <Text>{item.occupancyRate}%</Text>
                                    </Center>
                                </VStack>

                            </HStack>
                        </Box>

                    </Box>
                )

            })
        }</SectionBox>}</>)
}