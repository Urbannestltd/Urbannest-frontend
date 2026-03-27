import { HStack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import rentImage from '@/app/assets/images/lease-image.png'
import { LeaseAgreement } from "@/utils/model"
import Link from "next/link"
import { leaseHistory } from "@/store/admin/tenant"
import { formatDate } from "@/services/date"

export const useLeaseHistoryColumns = (): ColumnDef<leaseHistory, any>[] => {
    return [
        {
            header: "Lease Reference",
            accessorKey: 'reference',
            cell: ({ row }) => <HStack>
                <Image src={rentImage} alt="profile" className="rounded-lg" width={74} height={47} />
                <Text>{row.original.reference}</Text>
            </HStack>
        },
        {
            accessorKey: 'startDate',
            header: "Start Date",
            cell: ({ row }) => <Text>{formatDate(row.original.startDate)}</Text>

        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ row }) => <Text>{formatDate(row.original.endDate)}</Text>
        },
        {
            accessorKey: 'leaseAgreement',
            header: 'Lease Agreement',
            cell: ({ row }) => <Link href={row.original.agreementUrl} className=" underline text-primary-gold">View Agreement</Link>
        }

    ]
}