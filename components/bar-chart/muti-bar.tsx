"use client"
import { Box, HStack, Skeleton, Text } from "@chakra-ui/react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import leaseImages from '@/app/assets/images/lease-image.png'
import { useState } from "react"



export const MultiBar = ({ chartData, loading }: { chartData: { revenue: number; month: string }[], loading?: boolean }) => {
    const allData = {
        perProperty: [
            { label: "Property 1", value1: 1200, value2: 1100, value3: 1400 },
            { label: "Property 2", value1: 1800, value2: 1200, value3: 1500 },
            { label: "Property 3", value1: 1500, value2: 1400, value3: 1200 },
            { label: "Property 4", value1: 2100, value2: 1900, value3: 1700 },
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
    const [filter, setFilter] = useState<keyof typeof allData>('perProperty')

    const data = chartData


    return (
        <Box>
            <HStack justify={'space-between'}>
                <Text className="satoshi-medium text-[#5A5A5A]" mb={'40px'}>Rental Revenue</Text>
                <select
                    value={[filter]}
                    //onChange={(e) => setFilter(e.target.value as keyof typeof allData)}
                    className="w-[150px] border border-[#D9D9D9] satoshi text-sm text-[#1E1E1E] rounded-lg p-1 mb-4"
                >
                    <option value='perProperty'>Per Property</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </HStack>
            {loading ? <Skeleton height={'300px'} /> : <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barSize={16}>
                    <CartesianGrid
                        vertical={false}
                        horizontal={true}
                        strokeDasharray="0"
                        stroke="#E5E7EB"
                    />
                    <XAxis dataKey='month' axisLine={false} tickLine={false} />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickCount={5}
                        tickFormatter={(value) => `${value}`}
                    />

                    <Tooltip cursor={{ fill: "transparent" }} />

                    <Bar dataKey="revenue" fill="#A7C3DF" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" fill="#539EE9" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" fill="#142C43" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>}
        </Box>
    )
}

