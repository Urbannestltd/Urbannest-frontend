import { Row } from "./unit-columns"
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useAdminTenantStore } from "@/store/admin/tenant"
import { useSearchParams } from "next/navigation"
import { GeneralInfoSection } from "@/components/sections/tenant/general-info"
import { CohabitantsSection, LeaseInfoSection } from "@/components/sections/tenant/lease-info"
import { LeaseHistorySection, PaymentHistorySection, VisitorHistorySection } from "@/components/sections/tenant/history"

export const Tenant = ({ tenant }: { tenant: Row }) => {
    const searchParams = useSearchParams()
    const tenantId = searchParams.get('tenantId')
    const tenants = useAdminTenantStore((state) => state.tenant)
    const fetchTenant = useAdminTenantStore((state) => state.fetchTenant)
    const isLoading = useAdminTenantStore((state) => state.isLoading)

    useEffect(() => {
        fetchTenant(tenantId ? tenantId : tenant.tenantId)
    }, [tenant?.id, tenantId])

    const status = [
        {
            value: 'AVAILABLE',
            label: 'Available',
            bg: '#FEE9E7'
        },
        {
            value: 'OCCUPIED',
            label: 'Occupied',
            bg: '#EBFFEE'
        }
    ]

    const statusDeets = status.find((status) => status.value === tenants?.status)

    if (!tenants && !isLoading) return <Flex h={'50vh'} justify={'center'} align={'center'}>
        <Text fontSize={'24px'} className="satoshi-bold">No Tenant Info Found</Text>
    </Flex>

    if (isLoading) {
        return <Skeleton h={'20vh'} />
    }

    return (
        tenants &&
        <Flex maxW={'full'} border={''} direction={{ base: 'column', md: 'row' }} gap={8}>
            <Box w={{ base: 'full', md: '70%' }}>
                <GeneralInfoSection tenants={tenants} statusDeets={statusDeets} />
                <LeaseInfoSection currentLease={tenants.currentLease} />
                <LeaseHistorySection leaseHistory={tenants.leaseHistory} />

            </Box>
            <Box w={{ base: 'full', md: "30%" }}>
                <CohabitantsSection cohabitants={tenants?.cohabitants} />
                <VisitorHistorySection visitorHistory={tenants?.visitorHistory} />
                <PaymentHistorySection paymentHistory={tenants?.paymentHistory} />
            </Box>
        </Flex>
    )
}
