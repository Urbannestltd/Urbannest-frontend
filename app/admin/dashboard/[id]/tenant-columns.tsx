import { HStack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import rentImage from '@/app/assets/images/lease-image.png'
import { LeaseAgreement } from "@/utils/model"
import Link from "next/link"

export const useLeaseHistoryColumns = (): ColumnDef<LeaseAgreement, any>[] => {
    return [
        {
            header: "Lease Reference",
            accessorKey: 'name',
            cell: ({ row }) => <HStack>
                <Image src={rentImage} alt="profile" className="rounded-lg" width={74} height={47} />
                <Text>{row.original.name}</Text>
            </HStack>
        },
        {
            accessorKey: "startDate",
            header: "Start Date",

        },
        {
            accessorKey: "endDate",
            header: "End Date",
        },
        {
            accessorKey: 'leaseAgreement',
            header: 'Lease Agreement',
            cell: ({ row }) => <Link href={row.original.leaseAgreement} className=" underline text-primary-gold">View Agreement</Link>
        }

    ]
}