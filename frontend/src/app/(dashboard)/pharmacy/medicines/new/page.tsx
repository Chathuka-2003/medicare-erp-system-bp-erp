import { MedicineForm } from "@/components/pharmacy/MedicineForm";

export default function NewMedicinePage() {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-semibold">New Medicine</h1>
            <MedicineForm />
        </div>
    );
}