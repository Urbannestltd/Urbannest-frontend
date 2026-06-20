import { Modal } from "@/components/ui/dialog"
import { Box, Center, Flex, Grid, HStack, Stack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { IoEyeOutline } from "react-icons/io5"
import { LuBadgeCheck, LuBriefcaseBusiness, LuCheck, LuCircleCheck, LuClipboardCheck, LuDownload, LuEye, LuFileCheck2, LuFileText, LuIdCard, LuPaperclip, LuPhone, LuX } from "react-icons/lu"
import { TenantApprovalsModal } from "../dashboard/modal"
import { Approvals } from "@/store/landlord/approvals"
import { formatDate, formatNumber } from "@/services/date"
import Image from "next/image"
import UserAvatar from "@/app/assets/images/user-avatar.png"

export const TenantApprovalStatus: { label: string, value: string, color: string, bgColor: string }[] = [
    {
        label: 'Approved',
        value: 'APPROVED',
        color: '#047857',
        bgColor: '#ECFDF5'
    },
    {
        label: 'Rejected',
        value: 'REJECTED',
        color: '#B91C1C',
        bgColor: '#FEF2F2'
    },
    {
        label: 'Pending',
        value: 'PENDING',
        color: '#BF6A02',
        bgColor: '#FFFBEB'
    }

]



export const useColumns = (): ColumnDef<Approvals>[] => {
    return [
        {
            accessorKey: 'applicantName',
            header: "Applicant",
        },
        {
            accessorKey: '',
            header: "Property",
        },
        {
            accessorKey: 'unitName',
            header: "Unit",
        },
        {
            accessorKey: 'annualRent',
            header: "Annual Rent",
            cell: ({ row }) => <Text>{formatNumber(row.original.annualRent)}</Text>
        },
        {
            accessorKey: 'outcome',
            header: "Status",
            cell: ({ row }) => {
                const status = TenantApprovalStatus.find((status) => status.value === row.original.outcome)
                return (
                    <Flex
                        alignItems={'center'}
                        fontSize={'14px'}
                        bg={status?.bgColor ?? TenantApprovalStatus[2].bgColor}
                        p={1}
                        px={4}
                        rounded={'3xl'}
                        justify={'center'}
                        w={'fit'}
                    >
                        <Text className="capitalize" color={status?.color ?? TenantApprovalStatus[2].color}>
                            {status?.label ?? TenantApprovalStatus[2].label}
                        </Text>
                    </Flex>
                )
            },
        },
        {
            accessorKey: 'dateForwarded',
            header: "Date Sent",
            cell: ({ row }) => <Text>{formatDate(row.original.dateForwarded)}</Text>
        },
        {
            id: 'actions',
            header: "Actions",
            cell: ({ row }) => <ApprovalActions approval={row.original} />
        }
    ]
}

export const ApprovalActions = ({ approval }: { approval: Approvals }) => {
    const [openModal, setOpenModal] = useState(false)
    const [openDetails, setOpenDetails] = useState(false)
    const [type, setType] = useState<'accept' | 'decline'>('decline')

    const openDecisionModal = (decisionType: 'accept' | 'decline') => {
        setType(decisionType)
        setOpenDetails(false)
        setOpenModal(true)
    }

    return <>
        <Flex gap={2}>
            <IoEyeOutline
                color={'#566166'}
                size={20}
                cursor={"pointer"}
                onClick={() => setOpenDetails(true)}
            />
            <LuCheck
                color={"#047857"}
                size={20}
                cursor={"pointer"}
                onClick={() => { setOpenModal(true); setType('accept') }}
            />
            <LuX
                color="#B91C1C"
                size={20}
                cursor="pointer"
                onClick={() => { setOpenModal(true); setType('decline') }}
            />
        </Flex>
        <Modal
            size={'cover'}
            open={openDetails}
            onOpenChange={setOpenDetails}
            className="w-[94vw] max-w-[760px] max-h-[97vh] overflow-hidden rounded-none md:rounded-[2px]"
            modalContent={(
                <TenantApprovalDetailsModal
                    approval={approval}
                    onApprove={() => openDecisionModal('accept')}
                    onDeny={() => openDecisionModal('decline')}
                />
            )}
        />
        <Modal size={'xs'} open={openModal} onOpenChange={setOpenModal} modalContent={<TenantApprovalsModal type={type} id={approval.leadId ?? ''} onClose={() => setOpenModal(false)} />} />
    </>
}

const TenantApprovalDetailsModal = ({
    approval,
    onApprove,
    onDeny,
}: {
    approval: Approvals
    onApprove: () => void
    onDeny: () => void
}) => {
    const sentLabel = getSentLabel(approval.dateForwarded)
    const initials = approval.applicantName
        ?.split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    return (
        <Box bg="white" color="#2B3338" className="satoshi" maxH="97vh" overflow='scroll'>
            <Flex
                gap={{ base: 4, md: 7 }}
                align={{ base: "start", md: "center" }}
                p={{ base: 5, md: 10 }}
                pr={{ base: 12, md: 16 }}
                borderBottom="1px solid #EEF1F2"
            >
                <Box position="relative" flexShrink={0}>
                    <Box w={{ base: "76px", md: "96px" }} h={{ base: "76px", md: "96px" }} rounded="6px" overflow="hidden" bg="#E9EEF2">
                        <Image src={UserAvatar} alt={approval.applicantName || "Applicant"} className="h-full w-full object-cover" />
                    </Box>
                    <Center
                        position="absolute"
                        right="-9px"
                        bottom="-9px"
                        w="30px"
                        h="30px"
                        rounded="full"
                        bg="white"
                        shadow="0 2px 8px rgba(15, 23, 42, 0.16)"
                    >
                        <LuBadgeCheck size={23} color="#566166" fill="#566166" stroke="white" strokeWidth={2.4} />
                    </Center>
                </Box>
                <Box minW={0}>
                    <Text className="satoshi-bold capitalize" fontSize={{ base: "26px", md: "32px" }} lineHeight="1.1" color="#2E363B">
                        {approval.applicantName || initials || "Applicant"}
                    </Text>
                    <Flex mt={3} gap={3} align="center" wrap="wrap" color="#566166" fontSize={{ base: "16px", md: "19px" }}>
                        <Text px={3} py={1} rounded="2px" bg="#E9EDF1" className="satoshi-bold" color="#545F73" lineHeight="1">
                            FORWARDED
                        </Text>
                        <Text>• {sentLabel}</Text>
                    </Flex>
                </Box>
            </Flex>

            <Stack gap={{ base: 8, md: 11 }} p={{ base: 5, md: 10 }} maxH="calc(92vh - 224px)" overflowY="auto">
                <DetailsSection icon={<LuBriefcaseBusiness />} title="Professional Background">
                    <Grid
                        bg="#F1F5F7"
                        rounded="7px"
                        p={{ base: 5, md: 7 }}
                        gap={{ base: 6, md: 8 }}
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    >
                        <InfoBlock label="Current Occupation" value="Senior Software Architect" />
                        <InfoBlock label="Employer" value="Meridian Tech Group" />
                        <InfoBlock label="Annual Gross Income" value={formatNumber(approval.annualRent || 142000)} />
                        <InfoBlock label="Employment Duration" value="4 Years, 6 Months" />
                    </Grid>
                </DetailsSection>

                <DetailsSection icon={<LuIdCard />} title="Identity & Verification">
                    <Stack gap={4}>
                        <DocumentRow icon={<LuFileCheck2 />} name="Passport Copy.pdf" />
                        <DocumentRow icon={<LuFileCheck2 />} name="Driver's License.pdf" />
                    </Stack>
                </DetailsSection>

                <DetailsSection icon={<LuClipboardCheck />} title="Verified References">
                    <Box border="1px solid #E8ECEF" rounded="7px" p={{ base: 5, md: 6 }} bg="white">
                        <Flex justify="space-between" align="start" gap={4} wrap="wrap">
                            <Box>
                                <Text className="satoshi-bold" fontSize="19px" color="#2E363B">Robert Henderson</Text>
                                <Text mt={1} fontSize="18px" color="#566166">Previous Landlord (2021-2023)</Text>
                            </Box>
                            <HStack gap={1} color="#545F73" className="satoshi-bold" fontSize="18px">
                                <LuPhone size={17} />
                                <Text>+1 (555) 902-1284</Text>
                            </HStack>
                        </Flex>
                        <Text mt={4} color="#566166" textWrap={'wrap'} fontStyle="italic" fontSize={{ base: "17px", md: "19px" }} lineHeight="1.75">
                            &quot;Eleanor was an exceptional tenant. Reliable payment history and maintained the property to a very high standard.&quot;
                        </Text>
                    </Box>
                </DetailsSection>

                <DetailsSection icon={<LuPaperclip />} title="Supporting Documents">
                    <Stack gap={4}>
                        <DocumentRow icon={<LuFileText />} name="Proof of Employment.pdf" />
                        <DocumentRow icon={<LuFileText />} name="Reference Letter.docx" />
                    </Stack>
                </DetailsSection>
            </Stack>

            <Flex
                gap={{ base: 3, md: 7 }}
                p={{ base: 5, md: 10 }}
                bg="#F8FAFB"
                borderTop="1px solid #E8ECEF"
                direction={{ base: "column", md: "row" }}
            >
                <button
                    type="button"
                    onClick={onDeny}
                    className="h-[58px] flex-1 rounded-[7px] border border-[#E11D12] bg-white text-[#C00F0C] text-lg satoshi-bold"
                >
                    Deny Application
                </button>
                <button
                    type="button"
                    onClick={onApprove}
                    className="h-[58px] flex-1 rounded-[7px] bg-[#2A3348] text-white text-lg satoshi-bold shadow-[0_12px_24px_rgba(42,51,72,0.2)] inline-flex items-center justify-center gap-3"
                >
                    <LuCircleCheck size={24} fill="white" color="#2A3348" />
                    Approve Tenant
                </button>
            </Flex>
        </Box>
    )
}

const DetailsSection = ({ icon, title, children }: { icon: React.ReactElement, title: string, children: React.ReactNode }) => (
    <Box>
        <HStack gap={3} mb={5} color="#2B3338">
            <Box color="#C7D4EF" fontSize="25px">{icon}</Box>
            <Text fontSize={{ base: "19px", md: "22px" }} className="satoshi-medium">{title}</Text>
        </HStack>
        {children}
    </Box>
)

const InfoBlock = ({ label, value }: { label: string, value: string | number }) => (
    <Box>
        <Text className="satoshi-bold" fontSize="18px" color="#566166">{label}</Text>
        <Text mt={2} fontSize="19px" color="#2E363B">{value}</Text>
    </Box>
)

const DocumentRow = ({ icon, name }: { icon: React.ReactElement, name: string }) => (
    <Flex align="center" justify="space-between" bg="#F1F5F7" rounded="7px" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} gap={4}>
        <HStack gap={4} minW={0}>
            <Box color="#545F73" fontSize="25px" flexShrink={0}>{icon}</Box>
            <Text fontSize={{ base: "17px", md: "20px" }} color="#2E363B" truncate>{name}</Text>
        </HStack>
        <HStack gap={{ base: 3, md: 6 }} color="#566166" flexShrink={0}>
            <button type="button" aria-label={`View ${name}`}>
                <LuEye size={22} />
            </button>
            <button type="button" aria-label={`Download ${name}`}>
                <LuDownload size={22} />
            </button>
        </HStack>
    </Flex>
)

const getSentLabel = (dateForwarded?: string) => {
    if (!dateForwarded) return "Sent recently"

    const sentDate = new Date(dateForwarded)
    const now = new Date()
    const diffInMs = now.getTime() - sentDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (Number.isNaN(sentDate.getTime())) return "Sent recently"
    if (diffInDays <= 0) return "Sent today"
    if (diffInDays === 1) return "Sent 1 day ago"
    return `Sent ${diffInDays} days ago`
}
