import { Modal } from "@/components/ui/dialog"
import { TenantApprovals } from "@/utils/model"
import { Flex } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { IoEyeOutline } from "react-icons/io5"
import { LuCheck, LuX } from "react-icons/lu"
import { TenantApprovalsModal } from "./modal"



export const useColumns = (): ColumnDef<TenantApprovals, any>[] => {
    return [
        {
            accessorKey: 'applicantName',
            header: "Applicant",
        },
        {
            accessorKey: 'propertyName',
            header: "Property",
        },
        {
            accessorKey: 'unitName',
            header: "Unit",
        },
        {
            id: 'actions',
            header: "Actions",
            cell: ({ row }) => {
                const [openModal, setOpenModal] = useState(false)
                const [type, setType] = useState<'accept' | 'decline'>('decline')
                return <>
                    <Flex gap={2}>
                        <IoEyeOutline
                            color={'#566166'}
                            size={20}
                            cursor={"pointer"}
                            onClick={() => { setOpenModal(true); setType('accept') }}
                        />
                        <LuCheck
                            color={"#047857"}
                            size={20}
                            cursor={"pointer"}
                            onClick={() => { setOpenModal(true); setType('accept') }}
                        />
                        <LuX
                            color="#B91C1C"
                            size={20}
                            cursor="pointer"
                            onClick={() => { setOpenModal(true); setType('decline') }}
                        />
                    </Flex>
                    <Modal size={'xs'} open={openModal} onOpenChange={setOpenModal} modalContent={<TenantApprovalsModal type={type} id={row.original.applicantName} onClose={() => setOpenModal(false)} />} />
                </>
            }
        }
    ]
}
