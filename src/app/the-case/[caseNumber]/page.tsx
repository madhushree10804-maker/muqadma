import { createAdminClient } from "@/lib/supabase";
import { Scale, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import crypto from "crypto";
import Link from "next/link";

export default async function CaseDetails({ 
  params,
  searchParams
}: { 
  params: Promise<{ caseNumber: string }>,
  searchParams: Promise<{ token?: string }>
}) {
  const supabase = createAdminClient();
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const caseNum = parseInt(resolvedParams.caseNumber, 10);
  if (isNaN(caseNum)) notFound();

  // 1. Check for token
  const token = resolvedSearch.token;
  if (!token) return <UnauthorizedMessage />;

  const [teamId, signature] = token.split(".");
  if (!teamId || !signature) return <UnauthorizedMessage />;

  // 2. Cryptographic HMAC Verification
  const expectedSignature = crypto.createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(teamId).digest("hex");
  if (signature !== expectedSignature) return <UnauthorizedMessage />;

  // 3. Verify Team Allocation matches requested Case Number (Unless Admin)
  if (teamId !== "ADMIN") {
    const { data: allocation } = await supabase.from("allocations").select("case_id").eq("team_id", teamId).single();
    if (!allocation) return <UnauthorizedMessage />;

    const { data: allocatedCase } = await supabase.from("cases").select("case_number").eq("id", allocation.case_id).single();
    if (!allocatedCase || allocatedCase.case_number !== caseNum) return <UnauthorizedMessage />;
  }

  // 4. Fetch the requested Case details
  const { data: caseFile, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_number", caseNum)
    .single();

  if (error || !caseFile) {
    console.error("Case fetch error:", error);
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-4xl mx-auto relative z-10">
      <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <p className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-red-500 uppercase font-inter flex flex-col md:flex-row items-center justify-center gap-2">
          <Scale size={16} className="hidden md:block" /> 
          <span>CASE STUDY {caseFile.case_number}</span>
          <span className="hidden md:inline">—</span>
          <span>{caseFile.theme}</span>
        </p>
        <h1 className="text-3xl md:text-5xl font-cinzel text-gold-accent leading-snug px-4 md:px-0">
          {caseFile.title}
        </h1>
        <div className="w-16 md:w-24 h-px bg-gold-muted mx-auto" />
      </div>

      <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
        
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-cinzel text-ivory flex items-center gap-3 border-b border-gold-muted/30 pb-4">
            <Scale className="text-gold-muted" size={24} />
            Facts of the Case
          </h2>
          <div className="prose prose-invert prose-p:font-playfair prose-p:text-base md:prose-p:text-lg prose-p:text-parchment/80 prose-p:leading-relaxed max-w-none whitespace-pre-wrap">
            {caseFile.facts || "Facts not provided."}
          </div>
        </section>

        <section className="bg-court-charcoal/80 border border-gold-muted/20 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-gold-muted font-inter">Plaintiff</h3>
            <p className="font-playfair text-lg md:text-xl text-ivory">{caseFile.plaintiff}</p>
          </div>
          <div className="space-y-2 md:text-right border-t md:border-t-0 md:border-l border-gold-muted/20 pt-4 md:pt-0 pl-0 md:pl-8">
            <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-gold-muted font-inter">Defendant</h3>
            <p className="font-playfair text-lg md:text-xl text-ivory">{caseFile.defendant}</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-cinzel text-ivory flex items-center gap-3 border-b border-gold-muted/30 pb-4">
            <Scale className="text-gold-muted" size={24} />
            Issues for Determination
          </h2>
          <div className="bg-black/30 p-6 md:p-8 border border-gold-muted/10">
            <div className="font-playfair text-base md:text-lg text-parchment/90 leading-relaxed whitespace-pre-wrap">
              {caseFile.issues || "Issues not formulated yet."}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

function UnauthorizedMessage() {
  return (
    <main className="min-h-[calc(100vh-80px)] mt-20 flex flex-col items-center justify-center px-6 relative z-10 w-full">
      <div className="bg-court-charcoal/80 border border-red-900/50 p-6 md:p-12 space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl max-w-xl w-full mx-auto text-center">
        <ShieldAlert className="text-red-500 mx-auto" size={48} />
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-cinzel text-red-500 uppercase tracking-widest">Access Denied</h1>
          <p className="text-sm md:text-base text-parchment/70 font-inter">
            This Court Record is sealed. You do not have authorization to view this case, or your secure session token is missing. 
            Teams may only view the case file that has been cryptographically allocated to them by the Court Registry.
          </p>
        </div>
        <Link 
          href="/know-your-case"
          className="inline-block px-6 md:px-8 py-3 md:py-4 border border-gold-muted/50 text-gold-muted hover:bg-gold-muted hover:text-court-dark tracking-widest uppercase text-xs md:text-sm font-bold transition-colors"
        >
          Return Back
        </Link>
      </div>
    </main>
  );
}
