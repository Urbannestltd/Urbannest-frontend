import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import { LuArrowLeft, LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MainButton } from "./button";
import { cn } from "@/utils/lib";
import { useMemo } from "react";

type PaginatorProps = {
    current: number;
    total: number;
    onChange: (page: number) => void;
    maxButtons?: number;
};

const makeWindow = (current: number, total: number, max = 6) => {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = start + max - 1;

    if (end > total) {
        end = total;
        start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function Paginator({
    current,
    total,
    onChange,
    maxButtons = 6,
}: PaginatorProps) {
    if (!total || total <= 1) return null;

    const pages = useMemo(
        () => makeWindow(current, total, maxButtons),
        [current, total, maxButtons]
    );

    const safeChange = (page: number) => {
        const next = Math.min(Math.max(page, 1), total);
        if (next !== current) onChange(next);
    };

    return (
        <Flex align="center" justify="center" gap={4} mt={10} aria-label="Pagination">
            <Button
                disabled={current <= 1}
                onClick={() => safeChange(current - 1)}
                variant="outline"
                className="satoshi-medium text-button-primary"
            >
                <LuChevronLeft size={18} />Previous
            </Button>

            <HStack gap={4}>
                {pages.map((p) => (
                    <Button
                        key={p}
                        onClick={() => safeChange(p)}
                        className={cn(
                            "px-3 py-2 rounded-lg bg-[#F5F8FF] text-[15px] font-medium",
                            p === current
                                ? "bg-button-primary text-white"
                                : "text-text-neutral  hover:bg-[#F2F4F7]"
                        )}
                        aria-current={p === current ? "page" : undefined}
                    >
                        {p}
                    </Button>
                ))}
            </HStack>

            <Button
                disabled={current >= total}
                onClick={() => safeChange(current + 1)}
                variant="outline"
                className="satoshi-medium"
            >
                Next <LuChevronRight size={18} />
            </Button>
        </Flex>
    );
}
