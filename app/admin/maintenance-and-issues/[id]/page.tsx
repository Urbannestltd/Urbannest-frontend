'use client'
import { PageTitle } from "@/components/ui/page-title";
import { SectionBox, SectionFlex } from "@/components/ui/section-box";
import { formatDate, formatDatetoTime } from "@/services/date";
import { TickettData } from "@/utils/data";
import { Box, Breadcrumb, Center, Circle, Flex, HStack, Image, Span, Text, Timeline } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import image1 from '@/app/assets/images/lease-image.png'
import { MdAttachFile, MdOutlineAvTimer, MdOutlineTimer } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuAtSign, LuPackage, LuShip } from "react-icons/lu";
import { AiFillThunderbolt } from "react-icons/ai";
import { BsChatLeftFill } from "react-icons/bs";
import { CustomTextarea } from "@/components/ui/custom-fields";
import { useForm } from "react-hook-form";
import { MainButton } from "@/components/ui/button";


export default function TicketPage() {
    const params = useParams();
    const id = params?.id as string;
    const Ticket = TickettData.find((ticket) => ticket.id === id);
    const { control } = useForm()

    const Info = [
        {
            label: 'Property & Unit',
            value: Ticket?.propertyName + ', ' + Ticket?.propertyUnit,
            bottom: 'Downtown District'
        },
        {
            label: 'Tenant',
            value: 'Alexandru Voinea',
            bottom: '+1 (555) 012-3456'
        },
        {
            label: 'Issue Type',
            value: Ticket?.category
        },
    ]

    return (
        <div>
            <PageTitle title="Maintenance & Issues" fontSize={'22px'} />
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/admin/maintenance-and-issues">Maintenance & Issues</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">{Ticket?.propertyName}</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Flex>
                <Box w={'805px'}>
                    <SectionBox w={'805px'} mt={8} p={6}>
                        <HStack justify={'space-between'}>
                            <Box>
                                <HStack>
                                    <Circle size={'8px'} bg="yellow.500" />
                                    <Text className="satoshi-bold text-sm">In Progress</Text>
                                </HStack>
                                <PageTitle mt={2} title={Ticket?.subject || 'No Subject'} fontSize={'22px'} />
                            </Box>
                            <Box>
                                <Text letterSpacing={'1.1px'} className="satoshi-bold uppercase text-[#757575] text-[10px]">Created at</Text>
                                <Text className="satoshi-bold text-sm">{formatDate(Ticket?.dateSubmitted)} • {formatDatetoTime(Ticket?.dateSubmitted)}</Text>
                            </Box>
                        </HStack>
                        <HStack mt={6} h={'89px'}>
                            {Info.map((info) =>
                                <SectionBox bg={'#F5F5F5'} p={4} w={'full'} h={'full'}>
                                    <Text letterSpacing={'1.1px'} className="satoshi-bold uppercase text-[#757575] text-[10px]">{info.label}</Text>
                                    <Text className="satoshi-bold text-sm capitalize">{info.value?.toLowerCase()}</Text>
                                    {info.bottom && <Text className=" text-xs capitalize">{info.bottom}</Text>}
                                </SectionBox>)}
                        </HStack>
                        <Box mt={8}>
                            <Text letterSpacing={'1.1px'} mb={3} className="satoshi-bold uppercase text-[#757575] text-[10px]">Tenant Description</Text>
                            <SectionBox bg={'#F5F5F5'} p={4} w={'full'} h={'full'}>
                                <Text className="text-sm satoshi-variable-italic">"There is a persistent drip coming from the base of the toilet in the master bathroom. It
                                    seems to worsen after flushing. I've placed a towel down for now, but I'm worried about
                                    water damage to the flooring."</Text>
                            </SectionBox>
                        </Box>
                        <Box mt={8}>
                            <Text letterSpacing={'1.1px'} mb={3} className="satoshi-bold uppercase text-[#757575] text-[10px]">Attached Images</Text>
                            <HStack>
                                <Image src={image1.src} alt="profile" className="rounded-lg" boxSize={'126px'} />
                                <Image src={image1.src} alt="profile" className="rounded-lg" boxSize={'126px'} />
                            </HStack>
                        </Box>
                    </SectionBox>
                    <HStack w={'full'} gap={6} mt={8}>
                        <SectionFlex align={'center'} w={'full'} h={'113px'}>
                            <Center bg={'#2A33480D'} p={3.5} rounded={'full'}>
                                <MdOutlineTimer size={20} />
                            </Center>
                            <Box ml={2}>
                                <Text letterSpacing={'1.1px'} className="satoshi-bold uppercase text-[#757575] text-[10px]">Time to First Response</Text>
                                <Text className="satoshi-bold text-lg">14 Minutes</Text>
                                <Flex align={'center'} fontSize={'xs'} className="satoshi-medium" gap={1} color={'#16A34A'}> <IoCheckmarkCircleOutline /> Within SLA Target (30m)</Flex>

                            </Box>
                        </SectionFlex>
                        <SectionFlex align={'center'} w={'full'} h={'113px'}>
                            <Center bg={'#2A33480D'} p={3.5} rounded={'full'}>
                                <MdOutlineAvTimer size={20} />
                            </Center>
                            <Box ml={2}>
                                <Text letterSpacing={'1.1px'} className="satoshi-bold uppercase text-[#757575] text-[10px]">Time to Resolution</Text>
                                <Flex className=" items-end satoshi-bold text-lg">5h 22m <Text className="text-[#757575] mb-1 ml-2 text-xs">(Est.)</Text></Flex>
                                <Text fontSize={'xs'} className="satoshi-medium">Current average: 4h 15m</Text>

                            </Box>
                        </SectionFlex>
                    </HStack>
                    <SectionBox bg={'#F5F5F580'} mt={8} pt={0} px={0}>
                        <Flex p={4}>
                            <PageTitle title="Activity Timeline" fontSize={'16px'} />
                        </Flex>
                        <SectionBox rounded={'none'} border={'none'}>
                            <Timeline.Root variant={'subtle'} >
                                <Timeline.Item w={'full'}>
                                    <Timeline.Connector >
                                        <Timeline.Separator border={'1px solid #F4F4F4'} />
                                        <Timeline.Indicator bg={'#F5F5F5'}>
                                            <LuShip />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content w={'full'}>
                                        <Flex w={'full'} justify={'space-between'}>
                                            <Box>
                                                <Timeline.Title className="satoshi-bold">Ticket Created</Timeline.Title>
                                                <Timeline.Description>System generated via Tenant Portal.</Timeline.Description>
                                            </Box>
                                            <Text fontSize={'xs'} textStyle='xs'>Oct 12 • 09:14 AM
                                            </Text>
                                        </Flex>

                                    </Timeline.Content>
                                </Timeline.Item>

                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator border={'1px solid #F4F4F4'} />
                                        <Timeline.Indicator bg={'#F5F5F5'}>
                                            <BsChatLeftFill />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content>
                                        <SectionFlex justify={'space-between'} p={2} bg={'#F5F5F5'}>
                                            <Box>
                                                <Timeline.Title className="satoshi-bold" textStyle="sm">First Response </Timeline.Title>
                                                <Timeline.Description fontSize={'13px'} w={'70%'}>"Hi Alexandru, we've received your report. A maintenance technician has been
                                                    notified and we are assessing the priority now."</Timeline.Description>
                                                <Flex fontSize={'2xs'} mt={2} className="satoshi-bold uppercase" color={'#2A3348'} letterSpacing={'0.5px'} align={'center'}><AiFillThunderbolt />Response time: 14m</Flex>
                                            </Box>
                                            <Text fontSize={'xs'} textStyle='xs'>Oct 12 • 09:14 AM
                                            </Text>
                                        </SectionFlex>
                                    </Timeline.Content>
                                </Timeline.Item>

                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator />
                                        <Timeline.Indicator>
                                            <LuPackage />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content>
                                        <Timeline.Title textStyle="sm">Order Delivered</Timeline.Title>
                                        <Timeline.Description>20th May 2021, 10:30am</Timeline.Description>
                                    </Timeline.Content>
                                </Timeline.Item>
                            </Timeline.Root>
                        </SectionBox>
                        <Box p={4} py={6}>
                            <CustomTextarea control={control} name="message" borderColor="#F4F4F4" placeholder="Write a message to the facility manager..." />
                            <HStack mt={8} justify={'space-between'}>
                                <Flex gap={4}>
                                    <MdAttachFile cursor={'pointer'} color="#4A4A4A" size={20} />
                                    <LuAtSign cursor={'pointer'} color="#4A4A4A" size={20} />
                                </Flex>
                                <MainButton variant='darkGhost' size="sm" className="h-[38px] uppercase text-xs satoshi-bold">Send Note</MainButton>
                            </HStack>
                        </Box>
                    </SectionBox>

                </Box>
                <Box>
                    <SectionBox>
                        <Text letterSpacing={'1.1px'} className="satoshi-bold uppercase text-[#757575] text-[10px]">Management Actions</Text>
                        <MainButton variant='darkGhost' size="sm" className="h-[38px]  text-xs satoshi-bold">Assign / Reassign</MainButton>
                    </SectionBox>
                </Box>
            </Flex>
        </div >
    )
}