"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllergiesByPatient, useAddAllergy, useDeleteAllergy } from "@/hooks/useMedicalRecords";
import { AllergyRequest, AllergySeverity } from "@/types/emr.types";
import { Plus, Trash2, ShieldAlert } from "lucide-react";

const SEVERITY_COLORS: Record<AllergySeverity, string> = {
  MILD:     "bg-yellow-100 text-yellow-800 border-yellow-300",
  MODERATE: "bg-orange-100 text-orange-800 border-orange-300",
  SEVERE:   "bg-red-100 text-red-800 border-red-300",
};

interface AllergyPanelProps {
  patientId: string;
}

export function AllergyPanel({ patientId }: AllergyPanelProps) {
  const { data: allergies, isLoading } = useAllergiesByPatient(patientId);
  const addAllergy = useAddAllergy(patientId);
  const deleteAllergy = useDeleteAllergy(patientId);

  const [allergyName, setAllergyName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<AllergySeverity>("MILD");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!allergyName.trim()) return;
    const payload: AllergyRequest = { allergyName: allergyName.trim(), description: description.trim() || undefined, severity };
    await addAllergy.mutateAsync(payload);
    setAllergyName("");
    setDescription("");
    setSeverity("MILD");
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          Allergies
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Allergy
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                placeholder="Allergy name *"
                value={allergyName}
                onChange={(e) => setAllergyName(e.target.value)}
                id="allergy-name-input"
              />
              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="allergy-desc-input"
              />
              <Select value={severity} onValueChange={(v) => setSeverity(v as AllergySeverity)}>
                <SelectTrigger id="allergy-severity-select">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MILD">Mild</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="SEVERE">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={addAllergy.isPending || !allergyName.trim()}>
                {addAllergy.isPending ? "Saving..." : "Save Allergy"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Loading allergies...</p>}

        {!isLoading && (!allergies || allergies.length === 0) && !adding && (
          <p className="text-sm text-muted-foreground">No known allergies recorded.</p>
        )}

        <div className="space-y-2">
          {allergies?.map((allergy) => (
            <div
              key={allergy.id}
              className="flex items-center justify-between rounded-lg border bg-background px-4 py-2"
            >
              <div className="flex items-center gap-3">
                {allergy.severity && (
                  <Badge variant="outline" className={`text-xs ${SEVERITY_COLORS[allergy.severity]}`}>
                    {allergy.severity}
                  </Badge>
                )}
                <div>
                  <p className="text-sm font-medium">{allergy.allergyName}</p>
                  {allergy.description && (
                    <p className="text-xs text-muted-foreground">{allergy.description}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => deleteAllergy.mutate(allergy.id)}
                disabled={deleteAllergy.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
