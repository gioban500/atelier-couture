import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (newPassword !== confirmPassword) {
    setError('Les mots de passe ne correspondent pas.');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token, 
        password: newPassword,    // 👈 Pour les backends qui attendent "password"
        newPassword: newPassword  // 👈 Pour les backends qui attendent "newPassword"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Lien invalide ou expiré');
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2500);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lien invalide ou expiré');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-slate-800/40 border border-slate-700 backdrop-blur-sm p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-serif font-bold text-white mb-6 text-center">
            Nouveau mot de passe
          </h2>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {success ? (
            <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300 p-4 rounded text-center text-sm">
              ✅ Mot de passe réinitialisé avec succès !<br />
              <span className="text-xs text-slate-400">Redirection vers la page de connexion...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded border border-slate-700 bg-slate-900/50 text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded border border-slate-700 bg-slate-900/50 text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-[#D4AF37] text-[#0F172A] py-3 rounded font-semibold hover:bg-[#b8952b] transition disabled:opacity-50"
              >
                {loading ? 'Mise à jour...' : 'Valider le mot de passe'}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}