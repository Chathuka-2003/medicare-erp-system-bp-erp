"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { appointmentApi } from "@/lib/api/appointment.api";
import { AppointmentStatus, Appointment } from "@/types/appointment.types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Stethoscope, Eye, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Colors corresponding to each status
const STATUS_COLORS: Record<AppointmentStatus, { bg: string; text: string; dot: string; border: string }> = {
  SCHEDULED:   { bg: "bg-blue-50/70 hover:bg-blue-100/80", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  CONFIRMED:   { bg: "bg-indigo-50/70 hover:bg-indigo-100/80", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200" },
  IN_PROGRESS: { bg: "bg-amber-50/70 hover:bg-amber-100/80", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  COMPLETED:   { bg: "bg-emerald-50/70 hover:bg-emerald-100/80", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  CANCELLED:   { bg: "bg-red-50/70 hover:bg-red-100/80", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" },
  NO_SHOW:     { bg: "bg-orange-50/70 hover:bg-orange-100/80", text: "text-orange-700", dot: "bg-orange-500", border: "border-orange-200" },
  RESCHEDULED: { bg: "bg-purple-50/70 hover:bg-purple-100/80", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" },
};

export function AppointmentCalendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { data: appointmentsResponse, isLoading } = useQuery({
    queryKey: ["appointments-calendar-view"],
    queryFn: () => appointmentApi.getAll({ page: 0, size: 500, sortBy: "appointmentDate", sortDirection: "ASC" }),
  });

  const appointments = appointmentsResponse?.content ?? [];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  
  const prevMonthDaysCount = firstDayOfMonth;
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from({ length: prevMonthDaysCount }, (_, i) => {
    return new Date(year, month - 1, daysInPrevMonth - prevMonthDaysCount + i + 1);
  });

  const totalBoxes = 42;
  const nextMonthDaysCount = totalBoxes - (prevMonthDays.length + days.length);
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => {
    return new Date(year, month + 1, i + 1);
  });

  const allCalendarCells = [...prevMonthDays, ...days, ...nextMonthDays];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.appointmentDate);
      return isSameDay(apptDate, date);
    });
  };

  const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid Card */}
        <Card className="flex-1 overflow-hidden shadow-md border-slate-100 rounded-2xl bg-gradient-to-b from-white to-slate-50/30">
          <CardHeader className="bg-white border-b border-slate-100 pb-5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shadow-inner">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-slate-800">
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Monthly overview of clinical schedules
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-semibold text-slate-700 border-slate-200 hover:bg-slate-50" onClick={handleToday}>
                  Today
                </Button>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                  <Button variant="ghost" size="icon" className="h-9 w-9 border-r border-slate-100 rounded-none hover:bg-slate-50" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-slate-50" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Status Guide */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Scheduled</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Confirmed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> In Progress</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Cancelled</span>
            </div>
          </CardHeader>

          <CardContent className="p-0 bg-white">
            {isLoading ? (
              <div className="py-32 flex justify-center"><LoadingSpinner /></div>
            ) : (
              <div className="grid grid-cols-7 border-b border-slate-100">
                {/* Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-slate-400 py-3 bg-slate-50/50 border-r border-b border-slate-100 last:border-r-0 select-none">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {allCalendarCells.map((date, index) => {
                  const dayAppointments = getAppointmentsForDay(date);
                  const isCurrentMonth = date.getMonth() === month;
                  const isTodayCell = isSameDay(date, new Date());
                  const isSelectedCell = selectedDate && isSameDay(date, selectedDate);

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "min-h-[110px] p-2.5 border-r border-b border-slate-100 last:border-r-0 cursor-pointer transition-all duration-200 flex flex-col justify-between relative",
                        !isCurrentMonth && "bg-slate-50/30 text-slate-300",
                        isSelectedCell && "ring-2 ring-primary ring-inset bg-indigo-50/10 z-10",
                        isTodayCell && "bg-indigo-50/30 font-bold",
                        !isSelectedCell && "hover:bg-slate-50/80"
                      )}
                    >
                      {/* Top Row: Date labels */}
                      <div className="flex justify-between items-center">
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[24px] h-[24px]",
                          isTodayCell && "bg-primary text-white shadow-md shadow-primary/20",
                          isSelectedCell && !isTodayCell && "text-primary bg-primary/10"
                        )}>
                          {date.getDate()}
                        </span>
                        {dayAppointments.length > 0 && (
                          <Badge variant="secondary" className="text-[10px] font-bold bg-slate-100/80 hover:bg-slate-100/80 text-slate-600 px-1.5 py-0">
                            {dayAppointments.length}
                          </Badge>
                        )}
                      </div>

                      {/* Day Grid Appointments */}
                      <div className="space-y-1 mt-3 flex-1 flex flex-col justify-end">
                        {dayAppointments.slice(0, 3).map((appt) => {
                          const statusStyle = STATUS_COLORS[appt.status] || { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500", border: "border-slate-200" };
                          return (
                            <div
                              key={appt.id}
                              className={cn(
                                "text-[9px] font-bold py-0.5 px-2 rounded-lg border shadow-sm truncate max-w-full flex items-center gap-1.5 transition-transform hover:scale-[1.02]",
                                statusStyle.bg,
                                statusStyle.text,
                                statusStyle.border
                              )}
                              title={`${appt.patientName} (${appt.status})`}
                            >
                              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusStyle.dot)} />
                              <span className="truncate">{appt.patientName}</span>
                            </div>
                          );
                        })}
                        {dayAppointments.length > 3 && (
                          <div className="text-[9px] text-center font-bold text-indigo-600 bg-indigo-50/50 py-0.5 rounded-lg border border-indigo-100/30">
                            + {dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Day Agenda Sidebar */}
        <Card className="w-full lg:w-[380px] shadow-md border-slate-100 rounded-2xl shrink-0 overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-5">
            <CardTitle className="text-base font-bold text-slate-800">Daily Agenda</CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-500 mt-1">
              {selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Select a date"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[580px] overflow-y-auto flex-1 bg-white">
            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground space-y-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                  <CalendarIcon className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-sm font-bold text-slate-700">No scheduled visits</p>
                <p className="text-xs max-w-[200px] mx-auto text-slate-400 leading-normal">There are no patient appointments scheduled for this day.</p>
              </div>
            ) : (
              selectedDayAppointments.map((appt) => {
                const statusStyle = STATUS_COLORS[appt.status] || { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500", border: "border-slate-200" };
                const timeStr = new Date(appt.appointmentDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div
                    key={appt.id}
                    onClick={() => router.push(`/appointments/${appt.id}`)}
                    className="border border-slate-150 rounded-2xl p-4 space-y-3 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 relative overflow-hidden bg-white group"
                  >
                    {/* Left Accent Color bar */}
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", statusStyle.dot)} />

                    <div className="flex justify-between items-center pl-2">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        <Clock className="h-3.5 w-3.5" /> {timeStr}
                      </span>
                      <span className={cn("text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border", statusStyle.bg, statusStyle.text, statusStyle.border)}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="pl-2 space-y-1.5">
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover:text-primary transition-colors">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <User className="h-3 w-3 text-slate-500" />
                        </div>
                        {appt.patientName}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Stethoscope className="h-3 w-3 text-slate-500" />
                        </div>
                        Dr. {appt.doctorName}
                      </div>
                    </div>

                    {appt.reason && (
                      <p className="text-xs pl-2 text-slate-400 line-clamp-1 border-t border-slate-50 pt-2.5">
                        {appt.reason}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
