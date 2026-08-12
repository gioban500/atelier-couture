import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // État pour la modale "Mot de passe oublié"
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('mangavolmet@gmail.com');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(null);

  const navigate = useNavigate();

  // Soumission Connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identifiants incorrects');
      }

      // Stocker le token en localStorage
      localStorage.setItem('adminToken', data.token);

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Envoi de l'email de réinitialisation
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la demande');
      }

      setForgotMessage({
        type: 'success',
        text: '✉️ Le lien de réinitialisation a été envoyé avec succès !',
      });
    } catch (err) {
      setForgotMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-slate-800/40 border border-slate-700 backdrop-blur-sm p-8 rounded-lg max-w-md w-full">
          <h2 className="text-3xl font-serif font-bold text-white mb-6 text-center">
            Connexion Admin
          </h2>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@couture.tg"
                className="w-full px-4 py-3 rounded border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 transition outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-[#D4AF37]">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-slate-400 hover:text-[#D4AF37] transition underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 transition outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0F172A] py-3 rounded font-semibold hover:bg-[#b8952b] transition disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            Identifiants de test: admin@couture.tg / AdminPassword123!
          </p>
        </div>
      </div>

      {/* MODALE MOT DE PASSE OUBLIÉ */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F172A] border border-slate-700 rounded-lg p-6 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Réinitialiser le mot de passe
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Un lien d'accès vous sera envoyé sur l'adresse email administrateur.
            </p>

            {forgotMessage && (
              <div
                className={`p-3 rounded mb-4 text-xs ${
                  forgotMessage.type === 'success'
                    ? 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-300'
                    : 'bg-red-900/30 border border-red-500/50 text-red-400'
                }`}
              >
                {forgotMessage.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1">
                  Email de destination
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotMessage(null);
                  }}
                  className="w-1/2 bg-slate-800 text-slate-300 py-2 rounded text-sm hover:bg-slate-700 transition"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-1/2 bg-[#D4AF37] text-[#0F172A] py-2 rounded font-semibold text-sm hover:bg-[#b8952b] transition disabled:opacity-50"
                >
                  {forgotLoading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}