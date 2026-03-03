import { Progress } from "@/components/ui/progress-bar"
import { formatDateRegular } from "@/services/date"
import { Properties } from "@/utils/model"
import { Center, HStack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { LuEllipsisVertical } from "react-icons/lu"

export const useColumns = (): ColumnDef<Properties, any>[] => {
    const occupancy = (row: number) => {
        if (row >= 0 && row <= 49) { return '#FEE9E7' }
        if (row >= 50 && row <= 69) { return '#FFFBEB' }
        if (row >= 70) { return '#EBFFEE' }
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
                <Image src={row.original.image} alt="profile" className="rounded-lg" width={74} height={47} />
                <Text>{row.original.name}</Text>
            </HStack>
        },
        {
            accessorKey: 'owner',
            header: "Owner Info",
        },
        {
            accessorKey: 'occupancy',
            header: "Occupancy",
            cell: ({ row }) => {
                const occupance = occupancy(row.original.occupancy)
                return (
                    <Center px={2} w={'50px'} rounded={'full'} bg={occupance}>
                        <Text>{row.original.occupancy}%</Text>
                    </Center>)
            }

        },
        {
            accessorKey: 'complaints',
            header: "Complaints",
            cell: ({ row }) => {
                const complaint = complaints(row.original.complaints)
                return (
                    <Progress showValueText value={row.original.complaints} color={complaint} info={complaint} />
                )
            }
        },
        {
            accessorKey: 'date',
            header: "Date Listed",
            cell: ({ row }) => <Text>{formatDateRegular(row.original.date)}</Text>
        },
        {
            accessorKey: 'actions',
            header: "Actions",
            cell: () => <LuEllipsisVertical />
        }
    ]
}