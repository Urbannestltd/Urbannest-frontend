import type { SystemStyleObject } from "@chakra-ui/react"
import {
    ProgressCircle as ChakraProgressCircle,
} from "@chakra-ui/react"
import * as React from "react"

interface ProgressCircleProps extends ChakraProgressCircle.RootProps {
    showValueText?: boolean
    valueText?: React.ReactNode
    trackColor?: SystemStyleObject["stroke"]
    cap?: SystemStyleObject["strokeLinecap"]
    thickness?: SystemStyleObject["strokeWidth"]
}

export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
    function ProgressCircle(props, ref) {
        const {
            showValueText,
            valueText,
            trackColor,
            color,
            cap,
            thickness,
            value,
            size,
            ...rest
        } = props

        return (
            <ChakraProgressCircle.Root display={'flex'} alignItems={'center'} value={value} size={size} ref={ref} {...rest}>
                <ChakraProgressCircle.Circle
                    css={thickness ? { "--thickness": `${thickness}px` } : undefined}
                >
                    <ChakraProgressCircle.Track {...(trackColor ? { stroke: trackColor } : {})} />
                    <ChakraProgressCircle.Range {...(color ? { stroke: color } : {})} strokeLinecap={cap} />
                </ChakraProgressCircle.Circle>
                {showValueText && (
                    <ChakraProgressCircle.ValueText ml={1}>
                        {valueText ?? `${value}%`}
                    </ChakraProgressCircle.ValueText>
                )}
            </ChakraProgressCircle.Root>
        )
    }
)