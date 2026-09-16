export default function Rules() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-cinzel text-gold-accent text-center">
          Official Rules
        </h1>
        <div className="w-16 h-px bg-gold-muted mx-auto" />

        <div className="space-y-12 mt-12 text-parchment/90 font-inter">
          
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-cinzel text-gold-accent border-b border-gold-muted/30 pb-2">
              I. Team Composition and Structure
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Team Size:</strong> Each participating team shall consist of exactly two (2) members.</li>
              <li><strong>Competition Format:</strong> The proceedings shall be conducted over two (2) distinct rounds.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-cinzel text-gold-accent border-b border-gold-muted/30 pb-2">
              II. General Directives
            </h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Case Allocation:</strong> The official moot proposition (case study) shall be distributed to all participating teams one (1) day prior to the event, specifically by 9:00 a.m. on Wednesday.</li>
              <li><strong>Team Pairing:</strong> Each respective case study shall be assigned to two opposing teams.</li>
              <li><strong>Representation:</strong> Teams shall be designated to argue on behalf of either the Plaintiff or the Defendant, strictly in accordance with the allotted order.</li>
              <li><strong>Mandatory Participation:</strong> Active participation during the proceedings is mandatory for both members of the team.</li>
              <li><strong>Preparation Standards:</strong> Participants are required to exhibit thorough preparation, demonstrating comprehensive knowledge of the factual matrix, statutory provisions, relevant judicial precedents, and all connected legal information pertinent to the case.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-cinzel text-gold-accent border-b border-gold-muted/30 pb-2">
              III. Round 1: Case Presentation
            </h2>
            <div className="bg-court-charcoal/50 border border-gold-muted/30 p-6 rounded-sm space-y-3">
              <p><strong>Time Allocation:</strong> Five (5) minutes per team.</p>
              <p><strong>Procedure:</strong> Counsels must formally present the facts and outline the primary issues of the case.</p>
              <p><strong>Arguments:</strong> Teams must advance clear and persuasive oral arguments in favor of their designated party.</p>
              <p><strong>Substantiation:</strong> All submissions must be strictly supported by relevant legal principles, statutes, and facts.</p>
              <p><strong>Speaking Requirement:</strong> Both team members are required to address the bench during this round.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-cinzel text-gold-accent border-b border-gold-muted/30 pb-2">
              IV. Round 2: Judges' Questions
            </h2>
            <div className="bg-court-charcoal/50 border border-gold-muted/30 p-6 rounded-sm space-y-3">
              <p><strong>Time Allocation:</strong> Up to five (5) minutes per team.</p>
              <p><strong>Procedure:</strong> The presiding bench will direct questions to the counsels regarding the facts of the case and the legal arguments presented.</p>
              <p><strong>Preparedness:</strong> Participants are expected to anticipate inquiries and possess a thorough understanding of all relevant and connected information.</p>
              <p><strong>Demeanor:</strong> Responses to the bench must be articulated with clarity, logical coherence, and confidence.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-cinzel text-gold-accent border-b border-gold-muted/30 pb-2">
              V. Awards
            </h2>
            <p className="mb-2">The competition shall confer the following honors:</p>
            <ul className="list-disc pl-5 space-y-2 text-ivory font-cinzel tracking-widest">
              <li>Best Plaintiff Team</li>
              <li>Best Defendant Team</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-cinzel text-gold-accent border-b border-gold-muted/30 pb-2">
              VI. Finality of Decisions
            </h2>
            <p className="italic text-parchment/70 border-l-2 border-gold-accent pl-4 py-2">
              The verdict and scoring rendered by the panel of judges shall be strictly final and binding upon all participants.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
