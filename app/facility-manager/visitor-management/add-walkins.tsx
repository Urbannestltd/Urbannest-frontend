'use client'
import { addVisitorFormData } from "@/schema"
import { Box, Center, createListCollection, Flex, HStack, IconButton, Spinner, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { MainButton } from "@/components/ui/button"
import addVisitorIcon from '@/app/assets/icons/add-user-icon.svg'
import Image from "next/image"
import toast from "react-hot-toast"
import { useEffect, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { formatDate, formatDateToIso, formatDatetoTime } from "@/services/date"
import dayjs from "dayjs"
import { AxiosError } from "axios"
import { AddWalkinFormData } from "@/schema/fm"
import { AddWalkIn, AddWalkInPayload, CheckInVisitor, getRepeatWalkinVisitorResponse, GetVisitorByCode, GetVisitorByCodeResponse, Profile, RepeatVisitor } from "@/services/fm/visitor"
import { WalkIn } from "@/store/fm/visitor"
import { usePropertyStore } from "@/store/fm/properties"
import { TiSortNumerically } from "react-icons/ti";
import { CiLogin } from "react-icons/ci"
import { SectionFlex } from "@/components/ui/section-box"
import { Avatar } from "@/components/ui/avatar"
import { LuLogIn } from "react-icons/lu"
import { MdOutlineLockReset } from "react-icons/md"


export const AddWalkins = ({ search, onClose }: { search?: string, onClose: () => void }) => {
    const { control, reset, watch, handleSubmit, setValue, formState } = useForm<AddWalkinFormData>()
    const { properties, units, fetchProperties, fetchUnits } = usePropertyStore((state) => state)
    const selectedValue = watch('property')
    const visitorNameValue = watch('visitorName')

    const [suggestions, setSuggestions] = useState<getRepeatWalkinVisitorResponse[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const suggestionRef = useRef<HTMLDivElement>(null)

    const walkinmututation = useMutation({
        mutationFn: (search: string) => RepeatVisitor(search),
        onSuccess: (response) => {
            // Handle both array and single object responses
            const results = Array.isArray(response) ? response : [response]
            if (results.length > 0) {
                setSuggestions(results)
                setShowSuggestions(true)
            } else {
                setShowSuggestions(false)
            }
        },
        onError: () => {
            setSuggestions([])
            setShowSuggestions(false)
        }
    })

    useEffect(() => {
        fetchProperties()
        reset({
            accessType: ['ONE_OFF'],
        })
        if (search) {
            setValue('visitorName', search)
        }

    }, [])

    useEffect(() => {
        if (!selectedValue) return
        fetchUnits(selectedValue[0])
    }, [selectedValue])

    // Debounce the name input before firing the search
    useEffect(() => {
        if (!visitorNameValue || visitorNameValue.length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        const timer = setTimeout(() => {
            setSearchTerm(visitorNameValue)
        }, 400)

        return () => clearTimeout(timer)
    }, [visitorNameValue])

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])



    // Fire search when debounced term changes
    useEffect(() => {
        if (!searchTerm) return
        walkinmututation.mutate(searchTerm)
    }, [searchTerm])

    const handleSelectSuggestion = (visitor: getRepeatWalkinVisitorResponse) => {
        setValue('visitorName', visitor.visitorName)
        setValue('visitorPhone', visitor.visitorPhone)
        setValue('visitorType', [visitor.visitorType])
        setValue('unit', [visitor.lastUnitId])
        setShowSuggestions(false)
        setSuggestions([])
    }

    const props = createListCollection({
        items: properties.map((item) => ({ label: item.name, value: item.id }))
    })
    const unit = createListCollection({
        items: units?.grouped?.flatMap((floorUnits) =>
            floorUnits.units.map((item) => ({
                label: item.name,
                value: item.id,
            }))
        ) ?? []
    })

    const mutation = useMutation({
        mutationFn: (data: AddWalkInPayload) => AddWalkIn(data),
        onSuccess: () => {
            toast.success('Walk In Visitor added successfully')
            onClose()
            reset()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const handleAddVisitor = (data: AddWalkinFormData) => {
        const payload: AddWalkInPayload = {
            visitorName: data.visitorName,
            visitorPhone: data.visitorPhone,
            unitId: data.unit[0],
            visitorType: data.visitorType[0],
            fallbackRule: 'SEND_UP'
        }
        mutation.mutate(payload)
    }

    return (
        <Box p={4}>
            <PageTitle title="Add Walk-ins" fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText="Create a visitor pass for guests, deliveries, or service providers." />
            <form onSubmit={handleSubmit(handleAddVisitor)}>
                <HStack w={'full'} gap={4}>

                    {/* Name input wrapped in a relative Box for the dropdown */}
                    <Box position="relative" w={'full'} ref={suggestionRef}>
                        <CustomInput
                            name="visitorName"
                            width={'full'}
                            required
                            control={control}
                            label="Full Name"
                            placeholder="Full Name"
                        />

                        {/* Suggestion dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <Box
                                position="absolute"
                                top="100%"
                                left={0}
                                right={0}
                                zIndex={50}
                                mt={1}
                                bg="white"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                boxShadow="lg"
                                maxH="220px"
                                overflowY="auto"
                            >
                                {walkinmututation.isPending && (
                                    <Flex px={4} py={3} align="center" gap={2} color="gray.400" fontSize="sm">
                                        <Spinner size="xs" />
                                        <Text>Searching...</Text>
                                    </Flex>
                                )}
                                {suggestions.map((visitor, index) => (
                                    <Box
                                        key={index}
                                        px={4}
                                        py={3}
                                        cursor="pointer"
                                        _hover={{ bg: 'gray.50' }}
                                        borderBottom={index < suggestions.length - 1 ? '1px solid' : 'none'}
                                        borderColor="gray.100"
                                        onClick={(e) => {
                                            // onMouseDown instead of onClick so it fires before onBlur
                                            e.preventDefault()
                                            handleSelectSuggestion(visitor)
                                        }}
                                    >
                                        <Text fontWeight="500" fontSize="sm">{visitor.visitorName}</Text>
                                        <Text fontSize="xs" color="gray.500">{visitor.visitorPhone}</Text>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <CustomInput
                        name='visitorPhone'
                        width={'full'}
                        onKeyDown={(e) => {
                            const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "+"]
                            if (!allowed.includes(e.key) && !/[0-9]/.test(e.key)) {
                                e.preventDefault()
                            }
                        }}
                        pattern={{
                            value: /^\+?[0-9]{7,15}$/,
                            message: "Enter a valid phone number",
                        }}
                        required
                        control={control}
                        label='Phone Number'
                        placeholder="Phone Number"
                    />
                </HStack>

                <HStack mt={4} w={'full'} gap={4}>
                    <CustomSelect name='property' width={'full'} collection={props} required control={control} label='Property' placeholder="Property" />
                    <CustomSelect name='unit' width={'full'} collection={unit} required control={control} label='Unit' placeholder="Unit" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomSelect name="visitorType" width={'full'} collection={visitorType} required control={control} label='Visitor Type' placeholder="Visitor Type" />
                    <CustomSelect name="accessType" width={'full'} value={'ONE_OFF'} readOnly collection={accessType} required control={control} label='Access Type' placeholder="Access Type" />
                </HStack>

                <Flex mt={10} align={'center'} w={'full'}>
                    <MainButton disabled={mutation.isPending || !formState.isValid} loading={mutation.isPending} size="lg" type="submit">Add Visitors</MainButton>
                </Flex>
            </form>
        </Box>
    )
}
const visitorType = createListCollection({
    items: [
        { label: 'Guest', value: 'GUEST' },
        { label: 'Delivery', value: 'DELIVERY' },
        { label: 'Service Provider', value: 'SERVICE_PROVIDER' },
    ]
})

const accessType = createListCollection({
    items: [
        { label: 'One Off', value: 'ONE_OFF' }
    ]
})


const Type = [
    {
        value: "ONE_OFF_AGENT",
        label: "Request",
        bgColor: "#FFFBEB",
        borderColor: "#EBFFEE",
        textColor: "#BF6A02",
    },
    {
        value: "ONE_OFF_AGENT_APPROVED",
        label: "Inspection",
        bgColor: "#EBFFEE",
        borderColor: "#FFFBEB",
        textColor: "#14AE5C",
    },
    {
        value: "ONE_OFF",
        label: "One Off",
        bgColor: "#FFFFFF",
        borderColor: "#E0E0E0",
        textColor: "#4A4A4A",
    },
    {
        value: "WHOLE_DAY",
        label: "Whole Day",
        bgColor: "#FFFFFF",
        borderColor: "#E0E0E0",
        textColor: "#4A4A4A",
    },
    {
        value: "RECURRING",
        label: "Recurring",
        bgColor: "#FFFBEB",
        borderColor: "#EBFFEE",
        textColor: "#BF6A02",
    },
];


export const CheckIn = ({ onClose, onWalkIn }: { onClose: () => void, onWalkIn: () => void }) => {
    const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
    const [visitor, setVisitor] = useState<Profile | null>(null)
    const [invalid, setInvalid] = useState(false)
    const [error, setError] = useState<{ code: string; message: string } | null>(null)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const mutation = useMutation({
        mutationFn: (code: string) => GetVisitorByCode(code),
        onSuccess: (response) => {
            if (response.data.ok) {
                setVisitor(response.data.profile)
            } else {
                setInvalid(true)
                setError(response.data.error)
            }
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
            setDigits(Array(6).fill(''))
            inputRefs.current[0]?.focus()
        }
    })

    const checkinMutation = useMutation({
        mutationFn: (data: string) => CheckInVisitor(data),
        onSuccess: () => {
            toast.success('Visitor Successfully Checked In!')
            onClose()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }

    })

    const onCheckin = (data: string) => {
        checkinMutation.mutate(data)
    }

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const char = value.slice(-1)
        const newDigits = [...digits]
        newDigits[index] = char
        setDigits(newDigits)
        if (char && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
        if (index === 5 && char && newDigits.every(d => d !== '')) {
            mutation.mutate(newDigits.join(''))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                const newDigits = [...digits]
                newDigits[index] = ''
                setDigits(newDigits)
            } else if (index > 0) {
                const newDigits = [...digits]
                newDigits[index - 1] = ''
                setDigits(newDigits)
                inputRefs.current[index - 1]?.focus()
            }
        }
    }

    const type = Type.find((type) => type.value === visitor?.frequency)
    const visitorTypes = visitorType.items.find((item) => item.value === visitor?.visitorType)

    return (
        <Flex direction={'column'} rounded={'xl'} bg={'#F7F9FB'} align={'center'} p={8}>{
            invalid ? <Flex direction={'column'} align={'center'}>
                <Center w={'fit'} rounded={'12px'} p={4} bg={'#FE898333'}><MdOutlineLockReset color="#9F403D" size={25} />
                </Center>
                <PageTitle title="Invalid or Expired PIN" center mt={4} fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText={error?.message} />
                <Flex w={'full'} direction={'column'} gap={2}>
                    <MainButton size="lg" className="h-[44px]" loading={mutation.isPending} onClick={onWalkIn}>Add as Walk-In </MainButton>
                    <MainButton size="lg" className="h-[44px]" variant='outline' onClick={() => { setInvalid(false); setError(null); setDigits(Array(6).fill('')) }}>Cancel</MainButton>
                </Flex>

            </Flex> : <>
                <Flex w={'fit'} rounded={'12px'} p={4} bg={'#D8E3FB'}>
                    <Center p={1} color={'#D8E3FB'} rounded={'md'} bg={'#475266'}><TiSortNumerically size={16} /></Center>
                </Flex>
                <PageTitle title="Verify Visitor PIN" center mt={4} fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText="Please enter the 6-digit access code provided by the visitor." />

                <HStack gap={3} mb={8}>
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            disabled={mutation.isPending}
                            onFocus={(e) => { e.target.style.borderColor = '#475266' }}
                            onBlur={(e) => { e.target.style.borderColor = digit ? '#475266' : '#E2E8F0' }}
                            style={{
                                width: '48px',
                                height: '56px',
                                textAlign: 'center',
                                fontSize: '24px',
                                fontWeight: '600',
                                border: `2px solid ${digit ? '#475266' : '#E2E8F0'}`,
                                borderRadius: '8px',
                                outline: 'none',
                                backgroundColor: '#D9E4EA',
                                transition: 'border-color 0.15s',
                                cursor: mutation.isPending ? 'not-allowed' : 'text',
                            }}
                        />
                    ))}
                </HStack>
                {visitor && <SectionFlex w={'full'} h={'full'} mb={8}>
                    <div style={{ width: '95px' }}>
                        <Avatar size='full' rounded={'lg'} name={visitor?.visitorName} />
                    </div>
                    <Box ml={4}>
                        <Text className="satoshi-bold text-lg">{visitor?.visitorName}</Text>
                        <HStack fontSize={'sm'}>
                            <Text color={'#566166'}>Visiting:</Text><Text className="satoshi-medium" color={'#2A3439'}>{visitor?.hostTenant.name}</Text>
                        </HStack>
                        <HStack fontSize={'sm'}><Text>{visitor?.hostTenant.property}</Text>•<Text>{visitor?.hostTenant.unit}</Text>•<Text>{visitorTypes?.label}</Text></HStack>
                        <HStack mt={2}><Center border={'1px solid #E0E0E0'} rounded={'full'} px={3} py={1}><Text>{formatDate(visitor?.scheduledFrom)}</Text></Center>
                            <Center border={'1px solid #E0E0E0'} rounded={'full'} px={3} py={1}><Text>{formatDatetoTime(visitor?.scheduledFrom)}</Text></Center>
                            <Center border={'1px solid #E0E0E0'} rounded={'full'} px={3} py={1}><Text>{type?.label}</Text></Center>
                        </HStack>

                    </Box>
                </SectionFlex>
                }
                <Flex w={'full'} direction={'column'} gap={2}>
                    <MainButton size="lg" className="h-[44px]" disabled={!visitor} loading={mutation.isPending} onClick={() => { if (visitor) { onCheckin(visitor?.inviteId) } }}>Check In Visitor <LuLogIn /></MainButton>
                    <MainButton size="lg" className="h-[44px]" variant='outline' onClick={onClose}>Cancel</MainButton>
                </Flex></>
        }
        </Flex>
    )
}