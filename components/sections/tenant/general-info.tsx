/* eslint-disable react/jsx-key, react/no-children-prop */
import { SectionBox } from "@/components/ui/section-box"
import { Avatar } from "@/components/ui/avatar"
import { Box, Center, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import { PageTitle } from "@/components/ui/page-title"
import { formatDate } from "@/services/date"
interface generalInfoProps {
    fullName: string
    profilePic: string
    status: string
    email: string
    phone: string
    emergencyContact: string
    dateOfBirth: string
    occupation: string
    employer: string
}
interface statusDeetsProps {
    value: string
    label: string
    bg: string
}

export const GeneralInfoSection = ({ tenants, statusDeets }: { tenants: generalInfoProps, statusDeets: statusDeetsProps | undefined }) => {
    const generalInfo = [
        {
            label: 'Email Address',
            value: tenants?.email ?? 'N/A',
        },
        {
            label: 'Contact Number',
            value: tenants?.phone ?? 'N/A'
        },
        {
            label: 'Emergency Contact No',
            value: tenants?.emergencyContact ?? 'N/A'
        },
        {
            label: 'Date of Birth',
            value: formatDate(tenants?.dateOfBirth) ?? 'N/A'
        },
        {
            label: 'Occupation',
            value: tenants?.occupation ?? 'N/A'
        },
        {
            label: 'Current Employer',
            value: tenants?.employer ?? 'N/A'
        },
    ]
    return <SectionBox w={{ base: 'full' }}>
        <Flex align={'center'} gap={3}>
            <Box boxSize={'90px'}>
                <Avatar size='full' name={tenants?.fullName} src={tenants?.profilePic} />
            </Box>
            <Box>
                <Text className="text-[20px] satoshi-bold">{tenants?.fullName}</Text>
                <Center py={1} mt={1} color={'#02542D'} className="satoshi-medium text-[14px]" rounded={'full'} bg={statusDeets?.bg}>{statusDeets?.label}</Center>
            </Box>
        </Flex>
        <Box mt={10}>
            <PageTitle title="General Information" fontSize={'18px'} />
            <Grid gapX={20} mt={8} gapY={8} templateColumns={{ base: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }}>
                {generalInfo.map((info) =>
                    <GridItem key={info.label}>
                        <Text className="text-[14px] mb-1 satoshi-bold text-[#757575]">{info.label}</Text>
                        <Text className="text-[16px] satoshi-bold">{info.value}</Text>
                    </GridItem>
                )}
            </Grid>
        </Box>
    </SectionBox>;
};