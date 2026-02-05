"use client";

import { getUserToken } from "@/services/cookies";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const { user, isHydrated } = useAuthStore();


    // ✅ Only access Zustand store after component mounts on client
    useEffect(() => {
        setMounted(true);
        if (!getUserToken()) {
            window.location.href = "/auth"
        }
    }, [])

    useEffect(() => {
        if (!mounted) return;

        const { user, isHydrated } = useAuthStore.getState();

        console.log("🛡️ RequireAuth check:", { isHydrated, hasUser: !!user });

        if (isHydrated && !user) {
            console.log("❌ Redirecting to login...");
            router.replace("/auth");
        }
    }, [mounted, router]);

    // ✅ Show nothing until mounted on client
    if (!mounted) {
        return null;
    }

    // ✅ Wait for hydration
    if (!isHydrated) {
        console.log("⏳ Waiting for hydration...");
        return null;
    }

    // ✅ Check authentication
    if (!user) {
        console.log("❌ No user after hydration");
        return null;
    }

    console.log("✅ User authenticated, rendering children");
    return <>{children}</>;
}