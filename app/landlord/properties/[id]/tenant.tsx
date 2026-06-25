/* eslint-disable react/jsx-key, react/no-children-prop */
import { Row } from "./unit-columns"
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useLandlordTenantStore } from "@/store/landlord/tenant"
import { CohabitantsSection, LeaseInfoSection } from "@/components/sections/tenant/lease-info"
import { generalInfoProps, GeneralInfoSection } from "@/components/sections/tenant/general-info"
import { PaymentHistorySection, VisitorHistorySection } from "@/components/sections/tenant/history"
import { ContactSection } from "@/components/sections/overview/contacts"

export const Tenant = ({ tenant, propertyId }: { tenant: Row, propertyId: string }) => {
    const searchParams = useSearchParams()
    const tenantId = searchParams.get('tenantId')
    const tenants = useLandlordTenantStore((state) => state.tenant)
    const fetchTenant = useLandlordTenantStore((state) => state.fetchTenant)
    const isLoading = useLandlordTenantStore((state) => state.isLoading)

    useEffect(() => {
        fetchTenant(tenantId ? tenantId : tenant.tenantId,)
    }, [tenant?.tenantId, tenantId, propertyId])

    const tenantDeets: generalInfoProps = {
        fullName: tenants?.tenantName ?? 'N/A',
        profilePic: tenants?.profilePic ?? 'N/A',
        status: tenants?.status ?? 'N/A',
        email: tenants?.tenantEmail ?? 'N/A',
        phone: tenants?.tenantPhone ?? 'N/A',
        emergencyContact: 'N/A',
        dateOfBirth: 'N/A',
        occupation: 'N/A',
        employer: 'N/A'
    }

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

    const PropertyContacts = [
        {
            title: "Facility Manager",
            name: "N/A",
            email: "N/A",
            pfp: 'N/A',
        },
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
                <GeneralInfoSection tenants={tenantDeets} statusDeets={statusDeets} />
                <LeaseInfoSection currentLease={tenants?.currentLease} />
            </Box>
            <Box w={{ base: 'full', md: "30%" }}>
                <ContactSection data={PropertyContacts} />
            </Box>
        </Flex>
    )
}
