import { DispenseForm } from "@/components/pharmacy/DispenseForm";

export default function NewDispensePage() {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-semibold">New Drug Dispense</h1>
            <DispenseForm />
        </div>
    );
}