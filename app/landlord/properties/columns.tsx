/* eslint-disable @typescript-eslint/no-explicit-any */
import { Progress } from "@/components/ui/progress-bar"
import { formatDate, formatDateRegular } from "@/services/date"
import { Center, HStack, Image, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { LuEllipsisVertical } from "react-icons/lu"
import rentImage from '@/app/assets/images/lease-image.png'
import { Properties } from "@/store/landlord/properties"

export const useColumns = (): ColumnDef<Properties, any>[] => {
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
        //  {value: 'SINGLE_UNIT', label: 'Single Unit'},
        //  {value: 'MULTI_UNIT', label: 'Multi Unit'},
        { value: 'COMMERCIAL', label: 'Commercial' },
        { value: 'RESIDENTIAL', label: 'Residential' },
    ]
    return [
        {
            accessorKey: 'name',
            header: "Name",
            cell: ({ row }) => <HStack>
                <Image src={row.original.images?.[0] ?? rentImage.src} alt="profile" className="rounded-lg" width={74} height={47} />
                <Text>{row.original.name}</Text>
            </HStack>
        },
        {
            accessorFn: (row) => row.address,
            header: "Address",
        },
        {
            accessorFn: (row) => row.type,
            header: "Type",
            cell: ({ row }) => {
                const type = types.find((item) => item.value === row.original.type)
                return <Text textTransform={'capitalize'}>{type?.label}</Text>
            }
        },
        {
            accessorKey: 'totalUnits',
            header: "Units",
            cell: ({ row }) => <Text>{row.original.totalUnits}</Text>
        },
        {
            accessorFn: (row) => row.occupancyRate,
            header: "Occupancy",
            cell: ({ row }) => {
                const occupance = occupancy(row.original.occupancyRate)
                return (
                    <Center px={2} w={'50px'} rounded={'full'} bg={occupance}>
                        <Text>{row.original.occupancyRate}%</Text>
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
            accessorKey: 'actions',
            header: "Actions",
            cell: () => <LuEllipsisVertical />
        }
    ]
}