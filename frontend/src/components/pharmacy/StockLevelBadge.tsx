import { StatusBadge } from "@/components/common/StatusBadge";

interface StockLevelBadgeProps {
    totalStock: number;
    lowStockThreshold?: number;
}

export function StockLevelBadge({ totalStock, lowStockThreshold = 10 }: StockLevelBadgeProps) {
    if (totalStock <= 0) {
        return <StatusBadge label="Out of Stock" variant="destructive" />;
    }
    if (totalStock <= lowStockThreshold) {
        return <StatusBadge label={`Low Stock (${totalStock})`} variant="warning" />;
    }
    return <StatusBadge label={`${totalStock} in stock`} variant="success" />;
}