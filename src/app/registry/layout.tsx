import Link from "next/link";
import { 
  Scale, 
  Users, 
  FileText, 
  Calendar, 
  Eye, 
  Award, 
  Gavel, 
  Trophy, 
  History, 
  Settings 
} from "lucide-react";

export default function RegistryLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { name: "Dashboard", href: "/registry", icon: Scale },
    { name: "Teams", href: "/registry/teams", icon: Users },
    { name: "Case Files", href: "/registry/cases", icon: FileText },
    { name: "Court Schedule", href: "/registry/schedule", icon: Calendar },
    { name: "Reveal Monitor", href: "/registry/monitor", icon: Eye },
    { name: "Scoresheet", href: "/registry/scoresheet", icon: FileText },
    { name: "Results", href: "/registry/results", icon: Trophy },
    { name: "Audit Records", href: "/registry/audit", icon: History },
    { name: "Settings", href: "/registry/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-court-dark flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-court-charcoal border-r border-gold-muted/20 flex flex-col pt-24 px-6 pb-6">
        <div className="mb-12">
          <h2 className="text-xl font-cinzel text-gold-accent tracking-widest flex items-center gap-3">
            <Scale size={24} />
            Registry
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-inter uppercase tracking-widest text-parchment/70 hover:text-gold-accent hover:bg-court-navy transition-colors rounded-sm"
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-gold-muted/20 text-xs text-parchment/40 font-inter text-center">
          MUQADMA 2026 Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-8 pb-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
