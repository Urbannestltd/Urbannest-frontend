import { Dialog, DialogRootProps } from "@chakra-ui/react"
import { ButtonSize, MainButton, type ButtonVariant } from "./button";
import React from "react";
import { LuX } from "react-icons/lu";

type ModalProps = {
    className?: string;
    triggerVariant?: ButtonVariant
    triggerSize?: ButtonSize
    triggerContent?: string
    triggerElement?: React.ReactNode
    triggerIcon?: React.ReactElement
    triggerClassName?: string
    modalContent: React.ReactNode
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    size?: DialogRootProps['size']
    placement?: "bottom" | "top" | "center"
}

export const Modal = ({
    className,
    triggerClassName,
    triggerVariant = 'primary',
    triggerSize = 'md',
    triggerContent,
    triggerElement,
    triggerIcon,
    modalContent,
    open,
    onOpenChange,
    size = 'lg',
    placement = 'center'
}: ModalProps) => {
    const base = 'bg-white rounded-[12px] shadow-xs'
    return (
        <Dialog.Root size={size} open={open} onOpenChange={(e) => onOpenChange?.(e.open)} placement={placement}>
            <Dialog.Trigger asChild>
                {triggerElement ? triggerElement : <MainButton size={triggerSize} className={`satoshi ${triggerClassName}`} variant={triggerVariant} icon={triggerIcon}>
                    {triggerContent}
                </MainButton>}
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content className={`${base} ${className ?? ''}`}>
                    <Dialog.CloseTrigger p={2}>
                        <LuX size={20} />
                    </Dialog.CloseTrigger>
                    {modalContent}
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}