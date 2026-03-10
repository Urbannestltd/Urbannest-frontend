"use client";

import { getUserToken } from "@/services/cookies";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { user, isHydrated } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !isHydrated) return;

        const token = getUserToken();

        if (!user && !token) {
            console.log("❌ No user or token, redirecting...");
            router.replace("/auth");
        }
    }, [mounted, isHydrated, user, router]);

    if (!mounted) return null;

    if (!isHydrated) return null;

    if (!user && !getUserToken()) return null;

    return <>{children}</>;
}