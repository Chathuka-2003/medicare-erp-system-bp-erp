import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-sm">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-400">Effective Date: July 12, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-650 leading-relaxed">
          <p>
            By accessing or using the MediCare ERP platform, you agree to comply with and be bound by the following Terms of Service. Please review them carefully.
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">1. Use of the ERP Platform</h2>
          <p>
            MediCare ERP is a clinical operations management software. Authorized users must:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ensure all credentials are kept confidential and not shared among staff members.</li>
            <li>Record accurate medical details, patient registration values, and billing metrics.</li>
            <li>Maintain proper authorization levels before creating invoices or dispensing medications.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">2. Intellectual Property</h2>
          <p>
            All software components, logo marks, dashboard configurations, database engines, and design styles are the exclusive intellectual property of the MediCare developer team.
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">3. Service Disclaimers</h2>
          <p>
            MediCare ERP is provided "as is" and "as available". We do not guarantee uninterrupted or error-free operations. System maintenance might periodically affect platform connectivity.
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">4. Termination of Accounts</h2>
          <p>
            Administrators hold the right to deactivate staff accounts that breach local clinical standards, show suspicious activity, or fail to present valid license numbers.
          </p>
        </section>
      </div>
    </main>
  );
}
