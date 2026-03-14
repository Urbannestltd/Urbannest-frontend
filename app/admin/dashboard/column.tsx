import { Progress } from "@/components/ui/progress-bar"
import { formatDateRegular } from "@/services/date"
import { Property } from "@/store/admin/properties"
import { Properties } from "@/utils/model"
import { Center, HStack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { LuEllipsisVertical } from "react-icons/lu"
import rentImage from '@/app/assets/images/lease-image.png'

export const useColumns = (): ColumnDef<Property, any>[] => {
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
    return [
        {
            accessorKey: 'name',
            header: "Name",
            cell: ({ row }) => <HStack>
                <Image src={rentImage} alt="profile" className="rounded-lg" width={74} height={47} />
                <Text>{row.original.name}</Text>
            </HStack>
        },
        {
            accessorKey: 'landlord',
            header: "Owner Info",
        },
        {
            accessorFn: (row) => row.stats.occupancyRate,
            header: "Occupancy",
            cell: ({ row }) => {
                const occupance = occupancy(row.original.stats.occupancyRate)
                return (
                    <Center px={2} w={'50px'} rounded={'full'} bg={occupance}>
                        <Text>{row.original.stats.occupancyRate}</Text>
                    </Center>)
            }

        },
        {
            accessorKey: 'complaints',
            header: "Complaints",
            cell: ({ row }) => {
                const complaint = complaints(row.original.stats.totalComplaints)
                return (
                    <Progress showValueText value={row.original.stats.totalComplaints} color={complaint} info={complaint} />
                )
            }
        },
        {
            accessorKey: 'date',
            header: "Date Listed",
            cell: () => <Text>{formatDateRegular('12-03-26')}</Text>
        },
        {
            accessorKey: 'actions',
            header: "Actions",
            cell: () => <LuEllipsisVertical />
        }
    ]
}