"use client"
import { PageTitle } from "@/components/ui/page-title"
import {
    Breadcrumb,
} from "@chakra-ui/react"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useTicketStore } from "@/store/fm/ticket"
import { TicketPage } from "../../properties/[id]/ticket"


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
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/facility-manager/maintenance-and-issues">
                            Maintenance & Issues
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">
                            {ticket?.subject}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <TicketPage id={id} />
        </div>
    )
}
