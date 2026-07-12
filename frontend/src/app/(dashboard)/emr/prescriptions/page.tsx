"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function NewPrescriptionRedirectContent() {
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

export default function NewPrescriptionRedirectPage() {
  return (
    <Suspense fallback={null}>
      <NewPrescriptionRedirectContent />
    </Suspense>
  );
}
