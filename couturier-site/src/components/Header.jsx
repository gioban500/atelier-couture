import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === '/admin';
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <header className="bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold text-[#D4AF37]">
          ATELIER COUTURE
        </Link>

        {!isAdmin && (
          <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <a href="/#services" className="hover:text-[#D4AF37] transition">Services</a>
            <a href="/#portfolio" className="hover:text-[#D4AF37] transition">Portfolio</a>
            <a href="/about" className="hover:text-[#D4AF37] transition">À Propos</a>
            <a href="/#contact" className="hover:text-[#D4AF37] transition">Contact</a>
          </div>
        )}

        {isAdmin && token ? (
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition text-sm"
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/devis" className="bg-[#D4AF37] text-slate-950 font-bold px-5 py-2.5 rounded text-xs uppercase tracking-wider hover:bg-[#b8952b] transition">
            Devis Gratuit
          </Link>
        )}
      </nav>
    </header>
  );
}