import { SectionBox } from "@/components/ui/section-box"
import { Box, Flex, HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import { MaintenanceChartItem } from "./page"
import { RectangleBar } from "../dashboard/chart"
import { formatCompactCurrency } from "@/services/date"

export const ChartMobile = ({ visibleProperties, loading }: { visibleProperties: MaintenanceChartItem[], loading: boolean }) => {
    return <SectionBox mt={8} p={{ base: 4, md: 8 }} rounded={'9px'}>
        <Flex
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            justify={'space-between'}
        >
            <Box>
                <Text color={'#2B3338'} fontSize={{ base: '20px', md: '26px' }} className="satoshi-bold">
                    Portfolio Maintenance Distribution
                </Text>
                <Text color={'#6C7278'} fontSize={{ base: '14px', md: '16px' }} mt={1}>
                    Comparative analysis of operational costs versus ticket volume per asset.
                </Text>
            </Box>
            <HStack color={'#2B3338'} fontSize={{ base: '12px', md: '14px' }} gap={6}>
                <HStack gap={2}>
                    <Box boxSize={'14px'} bg={'#2A3348'} rounded={'full'} />
                    <Text>Cost (₦ NGN)</Text>
                </HStack>
                <HStack gap={2}>
                    <Box boxSize={'14px'} bg={'#E9EAEC'} rounded={'full'} />
                    <Text>Volume (Tickets)</Text>
                </HStack>
            </HStack>
        </Flex>

        <Box borderTop={'1px solid #ECEFF1'} mt={{ base: 6, md: 10 }} pt={{ base: 4, md: 8 }}>
            {loading ? (
                <Skeleton h={{ base: '280px', md: '420px' }} w={'full'} />
            ) : visibleProperties.length === 0 ? (
                <Flex h={'280px'} align={'center'} justify={'center'}>
                    <Text color={'#6C7278'} className="satoshi-medium">No maintenance distribution data available</Text>
                </Flex>
            ) : (

                <SectionBox roundedTop={0} p={8} pt={0}>
                    {visibleProperties.length === 0 && (
                        <Text color={'#5A6061'} pt={8} textAlign={'center'} className="satoshi-medium">No revenue data available</Text>
                    )}
                    {visibleProperties.map((item) => (<Box my={8} key={item.propertyId}>
                        <HStack justify={'space-between'} my={1}>
                            <Text color={'#2A3348'} fontSize={'14px'} className="satoshi-bold">{item.propertyName}</Text>
                            <Text color={'#2A3348'} fontSize={'12px'} className="satoshi-bold">{formatCompactCurrency(item.totalCost)}</Text>
                        </HStack>
                        <Flex w={'full'} align={'end'}>
                            <div className="space-y-2 w-full mr-2">
                                <RectangleBar trackColor="white" value={item.ticketCount} />
                                <RectangleBar color="#2A33481A" trackColor="white" value={item.totalCost} />
                            </div>
                            <Text color={'#2A3348'} w={'20px'} fontSize={'12px'} className="satoshi-bold" >{item.ticketCount}</Text>
                        </Flex>
                    </Box>))}

                </SectionBox>
            )}
        </Box>
    </SectionBox>
}