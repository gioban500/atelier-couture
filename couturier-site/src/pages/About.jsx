import Header from '../components/Header';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function About() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-serif font-bold mb-6">À Propos</h1>
          <p className="text-xl text-gray-300">
            Découvrez l'histoire et la passion derrière chaque création
          </p>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">Mon Histoire</h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Depuis plus de 15 ans, je suis passionnée par l'art de la couture artisanale. Ce qui a commencé comme une simple passion s'est transformé en une expertise reconnue, où chaque création raconte une histoire unique.
            </p>
            <p>
              Mes débuts ont été modestes, mais déterminés. J'ai appris auprès des meilleurs maîtres tailleurs, perfectionnant chaque technique, chaque point, chaque détail. Aujourd'hui, je maîtrise l'art du sur-mesure comme peu d'autres.
            </p>
            <p>
              Ce qui me différencie? C'est l'écoute. Je ne crée pas simplement des vêtements; je crée des extensions de votre personnalité. Chaque client est unique, chaque vision est précieuse, et c'est pourquoi je mets toute mon énergie dans la perfection.
            </p>
          </div>
        </div>
      </section>

      {/* EXPERTISE & VALEURS */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Mes Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-gray-800">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                Chaque point, chaque couture est une déclaration de qualité. L'excellence n'est pas une option, c'est une obligation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-gray-800">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Authenticité</h3>
              <p className="text-gray-600">
                Pas de raccourcis, pas de compromis. Je travaille avec les meilleurs matériaux et les techniques traditionnelles éprouvées.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-gray-800">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Passion</h3>
              <p className="text-gray-600">
                La passion est le cœur de mon travail. Elle se voit dans chaque création et se ressent au port.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Mon Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-800 mb-2">500+</div>
              <p className="text-gray-600 font-medium">Créations</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-800 mb-2">15</div>
              <p className="text-gray-600 font-medium">Ans d'Expertise</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-800 mb-2">100%</div>
              <p className="text-gray-600 font-medium">Client Satisfaits</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-800 mb-2">5★</div>
              <p className="text-gray-600 font-medium">Qualité Garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Prêt à collaborer?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Parlons de votre vision et transformons-la en réalité
          </p>
          <a href="/devis">
            <button className="bg-white text-gray-900 px-8 py-4 rounded font-semibold text-lg hover:bg-gray-100 transition">
              Commencer mon Projet
            </button>
          </a>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}