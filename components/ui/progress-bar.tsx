import { Box, Progress as ChakraProgress } from "@chakra-ui/react"
import * as React from "react"

interface ProgressProps extends ChakraProgress.RootProps {
    showValueText?: boolean
    valueText?: React.ReactNode
    label?: React.ReactNode
    info?: React.ReactNode
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    function Progress(props, ref) {
        const { showValueText, valueText, label, info, color, ...rest } = props
        return (
            <ChakraProgress.Root orientation='horizontal' shape={'rounded'} {...rest} ref={ref}>

                {label && (
                    <ChakraProgress.Label mb={0} whiteSpace="nowrap">
                        {label}
                    </ChakraProgress.Label>
                )}
                <Box display="flex" alignItems="space-between" gap={1}>
                    <ChakraProgress.Track rounded={'full'} flex={1}>
                        <ChakraProgress.Range
                            rounded={'full'}
                            css={{ backgroundColor: color ? color : '#CFAA67' }}
                        />
                    </ChakraProgress.Track>
                    {showValueText && (
                        <ChakraProgress.ValueText w={'20px'} ml={1} whiteSpace="nowrap">
                            {valueText}
                        </ChakraProgress.ValueText>
                    )}
                </Box>
            </ChakraProgress.Root>
        )
    },
)