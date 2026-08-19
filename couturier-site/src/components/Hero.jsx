import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gray-950 px-6 overflow-hidden">
      {/* Image de Fond Complexe */}
      <img 
        src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop" 
        alt="Atelier couture fond" 
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-40 contrast-110 opacity-40"
      />

      {/* Overlay Dégradé */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

      {/* Contenu Centré */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs tracking-widest uppercase mb-6">
          Savoir-Faire Artisanal
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight mb-6">
          L'Art de la Couture Sur-Mesure
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Transformez vos visions en créations d'exception. Une attention portée à chaque fil, pour une allure unique.
        </p>
        <Link to="/devis">
          <button className="inline-block bg-[#D4AF37] text-[#0F172A] hover:bg-[#b8952b] px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-wider shadow-xl transition transform hover:scale-105">
            Demander une Prestation
          </button>
        </Link>
      </div>
    </section>
  );
}