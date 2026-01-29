import { Dialog, DialogRootProps } from "@chakra-ui/react"
import { ButtonSize, MainButton, type ButtonVariant } from "./button";
import React from "react";

type ModalProps = {
    className?: string;
    triggerVariant?: ButtonVariant
    triggerSize?: ButtonSize
    triggerContent?: string
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
                <MainButton size={triggerSize} className={`satoshi ${triggerClassName}`} variant={triggerVariant} icon={triggerIcon}>
                    {triggerContent}
                </MainButton>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content className={`${base} ${className ?? ''}`}>
                    {modalContent}
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}