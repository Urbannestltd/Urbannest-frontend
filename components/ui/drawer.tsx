import { Dialog, Drawer, DrawerRootProps } from "@chakra-ui/react"
import { ButtonSize, MainButton, type ButtonVariant } from "./button";
import React from "react";
import { LuX } from "react-icons/lu";

type DrawerProps = {
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
    size?: DrawerRootProps['size']
    placement?: DrawerRootProps['placement']
}

export const Drawers = ({
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
    placement = 'start',
}: DrawerProps) => {
    const base = 'bg-white rounded-[12px] shadow-xs'
    return (
        <Drawer.Root size={size} open={open} onOpenChange={(e) => onOpenChange?.(e.open)} placement={placement}>
            <Drawer.Trigger asChild>
                {triggerElement ? triggerElement : triggerContent && <MainButton size={triggerSize} className={`satoshi ${triggerClassName}`} variant={triggerVariant} icon={triggerIcon}>
                    {triggerContent}
                </MainButton>}
            </Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Positioner >
                <Drawer.Content roundedLeft={'none'} className={`${base} ${className ?? ''}`}>
                    <Drawer.CloseTrigger p={2}>
                        <LuX color="black" size={20} />
                    </Drawer.CloseTrigger>
                    {modalContent}
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}