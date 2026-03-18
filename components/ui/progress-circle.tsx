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

export const ProgressCircle = React.forwardRef<
    HTMLDivElement,
    ProgressCircleProps
>(function ProgressCircle(props, ref) {
    const {
        showValueText,
        valueText,
        trackColor,
        color,
        cap,
        thickness,
        value,
        size = 'xl',
        ...rest
    } = props

    return (<ChakraProgressCircle.Root // control real size
        value={value}
        ref={ref}
        {...rest}
    >
        <ChakraProgressCircle.Circle css={{ "--thickness": `${thickness}px` }}>
            <ChakraProgressCircle.Track stroke={trackColor} />
            <ChakraProgressCircle.Range stroke={color} strokeLinecap={cap} />
        </ChakraProgressCircle.Circle>
        {showValueText && (
            <ChakraProgressCircle.ValueText>
                {valueText}
            </ChakraProgressCircle.ValueText>
        )}
    </ChakraProgressCircle.Root>
    )
})
