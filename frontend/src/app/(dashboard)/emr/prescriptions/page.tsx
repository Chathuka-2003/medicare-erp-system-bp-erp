"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// Prescription creation happens on the medical record detail page.
export default function NewPrescriptionRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const medicalRecordId = searchParams.get("medicalRecordId");

  useEffect(() => {
    if (medicalRecordId) {
      router.replace(`/emr/records/${medicalRecordId}`);
    } else {
      router.replace("/emr/records");
    }
  }, [medicalRecordId, router]);

  return null;
}