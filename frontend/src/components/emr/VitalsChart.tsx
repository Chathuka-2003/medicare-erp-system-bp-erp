"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VitalsDto } from "@/types/emr.types";
import { Activity, Heart, Thermometer, Wind, Droplets, Scale } from "lucide-react";

interface VitalsChartProps {
  vitals?: VitalsDto;
}

function getBMI(weight?: number, height?: number): string | null {
  if (!weight || !height || height === 0) return null;
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  return bmi.toFixed(1);
}

function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
  if (bmi < 25)   return { label: "Normal",      color: "text-emerald-500" };
  if (bmi < 30)   return { label: "Overweight",  color: "text-amber-500" };
  return               { label: "Obese",         color: "text-red-500" };
}

function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  statusColor,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number;
  unit?: string;
  statusColor?: string;
}) {
  const hasValue = value !== undefined && value !== null && value !== "";
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 shadow-sm gap-1 min-w-[100px]">
      <div className={`rounded-full p-2 mb-1 ${statusColor ? statusColor : "bg-muted"}`}>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${!hasValue ? "text-muted-foreground" : ""}`}>
        {hasValue ? value : "—"}
        {hasValue && unit && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
        )}
      </p>
    </div>
  );
}

export function VitalsChart({ vitals }: VitalsChartProps) {
  const bmiValue = getBMI(vitals?.weight, vitals?.height);
  const bmiNum = bmiValue ? parseFloat(bmiValue) : null;
  const bmiCategory = bmiNum ? getBMICategory(bmiNum) : null;

  if (!vitals) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Vitals</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No vitals recorded for this visit.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <VitalCard icon={Thermometer} label="Temperature" value={vitals.temperature} unit="°C" />
          <VitalCard icon={Heart}       label="Heart Rate"  value={vitals.heartRate}   unit="bpm" />
          <VitalCard icon={Activity}    label="Blood Pressure" value={vitals.bloodPressure} unit="mmHg" />
          <VitalCard icon={Wind}        label="Resp. Rate"  value={vitals.respiratoryRate} unit="/min" />
          <VitalCard icon={Droplets}    label="SpO₂"        value={vitals.oxygenSaturation} unit="%" />
          <VitalCard icon={Scale}       label="Weight"      value={vitals.weight}       unit="kg" />
          <VitalCard icon={Scale}       label="Height"      value={vitals.height}       unit="cm" />
          {bmiValue && (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 shadow-sm gap-1 min-w-[100px]">
              <div className="rounded-full bg-muted p-2 mb-1">
                <Scale className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">BMI</p>
              <p className="text-xl font-bold tracking-tight">{bmiValue}</p>
              {bmiCategory && (
                <Badge variant="outline" className={`text-xs ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
