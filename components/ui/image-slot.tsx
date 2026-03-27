import { Flex, Image } from "@chakra-ui/react"
import { LuImage } from "react-icons/lu"

export const ImageSlot = ({ src, className, alt }: { src?: string, className?: string, alt?: string }) => {
    if (src) {
        return <Image src={src} className={className} alt={alt} />
    }
    return (
        <Flex
            className={className}
            align={'center'}
            justify={'center'}
            bg={'#F0F0F0'}
            borderRadius={'8px'}
        >
            <LuImage size={24} color={'#CCCCCC'} />
        </Flex>
    )
}