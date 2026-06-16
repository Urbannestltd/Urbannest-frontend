"use client"
import { PageTitle } from "@/components/ui/page-title"
import { useParams } from "next/navigation"
import { useTicketStore } from "@/store/admin/tickets"
import { useEffect } from "react"
import { TicketPage } from "../../dashboard/[id]/ticket"
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb"


export default function Ticket() {
    const params = useParams()
    const id = params?.id as string
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)

    useEffect(() => {
        fetchTicket(id)
    }, [id])



    return (
        <div>
            <PageTitle title="Maintenance & Issues" fontSize={"22px"} />
            <PageBreadcrumb items={[{ label: "Maintenance & Issues", to: "/admin/maintenance-and-issues" }, { label: Ticket?.subject, isCurrent: true }]} />
            <TicketPage id={id} />

        </div>
    )
}

