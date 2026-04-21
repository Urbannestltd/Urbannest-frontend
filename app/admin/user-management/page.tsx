'use client'
import { CardData, DashboardCard } from "@/components/ui/card"
import { Card } from "@chakra-ui/react"
import { useColumns } from "./columns"
import { useUserStore } from "@/store/admin/user"
import { useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"

export default function Page() {
    const columns = useColumns()
    const users = useUserStore(state => state.users)
    const fetchUsers = useUserStore(state => state.fetchUsers)

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div>
            <DashboardCard data={cardData} />
            <DataTable data={users} columns={columns} tableName="Users" />
        </div>
    )

}

const cardData: CardData[] = [
    {
        title: 'Total Users',
        data: 12,
        percentage: '12% from last month'
    },
    {
        title: 'Active',
        data: 12,
        percentage: '12% from last month'
    },
    {
        title: 'Suspended',
        data: 12,
        percentage: '12% from last month'
    },
]