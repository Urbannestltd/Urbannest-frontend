"use client"
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Image,
    Portal,
    Span,
    Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaRegBell } from "react-icons/fa"
import { PageTitle } from "../ui/page-title"
import { Divider } from "../ui/divider"
import { notification } from "@/utils/model"
import { notificationsinfo } from "@/utils/data"

interface CardProps {
    notifs: notification[]
}

const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-")

    const date = new Date(
        Number(`20${year}`), // year → 2025
        Number(month) - 1, // month index
        Number(day)
    )

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

const NotifcationsCard = ({ notifs }: CardProps) => {
    const iconTypes: Record<
        notification["type"],
        Partial<Record<notification["status"], string>>
    > = {
        visitor: {
            success: "/notifs-icons/visitor-arrived.svg",
        },
        lease: {
            info: "/notifs-icons/lease-info.svg",
            success: "/notifs-icons/lease-success.svg",
        },
        payment: {
            success: "/notifs-icons/payment-success.svg",
            error: "/notifs-icons/payment-failed.svg",
        },
    }
    return (
        <>
            {notifs.map((data) => (
                <Box className="hover:bg-gray-50 cursor-default px-2" pt={4}>
                    <Box className="flex mb-4 hover:bg-gray-50 items-center gap-4">
                        <Image
                            className="size-13"
                            src={iconTypes[data.type]?.[data.status]}
                            alt="visitor"
                        />
                        <Box>
                            <Text className="satoshi-bold text-[15px]">{data.title}</Text>
                            <Text className="satoshi-medium text-[13px]">{data.message}</Text>
                            <Text className="satoshi-medium text-[#B3B3B3] text-[12px]">
                                {formatDate(data.date)}
                            </Text>
                        </Box>
                    </Box>
                    <Divider my={0} />
                </Box>
            ))}
        </>
    )
}

export const Notifications = () => {
    const [open, setOpen] = useState(false)
    const NotificationsIcon = () => {
        return (
            <>
                <Button className={open ? " bg-button-primary text-white" : "hover:bg-button-hover hover:text-white"}>
                    <FaRegBell size={20} />
                </Button>
            </>
        )
    }
    return (
        <Dialog.Root
            placement={"top"}
            open={open}
            onOpenChange={() => setOpen(!open)}
        >
            <Dialog.Trigger>
                <NotificationsIcon />
            </Dialog.Trigger>
            <Portal>
                <Dialog.Positioner
                    bg={"transparent"}
                    placeSelf={"end"}
                    placeContent={"end"}
                >
                    <Dialog.Content
                        bg={"white"}
                        border={"1px solid #F1F1F1"}
                        shadow={"0px 2px 2px rgba(0, 0, 0, 0.25)"}
                        maxH={"559px"}
                        overflowY={"scroll"}
                        rounded={"xl"}
                        className="absolute right-7 top-7"
                        placeSelf={"end"}
                    >
                        <Dialog.CloseTrigger>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <NotificationsBoard />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

const NotificationsBoard = () => {
    return (
        <>
            <Span p={4}>
                <PageTitle
                    title="Notifications"
                    fontSize={"19px"}
                    subText="You have 3 notifications today."
                />
            </Span>
            <Divider my={0} />
            <Box p={4}>
                <PageTitle title="Today" fontSize={"18px"} />
                <NotifcationsCard notifs={notificationsinfo} />
            </Box>
        </>
    )
}
