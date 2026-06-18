import { PageTitle } from "@/components/ui/page-title"
import { Progress } from "@/components/ui/progress-bar"
import { SectionBox } from "@/components/ui/section-box"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { CgLoadbarSound } from "react-icons/cg"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type RevenueProperty = {
    id: string
    name: string
    totalAmount: string
    collectedAmount: string
    expectedRevenue: number
    collectedRevenue: number
    value: number
}

export const revenueProperties: RevenueProperty[] = [
    {
        id: '1',
        name: 'The Grandview',
        totalAmount: '₦42M',
        collectedAmount: '₦38M',
        expectedRevenue: 42000000,
        collectedRevenue: 38000000,
        value: 90,
    },
    {
        id: '2',
        name: 'Oakwood Lofts',
        totalAmount: '₦36M',
        collectedAmount: '₦28M',
        expectedRevenue: 36000000,
        collectedRevenue: 28000000,
        value: 78,
    },
    {
        id: '3',
        name: 'Skyline Tower',
        totalAmount: '₦54M',
        collectedAmount: '₦45M',
        expectedRevenue: 54000000,
        collectedRevenue: 45000000,
        value: 83,
    },
    {
        id: '4',
        name: 'Willow Creek',
        totalAmount: '₦30M',
        collectedAmount: '₦21M',
        expectedRevenue: 30000000,
        collectedRevenue: 21000000,
        value: 70,
    },
    {
        id: '5',
        name: 'Cedar Place',
        totalAmount: '₦24M',
        collectedAmount: '₦18M',
        expectedRevenue: 24000000,
        collectedRevenue: 18000000,
        value: 75,
    },
]

export const RevenueAnalytics = ({ selectedPropertyId = 'all' }: { selectedPropertyId?: string }) => {
    const visibleProperties = selectedPropertyId === 'all'
        ? revenueProperties
        : revenueProperties.filter((item) => item.id === selectedPropertyId)

    return <>      {selectedPropertyId === 'all' && <Box rounded={'9px'} p={0}>
        <Flex p={4} justify={'space-between'} roundedTop={'9px'} bg={'#F5F5F5'}>
            <Flex align={'center'} color={'#2A3348'} fontSize={'16px'} className="satoshi-bold"><CgLoadbarSound size={20} className="mr-1" />Revenue Analytics</Flex>
            <HStack fontSize={'14px'} ><Box boxSize={'15px'} ml={3} bg={'#2A334833'} />Expected
                <Box boxSize={'15px'} ml={3} bg={'#2A3348'} />Collected</HStack>
        </Flex>
        <SectionBox roundedTop={0} p={8} pt={0}>
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

const allData = {
    perProperty: [
        { label: "₦42M", value1: 1200, value2: 1100, value3: 1400 },
        { label: "₦42M", value1: 1800, value2: 1200, value3: 1500 },
        { label: "₦42M", value1: 1500, value2: 1400, value3: 1200 },
        { label: "₦42M", value1: 2100, value2: 1900, value3: 1700 },
    ],
    weekly: [
        { label: "Mon", value1: 40, value2: 30, value3: 50 },
        { label: "Tue", value1: 75, value2: 65, value3: 80 },
        { label: "Wed", value1: 55, value2: 45, value3: 60 },
        { label: "Thu", value1: 90, value2: 80, value3: 100 },
        { label: "Fri", value1: 60, value2: 50, value3: 70 },
    ],
    monthly: [
        { label: "Jan", value1: 200, value2: 180, value3: 220 },
        { label: "Feb", value1: 450, value2: 400, value3: 500 },
        { label: "Mar", value1: 300, value2: 250, value3: 320 },
        { label: "Apr", value1: 500, value2: 450, value3: 550 },
        { label: "May", value1: 350, value2: 300, value3: 400 },
    ],
    yearly: [
        { label: "2021", value1: 1200, value2: 1100, value3: 1300 },
        { label: "2022", value1: 1800, value2: 1700, value3: 1900 },
        { label: "2023", value1: 1500, value2: 1400, value3: 1600 },
        { label: "2024", value1: 2100, value2: 2000, value3: 2200 },
    ]
}

export const RevenuePropertyChart = ({ property }: { property: RevenueProperty }) => {
    return <Box rounded={'9px'} p={0}>
        <PageTitle title={property.name} fontSize={'22px'} spacing={0} subText="Efficiency metric by individual unit ID" />
        <ResponsiveContainer width="100%" className={'mt-6'} height={300}>
            <BarChart data={allData.perProperty} barSize={16}>
                <CartesianGrid
                    vertical={false}
                    horizontal={false}
                    strokeDasharray="0"
                    stroke="#E5E7EB"
                />
                <XAxis dataKey='label' axisLine={false} tickLine={false} />
                <Bar dataKey='value1' fill="#2A334833" radius={[0, 0, 0, 0]} />
                <Bar dataKey='value2' fill="#2A3348" radius={[0, 0, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        <HStack mt={'6'} justify={'center'} fontSize={'14px'} ><Box boxSize={'15px'} ml={3} bg={'#2A334833'} />Expected
            <Box boxSize={'15px'} ml={3} bg={'#2A3348'} />Collected</HStack>
    </Box>
}
