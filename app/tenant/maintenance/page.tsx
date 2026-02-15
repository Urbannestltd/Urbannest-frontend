'use client'
import { DataTable } from "@/components/ui/data-table";
import { PageTitle } from "@/components/ui/page-title";
import { maintenanceRequest } from "@/utils/data";
import { HStack } from "@chakra-ui/react";
import { useColumns } from "./columns";
import { TenantMaintenanceModal } from "./modal";
import { Modal } from "@/components/ui/dialog";
import { useMaintenanceStore } from "@/store/maintenance";
import { stat } from "fs";
import { useEffect, useState } from "react";

export default function Maintenance() {
    const columns = useColumns()
    const maintenance = useMaintenanceStore((state) => state.maintenance)
    const [closeModal, setCloseModal] = useState(false)
    const fetchMaintenance = useMaintenanceStore((state) => state.fetchMaintenance)

    useEffect(() => {
        if (!closeModal) fetchMaintenance()
    }, [closeModal])

    return (
        <>
            <HStack mt={7} mb={4} justify={'space-between'}>
                <PageTitle title="Maintenance Requests" />
                <Modal open={closeModal} onOpenChange={setCloseModal} className="lg:w-[1200px] border border-red-700 h-fit" size="cover" modalContent={<TenantMaintenanceModal />} triggerVariant={'primary'} triggerContent={'Add Request'} />
            </HStack>
            <DataTable tableName="Maintenance Requests" loading={useMaintenanceStore((state) => state.isLoading)} data={maintenance} my={5} columns={columns} />
        </>
    )
}