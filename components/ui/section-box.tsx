import { Box, BoxProps, Flex, FlexProps } from "@chakra-ui/react"
type SectionBoxProps = BoxProps & {
    className?: string
}
type SectionFlexProps = FlexProps & {
    className?: string
}

export const SectionBox = ({ className, ...props }: SectionBoxProps) => {
    const base = 'bg-white p-4 rounded-[9px] border-[1.7px]'
    return (
        <Box
            borderColor='#F4F4F4'
            className={`${base} ${className ?? ''}`}
            {...props}
        />
    )
}

export const SectionFlex = ({ className, ...props }: SectionFlexProps) => {
    const base = 'bg-white p-4 rounded-[9px] border-[1.7px]'
    return (
        <Flex
            borderColor='#F4F4F4'
            className={`${base} ${className ?? ''}`}
            {...props}
        />
    )
}