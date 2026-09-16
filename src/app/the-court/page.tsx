import { Scale, Gavel, BookOpen } from "lucide-react";

export default function TheCourt() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto relative z-10">
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        <div className="text-center space-y-4 md:space-y-6">
          <p className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.4em] text-red-500 uppercase font-inter animate-pulse">Welcome to</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-cinzel text-gold-accent uppercase tracking-widest drop-shadow-[0_0_30px_rgba(197,169,106,0.3)]">
            The Court
          </h1>
          <div className="w-16 md:w-24 h-px bg-gold-muted mx-auto" />
          <p className="text-lg md:text-xl text-parchment/80 font-playfair italic max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
            MUQADMA 2026 is a premium Moot Court Competition conducted as part of AIKYAM at St. Agnes College (Autonomous), Mangaluru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
          <div className="bg-court-charcoal/80 border border-gold-muted/30 p-8 space-y-4 hover:bg-court-navy/80 transition-colors duration-500 group">
            <Scale size={32} className="text-gold-muted group-hover:text-gold-accent transition-colors" />
            <h3 className="text-2xl font-cinzel text-ivory">The Atmosphere</h3>
            <p className="text-parchment/60 font-inter text-sm leading-relaxed">
              Step into an environment meticulously designed to replicate the immense pressure and formal grandeur of an apex courtroom. Silence is demanded, protocol is strictly enforced, and every word you speak is scrutinized.
            </p>
          </div>

          <div className="bg-court-charcoal/80 border border-gold-muted/30 p-8 space-y-4 hover:bg-court-navy/80 transition-colors duration-500 group">
            <Gavel size={32} className="text-gold-muted group-hover:text-gold-accent transition-colors" />
            <h3 className="text-2xl font-cinzel text-ivory">The Bench</h3>
            <p className="text-parchment/60 font-inter text-sm leading-relaxed">
              The presiding judges consist of distinguished legal scholars and practitioners. They will interrupt, they will question, and they expect you to think on your feet with impeccable logical coherence.
            </p>
          </div>

          <div className="bg-court-charcoal/80 border border-gold-muted/30 p-8 space-y-4 hover:bg-court-navy/80 transition-colors duration-500 group">
            <BookOpen size={32} className="text-gold-muted group-hover:text-gold-accent transition-colors" />
            <h3 className="text-2xl font-cinzel text-ivory">The Challenge</h3>
            <p className="text-parchment/60 font-inter text-sm leading-relaxed">
              We invite only the sharpest legal minds. This competition is designed to test not only your knowledge of the law, but your ability to articulate complex legal doctrines with unyielding confidence.
            </p>
          </div>
        </div>

        <div className="bg-court-dark/80 border-l-4 border-red-900 p-8 md:p-12 mt-16">
          <h2 className="text-3xl font-cinzel text-gold-accent mb-6">Are you ready to take the stand?</h2>
          <p className="text-parchment/70 font-inter leading-relaxed max-w-3xl">
            Prepare your facts, study the precedents, and memorize your arguments. In this courtroom, there are no second chances. You must demonstrate a comprehensive knowledge of the factual matrix, statutory provisions, and relevant judicial precedents. The bench awaits your argument.
          </p>
        </div>

      </div>
    </main>
  );
}
