import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { ExpenseLog, expenseStatus } from "./columns"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatNumber } from "@/services/date"
import { useState } from "react"
import { IoFlag, IoFlagOutline } from "react-icons/io5"
import { DeletePopup, FlagMistake } from "./moodal"
import { Modal } from "@/components/ui/dialog"
import { LuPencil } from "react-icons/lu"
import { BiTrash } from "react-icons/bi"
import Image from "next/image"
import EmptyIcon from '@/app/assets/icons/facilty-icons/expense-empty.svg'
import { Expensee } from "@/store/admin/tickets"

export const MobileTable = ({ data, tableName }: { data: Expensee[], tableName: string }) => {
    const [isFlagged, setIsFlagged] = useState<string | null>(null)
    const [Delete, setDelete] = useState<string | null>(null)
    const emptyDetails = {
        icon: EmptyIcon,
        title: 'No expense yet',
        description: 'No expenses have been logged for this ticket yet. Click log expenses to add an expense.'
    }

    return (
        <Box>
            {data.length === 0 && <div className='flex flex-col items-center justify-center my-16 space-y-6'>
                <div className='flex items-center justify-center'>
                    {emptyDetails?.icon ? <Image src={emptyDetails?.icon} width={40} height={40} alt="" /> : <Box rounded={'full'} className='bg-primary-gold' boxSize={'40px'} />}
                </div>

                <div className='flex flex-col items-center justify-center space-y-2'>
                    <h4 className='text-xl satoshi-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
                    <p className='text-sm text-center satoshi-medium text-[#6A6C88]'>
                        {emptyDetails?.description || `No ${tableName} found`}
                    </p>
                </div>
            </div>}
            {data.map((row) => {
                const color = expenseStatus.find(
                    (item) => item.value === row.status,
                )
                if (color?.value === 'REJECTED' || color?.value === "REBUTTED" || color?.value === "PENDING") {
                    return (
                        <SectionBox my={4} key={row.id} p={0} bg={color.bg} border={`1px solid ${color.border}`} className="border-b border-[#D9D9D9]">
                            <Flex justify={'space-between'} p={4} align={'center'}>
                                <Box
                                >
                                    <Text className="satoshi-bold text-base">
                                        {row?.description}
                                    </Text>
                                    <Flex className=" text-[#717C82] text-xs">{row?.date} • <Text color={color?.textColor} ml={1} className="satoshi-bold">{color?.text}</Text></Flex>
                                    {color?.value === 'REBUTTED' ? <Flex gap={2} mt={2}>
                                        <Button bg={'#ECFDF5'} color={'#047857'} h={'30px'} fontSize={'12px'} border={'1px solid #D1FAE5'} py={0} rounded={'full'} px={2}>Accept</Button>
                                        <Button color='#B91C1C' fontSize={'12px'} h={'30px'} bg={'#FEF2F2'} py='0' border={'1px solid #FEE2E2'} rounded={'full'} px={2}>Cancel</Button>
                                    </Flex> : null}
                                </Box>
                                <Flex direction={'column'} align={'end'}>
                                    <Text className="satoshi-bold" mb={1} textAlign={"end"}>
                                        {formatNumber(row.amount)}
                                    </Text>
                                    <Flex>
                                        {(color?.value === "REJECTED" || color?.value === "PENDING") &&
                                            <Flex>
                                                <LuPencil
                                                    color="#A9B4B9"
                                                    size={18}
                                                    cursor={'pointer'}
                                                    className="mr-2"
                                                    onClick={() =>// startEdit(row)
                                                    { }}
                                                />
                                                <BiTrash color="#B91C1C" size={18} onClick={() => setDelete(row.id)} cursor={'pointer'} />
                                            </Flex>
                                        }
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Box bg={color.descBg} color={color.textColor} fontSize={'13px'} p={4}>
                                This expense exceeds the assigned budget. A budget approval
                                request has been sent to admin.


                            </Box>

                        </SectionBox>
                    )

                }
                return (
                    <SectionFlex my={4} key={row.id} justify={'space-between'} align={'center'} className="border-b border-[#D9D9D9]">
                        <Box
                        >
                            <Text className="satoshi-bold text-base">
                                {row?.description}
                            </Text>
                            <Flex className=" text-[#717C82] text-xs">{row?.date} • <Text color={color?.textColor} ml={1} className="satoshi-bold">{color?.text}</Text></Flex>
                            <Text
                                bg={"#E1E9EE"}
                                w={"fit"}
                                px={2}
                                py={1}
                                mt={2}
                                textAlign={"center"}
                                className=" text-xs"
                                color={"#566166"}
                                textTransform={"capitalize"}
                                rounded={"4px"}
                            >
                                {row.category.toLowerCase()}
                            </Text>
                        </Box>
                        <Flex direction={'column'} align={'end'}>
                            <Text className="satoshi-bold" mb={1} textAlign={"end"}>
                                {formatNumber(row.amount)}
                            </Text>
                            {color?.value === "FLAGGED" ? (
                                <IoFlag
                                    color={"#EA9C4899"}
                                    size={"15px"}
                                />
                            ) : (
                                <IoFlagOutline
                                    onClick={() => setIsFlagged(row.id)}
                                    cursor={"pointer"}
                                    color="#A9B4B999"
                                    size={"15px"}
                                />
                            )}
                        </Flex>
                    </SectionFlex>
                )
            })}
            <Modal className="w-[90%]" size={'xs'} open={isFlagged !== null} modalContent={<FlagMistake onClose={() => setIsFlagged(null)} />} onOpenChange={(open) => open ? setIsFlagged(isFlagged) : setIsFlagged(null)} />
            <Modal className="w-[90%]" size={'xs'} open={Delete !== null} modalContent={<DeletePopup onClose={() => setDelete(null)} />} onOpenChange={(open) => open ? setDelete(Delete) : setDelete(null)} />

        </Box>


    )
}