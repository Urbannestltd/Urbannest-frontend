import { Box, Button, FileUpload, Flex, Float, HStack, Icon, Span, Text, useFileUploadContext } from "@chakra-ui/react"
import { LuImage, LuUpload, LuX } from "react-icons/lu"

export const AddImage = ({ onFileChange }: { onFileChange: (file: File[] | null) => void }) => {
    return (
        <FileUpload.Root onFileChange={(details) => onFileChange?.(details.acceptedFiles || null)} maxFiles={5} accept={'image/*'}>
            <FileUpload.HiddenInput />
            <HStack align={'end'}>
                <FileUploadList />
                <FileUpload.Trigger>
                    <Button
                        fontSize={"14px"}
                        fontWeight={"semibold"}
                        bg={"#F5F5F5"}
                        color={'#757575'}
                        h={'29px'}
                        px={4}
                        mt={2}
                        mb={2}
                        rounded={"3xl"}
                        w={"117px"}
                        className="satoshi"
                    >
                        <LuImage />Add Image
                    </Button>
                </FileUpload.Trigger>
            </HStack>

        </FileUpload.Root>

    )
}

const FileUploadList = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null




    return (
        <FileUpload.ItemGroup mt={4} >
            <HStack>
                {files.map((file) => (
                    <FileUpload.Item p={2} file={file} key={file.name}>
                        <FileUpload.ItemPreviewImage rounded={'8px'} w={'128px'} h={'66px'} />
                        <Float placement="top-end">
                            <FileUpload.ItemDeleteTrigger boxSize="4" >
                                <LuX />
                            </FileUpload.ItemDeleteTrigger>
                        </Float>
                    </FileUpload.Item>
                ))}
            </HStack>
        </FileUpload.ItemGroup>
    )
}

export const DragAndDrop = () => {
    return (
        <FileUpload.Root maxW="md" alignItems="stretch" accept={'image/*'} maxFiles={1}>
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone rounded={'10px'} h={'148px'} border={'1px solid #000000'}>
                <Icon size="md" color="fg.muted">
                    <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                    <Flex><Text className="satoshi-bold mr-1">Click to upload</Text>or drag and drop</Flex>
                    <Box color="fg.muted">PNG or JPG (max 5mb)</Box>
                </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <FileUpload.List />
        </FileUpload.Root>
    )
}