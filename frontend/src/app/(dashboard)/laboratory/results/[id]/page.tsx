"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// [id] here is treated as a labOrderId, since results have no standalone detail view.
export default function LabResultRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/laboratory/orders/${params.id}`);
  }, [params.id, router]);

  return null;
}
