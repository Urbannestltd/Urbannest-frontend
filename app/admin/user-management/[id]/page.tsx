import { PageTitle } from "@/components/ui/page-title";
import { Breadcrumb } from "@chakra-ui/react";

export default function UserPage() {
    return (
        <div>
            <PageTitle title="User Management" fontSize={'22px'} />
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/admin/user-management">
                            User Management
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">
                            {"N/A"}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

        </div>
    )
}