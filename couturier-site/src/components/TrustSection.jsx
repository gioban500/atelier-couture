export default function TrustSection() {
  return (
    <section className="bg-[#0F172A] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white mb-12 text-center">
          Pourquoi Me Choisir?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-[#D4AF37] transition">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Expertise Reconnue</h3>
            <p className="text-slate-300">
              15 ans de savoir-faire en couture artisanale et sur-mesure
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-[#D4AF37] transition">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Précision Garantie</h3>
            <p className="text-slate-300">
              Chaque création ajustée à vos mesures exactes pour un résultat parfait
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-[#D4AF37] transition">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Qualité Premium</h3>
            <p className="text-slate-300">
              Tissus nobles et finitions impeccables pour des pièces intemporelles
            </p>
          </div>
        </div>

        {/* CTA vers page About */}
        <div className="text-center">
          <a href="/about">
            <button className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded font-semibold hover:bg-[#D4AF37] hover:text-slate-950 transition">
              En Savoir Plus Sur Mon Parcours
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}