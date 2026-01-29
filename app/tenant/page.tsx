'use client';
import { useLeaseStore } from "@/store/lease";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

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