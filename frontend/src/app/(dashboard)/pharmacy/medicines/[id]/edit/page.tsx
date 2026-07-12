"use client";

import { useParams } from "next/navigation";
import { useMedicine } from "@/hooks/usePharmacy";
import { MedicineForm } from "@/components/pharmacy/MedicineForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditMedicinePage() {
    const params = useParams();
    const { data: medicine, isLoading } = useMedicine(params.id as string);

    if (isLoading) return <LoadingSpinner />;
    if (!medicine) return <p className="p-6">Medicine not found.</p>;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-semibold">Edit Medicine</h1>
            <MedicineForm medicine={medicine} />
        </div>
    );
}