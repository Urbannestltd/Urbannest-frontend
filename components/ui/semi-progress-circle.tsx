import { useState, useEffect } from "react"
import CompassArrow from '@/app/assets/icons/compass-arrow.svg'
import { Box, Flex } from "@chakra-ui/react";
import { formatNumber } from "@/services/date";

type SemiProgressCircleProps = {
    value: number;
    size?: number;
    thickness?: number;
    color?: string;
    trackColor?: string;
    needleColor?: string;
    expectedValue?: number
};

export const SemiProgressCircle = ({
    value,
    size = 347,
    thickness = 12,
    color = "#CFAA67",
    trackColor = "#E7EEF5",
    needleColor = "#CFAA67",
    expectedValue
}: SemiProgressCircleProps) => {
    const [animatedValue, setAnimatedValue] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(value), 100)
        return () => clearTimeout(timer)
    }, [value])

    const radius = (size - thickness) / 2
    const circumference = Math.PI * radius
    const progress = ((100 - animatedValue) / 100) * circumference

    // center pivot point
    const cx = size / 2
    const cy = size / 2

    // rotate from -90deg (0%) to +90deg (100%)
    const angle = -90 + (animatedValue / 100) * 180
    const needleLength = radius - thickness

    // calculate needle tip position
    const angleRad = (angle * Math.PI) / 180
    const tipX = cx + needleLength * Math.cos(angleRad)
    const tipY = cy + needleLength * Math.sin(angleRad)

    const iconSize = 40

    return (
        <Box position="relative" w={`${size}px`} h={`${size / 2 + thickness}px`}>
            <svg
                width={size}
                height={size / 2 + thickness}
                viewBox={`0 0 ${size} ${size / 2 + thickness}`}
            >
                {/* Track */}
                <path
                    d={`M ${thickness / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${size / 2}`}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                />

                {/* Progress */}
                <path
                    d={`M ${thickness / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${size / 2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                />
            </svg>

            {/* Icon overlaid on top of SVG */}
            <Flex
                direction={'column'}
                align={'center'}
                position="absolute"
                top={`${(cy - iconSize / 2) - 70}px`}
                left={`${(cx - iconSize / 2) - 20}px`}
            >
                <Flex direction={'column'} align={'center'}>
                    <p className="satoshi-bold text-[18px] mb-1"> {formatNumber(expectedValue ?? 0)}</p>
                    <p className="satoshi-medium text-sm mb-5 text-[#5A5A5A]">Expected</p>
                </Flex>

                <Box
                    style={{
                        transform: `rotate(${angle + 70}deg)`,
                        transformOrigin: "center center",
                        transition: "all 0.8s ease-in-out",
                    }}
                >
                    <img src={CompassArrow.src} width={iconSize - 10} height={iconSize - 10} />
                </Box> </Flex>
        </Box>
    )
}