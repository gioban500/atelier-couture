import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TrustSection from '../components/TrustSection';
import Portfolio from '../components/Portfolio';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <TrustSection />
      <Portfolio />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}