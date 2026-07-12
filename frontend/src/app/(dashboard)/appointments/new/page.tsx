import { AppointmentForm } from "@/components/appointments/AppointmentForm";

export default function NewAppointmentPage() {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-semibold">New Appointment</h1>
            <AppointmentForm />
        </div>
    );
}