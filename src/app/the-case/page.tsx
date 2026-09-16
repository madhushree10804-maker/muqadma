export default function TheCase() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-cinzel text-gold-accent">
            The Case
          </h1>
          <div className="w-16 h-px bg-gold-muted mx-auto" />
          <p className="text-lg text-parchment/80 font-playfair italic">
            "The allocation is sealed until the official release."
          </p>
        </div>

        <div className="space-y-16 mt-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-cinzel text-parchment">I — REVEAL</h2>
            <h3 className="text-gold-muted uppercase tracking-widest text-sm">The Case</h3>
            <p className="text-parchment/70 max-w-2xl mx-auto">
              Your official case file and side (Plaintiff/Defendant) will be revealed exactly at the scheduled release time. Access is strictly controlled through the Court Registry.
            </p>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-cinzel text-parchment">II — ARGUE</h2>
            <h3 className="text-gold-muted uppercase tracking-widest text-sm">The Courtroom</h3>
            <p className="text-parchment/70 max-w-2xl mx-auto">
              Present your case before the judges. You will face rigorous questioning and must defend your position using established legal precedents and sound logic.
            </p>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-cinzel text-parchment">III — VERDICT</h2>
            <h3 className="text-gold-muted uppercase tracking-widest text-sm">The Results</h3>
            <p className="text-parchment/70 max-w-2xl mx-auto">
              The final verdict is sealed until the conclusion of the event. The judges' decision is final and binding.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
