'use client';
import { useLeaseStore } from "@/store/lease";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TenantSidebar } from "./sidebar";

export default function Home() {
    const router = useRouter()
    const lease = useLeaseStore((state) => state.lease);
    const fetchLease = useLeaseStore((state) => state.fetchLease);

    useEffect(() => {
        fetchLease()
    }, [])
    useEffect(() => {
        if (lease) {
            router.replace("/tenant/dashboard")
        }
    }, [lease, router])

    return null
}

export function SideBarSetup() {
    const pathname = usePathname();
    const isSetting = pathname.includes('settings');

    return (<> {isSetting ? null : <div className="relative hidden md:block w-[380px]">
        <TenantSidebar />
    </div>}</>)
}