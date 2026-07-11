import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalsDto } from "@/types/emr.types";

interface VitalsChartProps {
  vitals?: VitalsDto;
}

export function VitalsChart({ vitals }: VitalsChartProps) {
  if (!vitals) {
    return (
      <Card>
        <CardHeader><CardTitle>Vitals</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No vitals recorded for this visit.</p></CardContent>
      </Card>
    );
  }

  const items = [
    { label: "Temperature", value: vitals.temperature, unit: "°C" },
    { label: "Heart Rate", value: vitals.heartRate, unit: "bpm" },
    { label: "Blood Pressure", value: vitals.bloodPressure, unit: "mmHg" },
    { label: "Weight", value: vitals.weight, unit: "kg" },
    { label: "Height", value: vitals.height, unit: "cm" },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Vitals</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border p-3 text-center">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-lg font-semibold">
              {item.value !== undefined && item.value !== null ? item.value : "—"}
              {item.value ? <span className="ml-1 text-xs font-normal text-muted-foreground">{item.unit}</span> : null}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}