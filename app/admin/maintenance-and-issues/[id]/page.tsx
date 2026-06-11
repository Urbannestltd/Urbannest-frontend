"use client"
import { PageTitle } from "@/components/ui/page-title"
import {
    Breadcrumb,
    Flex,
    Text,
} from "@chakra-ui/react"
import { useParams } from "next/navigation"
import { useTicketStore } from "@/store/admin/tickets"
import { useEffect } from "react"
import { TicketPage } from "../../dashboard/[id]/ticket"


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
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/admin/maintenance-and-issues">
                            Maintenance & Issues
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">
                            {Ticket?.subject}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <TicketPage id={id} />

        </div>
    )
}

