"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { StockLevelBadge } from "./StockLevelBadge";
import { Medicine } from "@/types/pharmacy.types";
import { formatCurrency } from "@/lib/utils/format";
import { Pencil, Trash2, PackagePlus } from "lucide-react";

interface MedicineTableProps {
    medicines: Medicine[];
    onDelete: (id: string) => void;
}

export function MedicineTable({ medicines, onDelete }: MedicineTableProps) {
    const router = useRouter();

    if (medicines.length === 0) {
        return <EmptyState title="No medicines found" />;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.medicineCode}</TableCell>
                        <TableCell>{medicine.medicineName}</TableCell>
                        <TableCell>{medicine.category.replace("_", " ")}</TableCell>
                        <TableCell>{formatCurrency(medicine.unitPrice)}</TableCell>
                        <TableCell><StockLevelBadge totalStock={medicine.totalStock} /></TableCell>
                        <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/pharmacy/medicines/${medicine.id}`)}>
                                <PackagePlus className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/pharmacy/medicines/${medicine.id}/edit`)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(medicine.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}