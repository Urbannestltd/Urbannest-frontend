import { EmptyDetails } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/dialog";
import { SectionBox, SectionFlex } from "@/components/ui/section-box";
import { TenantApprovals } from "@/utils/model";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoEyeOutline, } from "react-icons/io5";
import { TenantApprovalsModal } from "./modal";

interface MobileTableProps {
    data: TenantApprovals[]
    emptyDetails: EmptyDetails
    tableName: string
}
export const MobileTable = ({ data, emptyDetails, tableName }: MobileTableProps) => {
    const [openModal, setOpenModal] = useState(false)
    const [type, setType] = useState<'accept' | 'decline'>('decline')
    return (
        <div className="">
            {data.length === 0 && <div className='flex flex-col items-center justify-center my-16 space-y-6'>
                <div className='flex items-center justify-center'>
                    {emptyDetails?.icon ? <Image src={emptyDetails?.icon} alt="" /> : <Box rounded={'full'} className='bg-primary-gold' boxSize={'40px'} />}
                </div>

                <div className='flex flex-col items-center justify-center space-y-2'>
                    <h4 className='text-xl font-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
                    <p className='text-sm text-center font-medium text-[#6A6C88]'>
                        {emptyDetails?.description || `No ${tableName} found`}
                    </p>
                </div>
            </div>}
            {data.map((item) =>
                <SectionFlex key={item.id ?? `${item.applicantName}-${item.propertyName}-${item.unitName}`} justify={'space-between'} mt={4}>
                    <Box>
                        <Text className="satoshi-medium">{item.applicantName}</Text>
                        <Text color={'#566166'} fontSize={'12px'} mr={4}>
                            {item.propertyName} •  {item.unitName}
                        </Text>
                        <Text className="satoshi-bold" fontSize={'13px'} mr={4}>
                            $48,500 Annually
                        </Text>
                    </Box>
                    <Box mt={4}>
                        <Flex gap={2}>
                            <IoEyeOutline
                                color={'#566166'}
                                size={20}
                                cursor={"pointer"}
                                onClick={() => { setOpenModal(true); setType('accept') }}
                            />
                            <IoCheckmarkCircleOutline
                                color={"#047857"}
                                size={20}
                                cursor={"pointer"}
                                onClick={() => { setOpenModal(true); setType('accept') }}
                            />
                            <IoCloseCircleOutline
                                color="#B91C1C"
                                size={20}
                                cursor="pointer"
                                onClick={() => { setOpenModal(true); setType('decline') }}
                            />
                        </Flex>
                        <Modal size={'xs'} open={openModal} onOpenChange={setOpenModal} modalContent={<TenantApprovalsModal type={type} id={item.id ?? ''} onClose={() => setOpenModal(false)} />} />
                    </Box>

                </SectionFlex>
            )}

        </div>
    );
};
