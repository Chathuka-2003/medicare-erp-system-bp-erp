"use client";

import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default function AppointmentCalendarPage() {
    const router = useRouter();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <button
                        onClick={() => router.push(ROUTES.APPOINTMENTS)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to List
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight mt-1">Appointment Calendar</h1>
                </div>
            </div>

            <AppointmentCalendar />
        </div>
    );
}
