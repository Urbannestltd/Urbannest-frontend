import { PageTitle } from "@/components/ui/page-title"
import { Progress } from "@/components/ui/progress-bar"
import { SectionBox } from "@/components/ui/section-box"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { CgLoadbarSound } from "react-icons/cg"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"

export type RevenueProperty = {
    id: string
    name: string
    totalAmount: string
    collectedAmount: string
    expectedRevenue: number
    collectedRevenue: number
    value: number
}

export const RevenueAnalytics = ({ data, selectedPropertyId = 'all' }: { data: RevenueProperty[]; selectedPropertyId?: string }) => {
    const visibleProperties = selectedPropertyId === 'all'
        ? data
        : data.filter((item) => item.id === selectedPropertyId)

    return <>      {selectedPropertyId === 'all' && <Box rounded={'9px'} p={0}>
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
        {selectedPropertyId !== 'all' && visibleProperties.map((item) => (
            <SectionBox key={item.id}>
                <RevenuePropertyChart property={item} />
            </SectionBox>
        ))}
    </>
}




const RectangleBar = ({ value }: { value: number }) => {
    return <Progress value={value} size={'xl'} color={'#2A3348'} shape={'square'} rounded={'none'} />
}

export const RevenuePropertyChart = ({ property }: { property: RevenueProperty }) => {
    const chartData = [
        {
            label: property.name,
            expected: property.expectedRevenue,
            collected: property.collectedRevenue,
        },
    ]

    return <Box rounded={'9px'} p={0}>
        <PageTitle title={property.name} fontSize={'22px'} spacing={0} subText="Expected and collected revenue" />
        <ResponsiveContainer width="100%" className={'mt-6'} height={300}>
            <BarChart data={chartData} barSize={32}>
                <CartesianGrid
                    vertical={false}
                    horizontal={false}
                    strokeDasharray="0"
                    stroke="#E5E7EB"
                />
                <XAxis dataKey='label' axisLine={false} tickLine={false} />
                <Bar dataKey='expected' fill="#2A334833" radius={[0, 0, 0, 0]} />
                <Bar dataKey='collected' fill="#2A3348" radius={[0, 0, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        <HStack mt={'6'} justify={'center'} fontSize={'14px'} ><Box boxSize={'15px'} ml={3} bg={'#2A334833'} />Expected
            <Box boxSize={'15px'} ml={3} bg={'#2A3348'} />Collected</HStack>
    </Box>
}
