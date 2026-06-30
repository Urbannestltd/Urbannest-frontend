import { Modal } from "@/components/ui/dialog"
import { Box, Center, Flex, Grid, HStack, Stack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { IoEyeOutline } from "react-icons/io5"
import { LuBadgeCheck, LuBriefcaseBusiness, LuCheck, LuCircleCheck, LuClipboardCheck, LuDownload, LuEye, LuFileCheck2, LuFileText, LuIdCard, LuPaperclip, LuPhone, LuX } from "react-icons/lu"
import { TenantApprovalsModal } from "../dashboard/modal"
import { Approvals, useApprovalsStore } from "@/store/landlord/approvals"
import { formatDate, formatNumber } from "@/services/date"
import Image from "next/image"
import UserAvatar from "@/app/assets/images/user-avatar.png"
import { Drawers } from "@/components/ui/drawer"

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
    const [outcome, setOutcome] = useState<'accept' | 'decline' | null>(null)
    const [type, setType] = useState<'accept' | 'decline'>('decline')
    const { fetchPendingApprovals, fetchApprovalHistory } = useApprovalsStore((state) => state)

    const openDecisionModal = (decisionType: 'accept' | 'decline') => {
        setType(decisionType)
        setOpenDetails(false)
        setOpenModal(true)
    }

    const handleDecisionSuccess = (decisionType: 'accept' | 'decline') => {
        fetchPendingApprovals()
        fetchApprovalHistory()
        setOutcome(decisionType)
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
        <Drawers
            size={'full'}
            open={openDetails}
            placement={{ base: 'bottom', md: 'end' }}
            onOpenChange={setOpenDetails}
            className="w-[94vw] max-w-[560px] max-h-[100vh] overflow-hidden rounded-none md:rounded-[2px]"
            modalContent={(
                <TenantApprovalDetailsModal
                    approval={approval}
                    onApprove={() => openDecisionModal('accept')}
                    onDeny={() => openDecisionModal('decline')}
                />
            )}
        />
        <Modal
            size={'xs'}
            open={openModal}
            onOpenChange={setOpenModal}
            modalContent={(
                <TenantApprovalsModal
                    type={type}
                    id={approval.leadId ?? ''}
                    onClose={() => setOpenModal(false)}
                    onSuccess={handleDecisionSuccess}
                />
            )}
        />
        <Modal
            size={'cover'}
            open={outcome !== null}
            onOpenChange={(open) => !open && setOutcome(null)}
            className="w-[94vw] max-w-[1000px] h-[94vh] overflow-hidden rounded-none md:rounded-[2px]"
            modalContent={outcome ? (
                <TenantApprovalOutcomeModal
                    approval={approval}
                    outcome={outcome}
                    onClose={() => setOutcome(null)}
                />
            ) : null}
        />
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
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
    const initials = approval.applicantName
        ?.split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    return (
        <Box bg="white" color="#2B3338" className="satoshi" maxH="100vh" overflow='hidden'>
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
                    <Text className="satoshi-bold capitalize" fontSize={{ base: "20px", md: "24px" }} lineHeight="1.1" color="#2E363B">
                        {approval.applicantName || initials || "Applicant"}
                    </Text>
                    <Flex mt={3} gap={3} align="center" wrap="wrap" color="#566166" fontSize={{ base: "14px", md: "15px" }}>
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
                        <DocumentRow icon={<LuFileCheck2 />} name="Passport Copy.pdf" onView={() => setSelectedDocument("Passport Copy.pdf")} />
                        <DocumentRow icon={<LuFileCheck2 />} name="Driver's License.pdf" onView={() => setSelectedDocument("Driver's License.pdf")} />
                    </Stack>
                </DetailsSection>

                <DetailsSection icon={<LuClipboardCheck />} title="Verified References">
                    <Box border="1px solid #E8ECEF" rounded="7px" p={{ base: 5, md: 6 }} bg="white">
                        <Flex justify="space-between" align="start" gap={4} wrap="wrap">
                            <Box>
                                <Text className="satoshi-bold" fontSize="16px" color="#2E363B">Robert Henderson</Text>
                                <Text mt={1} fontSize="16px" color="#566166">Previous Landlord (2021-2023)</Text>
                            </Box>
                            <HStack gap={1} color="#545F73" className="satoshi-bold" fontSize="16px">
                                <LuPhone size={16} />
                                <Text>+1 (555) 902-1284</Text>
                            </HStack>
                        </Flex>
                        <Text mt={4} color="#566166" textWrap={'wrap'} fontStyle="italic" fontSize={{ base: "14px", md: "16px" }} lineHeight="1.75">
                            &quot;Eleanor was an exceptional tenant. Reliable payment history and maintained the property to a very high standard.&quot;
                        </Text>
                    </Box>
                </DetailsSection>

                <DetailsSection icon={<LuPaperclip />} title="Supporting Documents">
                    <Stack gap={4}>
                        <DocumentRow icon={<LuFileText />} name="Proof of Employment.pdf" onView={() => setSelectedDocument("Proof of Employment.pdf")} />
                        <DocumentRow icon={<LuFileText />} name="Reference Letter.docx" onView={() => setSelectedDocument("Reference Letter.docx")} />
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
                    className="h-[50px] flex-1 rounded-[7px] border border-[#E11D12] bg-white text-[#C00F0C] text-lg satoshi-bold"
                >
                    Deny Application
                </button>
                <button
                    type="button"
                    onClick={onApprove}
                    className="h-[50px] flex-1 rounded-[7px] bg-[#2A3348] text-white text-lg satoshi-bold shadow-[0_12px_24px_rgba(42,51,72,0.2)] inline-flex items-center justify-center gap-3"
                >
                    <LuCircleCheck size={20} fill="white" color="#2A3348" />
                    Approve Tenant
                </button>
            </Flex>
            {selectedDocument ? (
                <DocumentPreviewOverlay
                    title={selectedDocument}
                    applicantName={approval.applicantName}
                    onClose={() => setSelectedDocument(null)}
                />
            ) : null}
        </Box>
    )
}

const DetailsSection = ({ icon, title, children }: { icon: React.ReactElement, title: string, children: React.ReactNode }) => (
    <Box>
        <HStack gap={3} mb={5} color="#2B3338">
            <Box color="#C7D4EF" fontSize="18px">{icon}</Box>
            <Text fontSize={{ base: "14px", md: "16px" }} className="satoshi-medium">{title}</Text>
        </HStack>
        {children}
    </Box>
)

const InfoBlock = ({ label, value }: { label: string, value: string | number }) => (
    <Box>
        <Text className="satoshi-bold" fontSize="16px" color="#566166">{label}</Text>
        <Text mt={2} fontSize="16px" color="#2E363B">{value}</Text>
    </Box>
)

const DocumentRow = ({ icon, name, onView }: { icon: React.ReactElement, name: string, onView: () => void }) => (
    <Flex align="center" justify="space-between" bg="#F1F5F7" rounded="7px" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} gap={4}>
        <HStack gap={4} minW={0}>
            <Box color="#545F73" fontSize="20px" flexShrink={0}>{icon}</Box>
            <Text fontSize={{ base: "14px", md: "16px" }} color="#2E363B" truncate>{name}</Text>
        </HStack>
        <HStack gap={{ base: 3, md: 6 }} color="#566166" flexShrink={0}>
            <button type="button" aria-label={`View ${name}`} onClick={onView}>
                <LuEye size={18} />
            </button>
            <button type="button" aria-label={`Download ${name}`}>
                <LuDownload size={18} />
            </button>
        </HStack>
    </Flex>
)

const TenantApprovalOutcomeModal = ({
    approval,
    outcome,
    onClose,
}: {
    approval: Approvals
    outcome: 'accept' | 'decline'
    onClose: () => void
}) => {
    const sentLabel = getSentLabel(approval.dateForwarded)
    const propertyLabel = `${approval.propertyName || "The Glendale"}, ${approval.unitName || "Unit 402B"}`
    const approved = outcome === 'accept'

    return (
        <Box bg="#F8FAFC" color="#2B3338" className="satoshi" h="94vh" overflow="hidden">
            <ApprovalModalHeader approval={approval} sentLabel={sentLabel} />
            <Center h="calc(94vh - 174px)" px={{ base: 6, md: 12 }}>
                <Stack align="center" gap={0} w="full" maxW="720px" textAlign="center">
                    <Center
                        w="124px"
                        h="124px"
                        rounded="18px"
                        bg={approved ? "#DCFCE7" : "#FDE8E8"}
                        mb={14}
                    >
                        <Center w="78px" h="78px" rounded="full" bg={approved ? "#16A34A" : "#B04444"}>
                            {approved ? <LuCheck size={52} color="white" strokeWidth={4} /> : <LuX size={52} color="white" strokeWidth={4} />}
                        </Center>
                    </Center>
                    <Text className="satoshi-bold" fontSize={{ base: "24px", md: "28px" }} color="#2E363B">
                        {approved ? "Tenant Approved Successfully" : "Application Rejected"}
                    </Text>
                    <Text mt={7} color="#566166" fontSize={{ base: "21px", md: "26px" }} lineHeight="1.65">
                        {approved ? (
                            <>
                                {approval.applicantName || "Applicant"} has been approved for <Text as="span" className="satoshi-bold">{propertyLabel}</Text>. The forwarding agent has been notified and the lease agreement is being generated.
                            </>
                        ) : (
                            <>
                                {approval.applicantName || "Applicant"}&apos;s application for <Text as="span" className="satoshi-bold">{propertyLabel}</Text> has been rejected. The forwarding agent has been notified and the reason for rejection has been logged in the audit trail.
                            </>
                        )}
                    </Text>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-24 h-[74px] w-full max-w-[500px] rounded-[8px] bg-[#2A3348] text-white text-[24px] satoshi-bold shadow-[0_12px_24px_rgba(42,51,72,0.2)]"
                    >
                        Close &amp; Return to List
                    </button>
                </Stack>
            </Center>
        </Box>
    )
}

const ApprovalModalHeader = ({ approval, sentLabel }: { approval: Approvals, sentLabel: string }) => (
    <Flex
        gap={{ base: 4, md: 8 }}
        align={{ base: "start", md: "center" }}
        p={{ base: 6, md: 12 }}
        pr={{ base: 12, md: 16 }}
        borderBottom="1px solid #E8ECEF"
        bg="#F8FAFC"
    >
        <Box position="relative" flexShrink={0}>
            <Box w={{ base: "88px", md: "132px" }} h={{ base: "88px", md: "132px" }} rounded="10px" overflow="hidden" bg="#E9EEF2">
                <Image src={UserAvatar} alt={approval.applicantName || "Applicant"} className="h-full w-full object-cover" />
            </Box>
            <Center
                position="absolute"
                right="-10px"
                bottom="-10px"
                w="36px"
                h="36px"
                rounded="full"
                bg="white"
                shadow="0 2px 8px rgba(15, 23, 42, 0.16)"
            >
                <LuBadgeCheck size={27} color="#566166" fill="#566166" stroke="white" strokeWidth={2.4} />
            </Center>
        </Box>
        <Box minW={0}>
            <Text className="satoshi-bold capitalize" fontSize={{ base: "20px", md: "22px" }} lineHeight="1.1" color="#2E363B">
                {approval.applicantName || "Applicant"}
            </Text>
            <Flex mt={4} gap={4} align="center" wrap="wrap" color="#566166" fontSize={{ base: "16px", md: "20px" }}>
                <Text px={4} py={2} rounded="3px" bg="#E9EDF1" className="satoshi-bold" color="#545F73" lineHeight="1">
                    FORWARDED
                </Text>
                <Text>• {sentLabel}</Text>
            </Flex>
        </Box>
    </Flex>
)

const DocumentPreviewOverlay = ({
    title,
    applicantName,
    onClose,
}: {
    title: string
    applicantName?: string
    onClose: () => void
}) => (
    <Center
        position="fixed"
        inset={0}
        zIndex={1700}
        bg="rgba(15, 23, 42, 0.45)"
        p={{ base: 4, md: 10 }}
        onClick={onClose}
    >
        <Box onClick={(event) => event.stopPropagation()} maxW="720px" w="full">
            <Box bg="#F5F4E6" border="1px solid #D6D0B8" shadow="0 18px 42px rgba(15, 23, 42, 0.28)" p={{ base: 3, md: 5 }}>
                <Flex bg="#DCE8D4" border="1px solid #BFC7B2" minH={{ base: "270px", md: "390px" }} overflow="hidden">
                    <Box w="34%" bg="#EAF1DF" p={{ base: 3, md: 5 }} borderRight="1px solid #BFC7B2">
                        <Box bg="#1C1F24" color="white" className="satoshi-bold" fontSize={{ base: "10px", md: "13px" }} px={2} py={1}>
                            DRIVER LICENSE
                        </Box>
                        <Box mt={5} h={{ base: "120px", md: "190px" }} bg="#38424A" display="flex" alignItems="end" justifyContent="center">
                            <Image src={UserAvatar} alt={applicantName || "Applicant"} className="h-full w-full object-cover" />
                        </Box>
                        <Text mt={4} className="satoshi-bold" fontSize={{ base: "13px", md: "18px" }}>{applicantName || "Applicant"}</Text>
                    </Box>
                    <Box flex={1} p={{ base: 3, md: 5 }} position="relative">
                        <Text className="satoshi-bold" color="#264E73" fontSize={{ base: "15px", md: "25px" }}>
                            FEDERAL REPUBLIC OF NIGERIA
                        </Text>
                        <Text className="satoshi-bold" color="#264E73" fontSize={{ base: "12px", md: "18px" }}>
                            NATIONAL DRIVERS LICENCE
                        </Text>
                        <Box mt={5} bg="#0D5F91" color="white" px={3} py={1} className="satoshi-bold" fontSize={{ base: "12px", md: "18px" }}>
                            LMO AKW05888AAZ
                        </Box>
                        <Grid mt={5} templateColumns="repeat(2, 1fr)" gap={{ base: 2, md: 4 }} color="#263238">
                            <PreviewField label="DOB" value="06-11-1974" />
                            <PreviewField label="EXP" value="06-11-2030" />
                            <PreviewField label="SEX" value="M" />
                            <PreviewField label="CLASS" value="B" />
                            <PreviewField label="HT" value="1.75M" />
                            <PreviewField label="BG" value="A+" />
                        </Grid>
                        <Text position="absolute" right={{ base: 3, md: 5 }} bottom={{ base: 3, md: 5 }} color="#B88925" opacity={0.45} fontSize={{ base: "80px", md: "150px" }} lineHeight="1">
                            8
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <Text mt={4} textAlign="center" color="white" className="satoshi-bold">{title}</Text>
        </Box>
    </Center>
)

const PreviewField = ({ label, value }: { label: string, value: string }) => (
    <Box>
        <Text color="#6B7280" className="satoshi-bold" fontSize={{ base: "9px", md: "12px" }}>{label}</Text>
        <Text className="satoshi-bold" fontSize={{ base: "12px", md: "18px" }}>{value}</Text>
    </Box>
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
