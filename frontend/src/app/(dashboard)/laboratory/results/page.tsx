import { redirect } from "next/navigation";

// Results are viewed inline within their lab order (LabResultView component),
// since the backend has no standalone "all results" endpoint.
export default function LabResultsPage() {
  redirect("/laboratory/orders");
}
