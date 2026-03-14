'use client'
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { DashboardCard } from "@/components/ui/card";
import { SemiProgressCircle } from "@/components/ui/semi-progress-circle";
import { Box, Circle, Flex, HStack, Text } from "@chakra-ui/react";
import { CustomSelect } from "@/components/ui/custom-fields";
import { Demo } from "@/components/ui/barchart";
import { DataTable } from "@/components/ui/data-table";
import { propertiess } from "@/utils/data";
import { useColumns } from "./column";
import { PageTitle } from "@/components/ui/page-title";
import { SearchInput } from "@/components/ui/search-input";
import { MainButton } from "@/components/ui/button";
import { LuUserPlus } from "react-icons/lu";
import { ListCard } from "@/components/ui/list-card";
import USerImage from "@/app/assets/images/user-avatar.png";
import { useAdminDashboardStore } from "@/store/admin/dashboard";
import { useEffect } from "react";
import { formatNumber } from "@/services/date";
import { usePropertyStore } from "@/store/admin/properties";

export default function AdminDashboard() {
    const columns = useColumns()
    const router = useRouter()
    const fetchAdminDashboard = useAdminDashboardStore((state) => state.fetchDashboard)
    const fetchTenantStatus = useAdminDashboardStore((state) => state.fetchTenantStatus)
    const dashboard = useAdminDashboardStore((state) => state.dashboard)
    const tenants = useAdminDashboardStore((state) => state.tenants)
    const isLoading = useAdminDashboardStore((state) => state.isLoadingDashboard)
    const properties = usePropertyStore((state) => state.properties)
    const fetchProperties = usePropertyStore((state) => state.fetchProperties)

    useEffect(() => {
        fetchAdminDashboard()
        fetchTenantStatus()
        fetchProperties()
    }, [])

    const cardData = [
        {
            title: 'No of Properties',
            data: dashboard?.totalProperties ?? 0
        }, {
            title: 'No of Tenants',
            data: dashboard?.totalTenants ?? 0
        },
        {
            title: 'Defaulting Tenants',
            data: dashboard?.defaultingTenants ?? 0
        }
    ]


    return (
        <>
            <DashboardCard data={cardData} />
            <HStack gap={6} mt={6} h={'413px'} align={'start'}>
                <Flex direction={'column'} justify={'center'} p={6} bg={'white'} w={'60%'} h={'full'} rounded={'8px'} border={'1px solid #F4F4F4'}>
                    <Demo chartData={dashboard?.maintenanceChart ?? []} />
                </Flex>
                <Flex direction={'column'} justify={'center'} p={6} bg={'white'} w={'40%'} h={'full'} rounded={'8px'} border={'1px solid #F4F4F4'}>
                    <Text className="satoshi-medium text-[#5A5A5A]" mb={'20px'}>Expected Income</Text>
                    <Flex direction={'column'} justify={'center'}>
                        <Text className="satoshi-bold text-[30px] mb-0" textAlign={'center'}>30%</Text>
                        <Text textAlign={'center'} className="satoshi-medium mb-2 text-sm" color={'#5A5A5A'}>Collected</Text>
                    </Flex>
                    <Flex w={'full'} justify={'center'}>
                        <SemiProgressCircle expectedValue={dashboard?.revenue.expectedIncome} value={30} />
                    </Flex>
                    <HStack mb={1} mt={6} >
                        <Circle size={'6px'} bg={'#E7EEF5'} />
                        <Text className="satoshi-medium text-[#5A5A5A]">Expected Revenue in 2026</Text>
                    </HStack>
                    <HStack my={1}>
                        <Circle size={'6px'} bg={'#CFAA67'} />
                        <Text className="satoshi-medium text-[#5A5A5A]">Amount Collected - {formatNumber(dashboard?.revenue.amountCollected ?? 0)}</Text>
                    </HStack>
                </Flex>
            </HStack>
            <Box bg={'white'} my={8} p={6} rounded={'8px'} border={'1px solid #F4F4F4'}>
                <PageTitle title="All Properties" fontSize={'20px'} />
                <HStack my={2} justify={'space-between'}>
                    <SearchInput />
                    <MainButton icon={<LuUserPlus />} className="h-[35px]" size='sm'>Add Property</MainButton>
                </HStack>
                <DataTable data={properties} my={5} onRowClick={(row) => router.push(`/admin/dashboard/${row.id}`)} columns={columns} />
            </Box>
            <Box bg={'white'} my={8} p={3} rounded={'8px'} border={'1px solid #F4F4F4'}>
                <PageTitle title="Tenant Status" mb={4} fontSize={'20px'} />
                <ListCard cardData={tenants} />
            </Box>

        </>
    )
}

export function AdminSideBarSetup() {
    const pathname = usePathname();
    const isSetting = pathname.includes('settings');

    return (<> {isSetting ? null : <div className="relative hidden md:block w-[380px]">
        <AdminSidebar />
    </div>}</>)
}

