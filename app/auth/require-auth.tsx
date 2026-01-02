"use client";

import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push("/auth");
    }, [user, router]);

    if (!user) return null;

    return <>{children}</>;
}
