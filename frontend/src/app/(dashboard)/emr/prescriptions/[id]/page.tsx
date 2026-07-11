"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// [id] here is treated as a medicalRecordId, since prescriptions have no standalone detail view.
export default function PrescriptionRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/emr/records/${params.id}`);
  }, [params.id, router]);

  return null;
}