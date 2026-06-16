"use client"
import { PageTitle } from "@/components/ui/page-title"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useTicketStore } from "@/store/fm/ticket"
import { TicketPage } from "../../properties/[id]/ticket"
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb"


export default function Ticket() {
    const params = useParams()
    const id = params?.id as string
    const ticket = useTicketStore(state => state.ticket)

    useEffect(() => {
        if (!id) return
        useTicketStore.getState().fetchTicket(id)
    }, [id])

    return (
        <div>
            <PageTitle title="Maintenance & Issues" fontSize={"22px"} />
            <PageBreadcrumb items={[{ label: "Maintenance & Issues", to: "/facility-manager/maintenance-and-issues" }, { label: ticket?.subject, isCurrent: true }]} />
            <TicketPage id={id} />
        </div>
    )
}
