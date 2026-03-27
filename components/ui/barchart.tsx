"use client"
import { Box, Flex, HStack, Image, Skeleton, Text } from "@chakra-ui/react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import leaseImages from '@/app/assets/images/lease-image.png'
import { useState } from "react"


export const Demo = ({ chartData, loading }: { chartData: { month: string; count: number }[], loading: boolean }) => {
    const allData = {
        perProperty: [
            { label: "Property 1", value: 1200 },
            { label: "Property 2", value: 1800 },
            { label: "Property 3", value: 1500 },
            { label: "Property 4", value: 2100 },
        ],
        weekly: [
            { label: "Mon", value: 40 },
            { label: "Tue", value: 75 },
            { label: "Wed", value: 55 },
            { label: "Thu", value: 90 },
            { label: "Fri", value: 60 },
        ],
        monthly: [
            { label: "Jan", value: 200 },
            { label: "Feb", value: 450 },
            { label: "Mar", value: 300 },
            { label: "Apr", value: 500 },
            { label: "May", value: 350 },
        ],
        yearly: [
            { label: "2021", value: 1200 },
            { label: "2022", value: 1800 },
            { label: "2023", value: 1500 },
            { label: "2024", value: 2100 },
        ],
    }
    const [filter, setFilter] = useState<keyof typeof allData>('perProperty')

    // const data = chartData[filter]
    const maxValue = Math.max(...chartData.map((d) => d.count))



    return (
        <Box>
            <HStack justify={'space-between'}>
                <Text className="satoshi-medium text-[#5A5A5A]" mb={'40px'}>Maintenance Requests</Text>
                <select
                    value={'perProperty'}
                    //onChange={(e) => setFilter(e.target.value as keyof typeof )}
                    className="w-[150px] border border-[#D9D9D9] satoshi text-sm text-[#1E1E1E] rounded-lg p-1 mb-4"
                >
                    <option value='perProperty'>Per Property</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </HStack>
            {loading ? <Skeleton height={'300px'} /> : <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barSize={32}>
                    <CartesianGrid
                        vertical={false}
                        horizontal={false}

                        strokeDasharray="4 4"
                        stroke="#E5E7EB"
                    />
                    <XAxis dataKey='month' axisLine={false} tickLine={false} />

                    <YAxis
                        axisLine={false}
                        tickLine={false}

                        tickCount={5}
                        tickFormatter={(value) => `${value}`}
                    />

                    <Tooltip cursor={{ fill: "transparent" }} content={<CustomTooltip />} />
                    <Bar dataKey='count' radius={[10, 10, 0, 0]} label={<CustomLabel />}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}

                                fill={entry.count === maxValue ? "#CFAA67" : "#E5E7EB"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>}
        </Box>
    )
}

const CustomLabel = ({ x, y, width }: any) => {
    const imgSize = 50
    return (
        <foreignObject
            x={x + width / 2 - imgSize / 2}
            y={y - imgSize / 2 - 10}
            width={imgSize}
            height={imgSize / 2}

        >
            <img
                src={leaseImages.src}
                width={imgSize}
                height={imgSize}
                style={{ borderRadius: "2px", margin: '10px' }}
            />
        </foreignObject>
    )
}


const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
        <Box
            bg='#FDFAF3'
            border="1px solid #E5E7EB"
            borderRadius="8px"
            p={3}
            shadow="md"
            minW="140px"
            position={'relative'}
        >
            <Text position={'absolute'} top={-7}>{label}</Text>
            {payload.map((entry: any, index: number) => (
                <Flex
                    justify={'center'}
                    align={'center'}>
                    <Image src={leaseImages.src} width={'134.56px'} h={'65.24px'} rounded={'lg'} alt="lease" />
                    <Box ml={2}>
                        <Text className="satoshi-bold text-[18px]">The Wings Court</Text>
                        <Text fontSize={'14px'}>1234 Baker Street, San Francisco</Text>
                    </Box></Flex>

            ))}

        </Box>
    )
}