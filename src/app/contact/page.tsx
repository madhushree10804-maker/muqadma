export default function Contact() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-cinzel text-gold-accent text-center">
          Contact Registry
        </h1>
        <div className="w-16 h-px bg-gold-muted mx-auto" />

        <div className="mt-12 text-center text-parchment/80 font-inter space-y-6">
          <p className="text-lg">
            For inquiries regarding MUQADMA 2026, please contact the Court Registry at St. Agnes College.
          </p>
          
          <div className="pt-8 space-y-4">
            <p className="font-cinzel text-xl text-ivory">St. Agnes College (Autonomous)</p>
            <p>Mangaluru</p>
            <p className="text-gold-muted text-sm tracking-widest uppercase pt-4">AIKYAM / AgnoFest 2026</p>
          </div>
        </div>
      </div>
    </main>
  );
}
