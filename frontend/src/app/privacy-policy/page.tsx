import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-sm">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: July 12, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-650 leading-relaxed">
          <p>
            Welcome to MediCare ERP. We are committed to protecting the privacy and security of your personal and health-related data. This Privacy Policy explains how we collect, use, and safeguard information within our clinical ERP platform.
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">1. Information We Collect</h2>
          <p>
            MediCare ERP operates as an administrative and clinical hub. We process:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Patient Demographics & Medical Records:</strong> First name, last name, phone, age, gender, blood group, allergies, vitals, and medical histories.</li>
            <li><strong>Staff Records:</strong> Name, specialization, license numbers, email address, role, and department.</li>
            <li><strong>Financial Invoicing:</strong> Invoice breakdowns, total amounts, balance states, and payment history.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">2. How We Use Information</h2>
          <p>
            All data is processed strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Facilitate scheduling of medical appointments.</li>
            <li>Enable clinicians to log and access electronic medical records (EMR).</li>
            <li>Manage pharmacy inventory dispense flows, ward bed allocations, and lab orders.</li>
            <li>Coordinate insurance claims and billings.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">3. HIPAA & Regulatory Compliance</h2>
          <p>
            Our software implements role-based access control (RBAC). Standard staff members, physicians, laboratory technicians, and billing departments can only view fields relevant to their operational duties. All patient health records are encrypted at rest and in transit.
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-6 border-b pb-2">4. Support Contact</h2>
          <p>
            If you have questions about data protection or compliance, reach out to the system administrator or contact the team at <strong>+94 11 234 5678</strong>.
          </p>
        </section>
      </div>
    </main>
  );
}
