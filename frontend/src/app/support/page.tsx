import { ArrowLeft, Phone, Mail, HelpCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-sm">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Support Centre</h1>
          <p className="text-xs text-muted-foreground">MediCare ERP Customer Support & Helpdesk</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-100">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary mb-2">
                <Phone className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-slate-800">Phone Support</CardTitle>
              <CardDescription className="text-xs">Immediate operational assistance</CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-semibold text-slate-700">
              <a href="tel:+94112345678" className="hover:text-primary transition-colors text-lg font-black block">
                +94 11 234 5678
              </a>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Hours: 24/7 Priority Emergency Care Hotline</span>
            </CardContent>
          </Card>

          <Card className="border border-slate-100">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary mb-2">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-slate-800">Email Support</CardTitle>
              <CardDescription className="text-xs">Technical audits and account requests</CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-semibold text-slate-700">
              <a href="mailto:support@medicare.lk" className="hover:text-primary transition-colors text-lg font-black block">
                support@medicare.lk
              </a>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Expected response time: within 2 hours</span>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4 border-t pt-8 border-slate-100 text-sm text-slate-650">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-850">How do I request staff access?</h3>
              <p className="text-slate-500">Administrators configure profile permissions from the main dashboard. Clinicians must present their government medical registration license during request creation.</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-850">Is my medical data secure?</h3>
              <p className="text-slate-500">Yes. MediCare ERP works with high-level access security protocols that comply with modern health data security recommendations.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
