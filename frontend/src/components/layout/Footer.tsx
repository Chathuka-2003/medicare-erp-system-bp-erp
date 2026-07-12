"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 bg-card/30 py-4 px-6 md:px-8 text-center text-xs text-muted-foreground">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© {currentYear} MediCare ERP. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}
