import { PageTitle } from "@/components/ui/page-title"
import { Progress } from "@/components/ui/progress-bar"
import { SectionBox } from "@/components/ui/section-box"
import { Box, Flex, Grid, HStack, Text } from "@chakra-ui/react"
import { CgLoadbarSound } from "react-icons/cg"
import { formatCompactCurrency, formatNumber } from "@/services/date"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export type RevenueProperty = {
    id: string
    name: string
    totalAmount: string
    collectedAmount: string
    expectedRevenue: number
    collectedRevenue: number
    value: number
}


export const RevenueAnalytics = ({ data, selectedProperty = { id: 'all', name: '' } }: { data: RevenueProperty[]; selectedProperty?: { id: string, name: string } }) => {
    const visibleProperties = data

    console.log(visibleProperties)

    return <>      {selectedProperty.id === 'all' && <Box rounded={'9px'} p={0}>
        <Flex p={4} justify={'space-between'} roundedTop={'9px'} bg={'#F5F5F5'}>
            <Flex align={'center'} color={'#2A3348'} fontSize={'16px'} className="satoshi-bold"><CgLoadbarSound size={20} className="mr-1" />Revenue Analytics</Flex>
            <HStack fontSize={'14px'} ><Box boxSize={'15px'} ml={3} bg={'#2A334833'} />Expected
                <Box boxSize={'15px'} ml={3} bg={'#2A3348'} />Collected</HStack>
        </Flex>
        <SectionBox roundedTop={0} p={8} pt={0}>
            {visibleProperties.length === 0 && (
                <Text color={'#5A6061'} pt={8} textAlign={'center'} className="satoshi-medium">No revenue data available</Text>
            )}
            {visibleProperties.map((item) => (<Box my={8} key={item.id}>
                <HStack justify={'space-between'} my={1}>
                    <Text color={'#2A3348'} fontSize={'14px'} className="satoshi-bold">{item.name}</Text>
                    <Text color={'#5A6061'} fontSize={'12px'} className="satoshi-bold">{item.collectedAmount} / {item.totalAmount}</Text>
                </HStack>
                <RectangleBar value={item.value} />
            </Box>))}

        </SectionBox></Box>}
        {selectedProperty.id !== 'all' &&
            <SectionBox>
                <RevenuePropertyChart name={selectedProperty.name} property={visibleProperties} />
            </SectionBox>
        }

    </>
}




export const RectangleBar = ({ value, color, trackColor }: { value: number, color?: string, trackColor?: string }) => {
    return <Progress value={value} size={'xl'} color={color ?? '#2A3348'} bg={trackColor} shape={'square'} rounded={'none'} />
}

export const RevenuePropertyChart = ({ property, name }: { property: RevenueProperty[], name: string }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 500
    const chartData = property.map((property) => ({
        label: property.name,
        expected: property.expectedRevenue,
        collected: property.collectedRevenue,
        total: property.totalAmount
    }))
    console.log(chartData)
    const maxValue = Math.max(...chartData.flatMap((item) => [item.expected, item.collected]), 1)

    return <Box rounded={'9px'} p={0}>
        <PageTitle title={name} fontSize={'22px'} spacing={0} subText="Efficiency metric by individual unit ID" />
        {chartData.length === 0 ? (
            <Text color={'#5A6061'} pt={8} textAlign={'center'} className="satoshi-medium">No revenue data available</Text>
        ) : (
            <Box mt={8} px={{ base: 4, md: 6 }} pt={10} pb={2} overflowX="auto">
                <ResponsiveContainer width="100%" height={300} >
                    {!isMobile ? <BarChart responsive margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }} data={chartData} barSize={20}>
                        <CartesianGrid
                            vertical={false}
                            horizontal={false}
                            strokeDasharray="0"
                            stroke="#E5E7EB"
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} content={<RevenueTooltip />} />
                        <YAxis tickLine={false} axisLine={false} />
                        <XAxis dataKey='label' axisLine={false} tickLine={false} />
                        <Bar minPointSize={3} dataKey='expected' fill="#2A334833" radius={[0, 0, 0, 0]} />
                        <Bar minPointSize={3} dataKey='collected' fill="#2A3348" radius={[0, 0, 0, 0]} />
                    </BarChart> :
                        <Grid
                            minW={`${Math.max(chartData.length, 4) * 96}px`}
                            h={{ base: "300px", md: "360px" }}
                            alignItems="end"
                            gap={{ base: 7, md: 10 }}
                            templateColumns={`repeat(${chartData.length}, minmax(20px, 1fr))`}
                        >
                            {chartData.map((item, index) => (
                                <RevenueUnitBar key={`${item.label}-${index}`} item={item} maxValue={maxValue} />
                            ))}
                        </Grid>}
                </ResponsiveContainer>
            </Box>
        )}
        <HStack mt={'6'} justify={'center'} fontSize={'14px'} ><Box boxSize={'15px'} ml={3} bg={'#2A334833'} />Expected
            <Box boxSize={'15px'} ml={3} bg={'#2A3348'} />Collected</HStack>
    </Box>
}

const RevenueUnitBar = ({ item, maxValue }: { item: { label: string; expected: number; collected: number }, maxValue: number }) => {
    const expectedHeight = getBarHeight(item.expected, maxValue)
    const collectedHeight = getBarHeight(item.collected, maxValue)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 500

    return (
        <Flex direction="column" align="center" justify="end" h="full" minW={0}>
            <Box flex={1} w="full" position="relative" display="flex" alignItems="end" justifyContent="center">{
                isMobile ? <> <Text
                    position="absolute"
                    bottom={`calc(${expectedHeight}% + 8px)`}
                    color="#5A6061"
                    fontSize={{ base: "12px", md: "14px" }}
                    className="satoshi-bold"
                    whiteSpace="nowrap"
                >
                    {formatCompactCurrency(item.expected)}
                </Text>
                    <Box
                        position="relative"
                        w={{ base: "30px", md: "42px" }}
                        h={`${expectedHeight}%`}
                        minH="20px"
                        bg="#E9EAEC"
                        display="flex"
                        roundedTop="6px"
                        alignItems="end"
                        justifyContent="center"
                    >
                        <Box
                            position="absolute"
                            bottom={0}
                            w="100%"
                            h={`${collectedHeight}%`}
                            minH="10px"
                            bg="#2A3348"
                            roundedTop="6px"
                            display="flex"
                            alignItems="start"
                            justifyContent="center"
                            pt={4}
                        >
                            <Text color="white" fontSize={{ base: "15px", md: "18px" }} className="satoshi-bold" whiteSpace="nowrap">
                                {formatCompactCurrency(item.collected)}
                            </Text>
                        </Box>
                    </Box></> :
                    <>
                        <Box
                            position="relative"
                            w={{ base: "30px", md: "22px" }}
                            h={`${expectedHeight}%`}
                            minH="5px"
                            bg="#E9EAEC"
                            display="flex"
                            alignItems="end"
                            mx={0.5}
                            justifyContent="center"
                        >
                        </Box>
                        <Box
                            position="relative"
                            w={{ base: "30px", md: "22px" }}
                            h={`${collectedHeight}%`}
                            minH="5px"
                            bg="#2A3348"
                            display="flex"
                            alignItems="end"
                            mx={0.5}
                            justifyContent="center"
                        >
                        </Box>
                    </>
            }  </Box>
            <Text mt={4} color="#5A6061" fontSize={{ base: "12px", md: "14px" }} lineHeight="1" className="satoshi-bold" whiteSpace="nowrap">
                {item.label}
            </Text>
        </Flex>
    )
}

const getBarHeight = (value: number | null | undefined, maxValue: number) => {
    if (!value || value <= 0) return 6
    return Math.max((value / maxValue) * 86, 6)
}



type RevenueItem = RevenueProperty


type RevenueTooltipProps = {
    active?: boolean
    payload?: {
        payload?: RevenueItem
    }[]
    label?: string
}

const RevenueTooltip = ({ active, payload, label }: RevenueTooltipProps) => {
    if (!active || !payload?.length) return null

    const item = payload[0]?.payload
    if (!item) return null

    return (
        <Box bg={'white'} border={'1px solid #ECEFF1'} rounded={'8px'} p={3} shadow={'md'}>
            <Text color={'#2B3338'} fontSize={'14px'} className="satoshi-bold">{label}</Text>
            <Text color={'#5A6061'} fontSize={'13px'} mt={1}>Expected: {formatNumber(item.expectedRevenue)}</Text>
            <Text color={'#5A6061'} fontSize={'13px'}>Collected: {formatNumber(item.collectedAmount)} </Text>
        </Box>
    )
}
