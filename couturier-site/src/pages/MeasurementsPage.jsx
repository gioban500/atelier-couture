import { useState, useEffect } from 'react';
import MeasurementModal from '../components/MeasurementModal';
import MeasurementForm from '../components/MeasurementForm';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MeasurementsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Rechargement déclenché par les actions utilisateur (création, modale)
  const fetchMeasurements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/measurements`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial totalement isolé pour satisfaire le linter ESLint
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/measurements`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setClients(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/measurements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setLoading(true);
        fetchMeasurements();
      } else {
        alert('Erreur lors de la création');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#0b1329]">Gestion des Mesures</h1>
        <button onClick={() => setShowCreateModal(true)} className="bg-[#0b1329] text-[#D4AF37] px-4 py-2 rounded-[6px] text-sm font-semibold hover:bg-[#121d3b]">
          ➕ Nouveau Client
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Chargement...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-[8px] border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0b1329] text-white border-b border-[#D4AF37]/30">
                <th className="p-3">Nom</th>
                <th className="p-3">Stature</th>
                <th className="p-3">Poitrine</th>
                <th className="p-3">Taille</th>
                <th className="p-3">Bassin</th>
                <th className="p-3 text-center">Photo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id} onClick={() => setSelectedClient(c)} className="hover:bg-slate-50 cursor-pointer transition">
                  <td className="p-3 font-semibold text-[#0b1329]">{c.client_name}</td>
                  <td className="p-3 text-slate-600">{c.height ? `${c.height} cm` : '—'}</td>
                  <td className="p-3 text-slate-600">{c.chest ? `${c.chest} cm` : '—'}</td>
                  <td className="p-3 text-slate-600">{c.waist ? `${c.waist} cm` : '—'}</td>
                  <td className="p-3 text-slate-600">{c.hips ? `${c.hips} cm` : '—'}</td>
                  <td className="p-3 text-center">{c.photo_url ? '✅' : '❌'}</td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-400">Aucune mesure enregistrée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedClient && (
        <MeasurementModal client={selectedClient} onClose={() => setSelectedClient(null)} onRefresh={fetchMeasurements} />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[8px] max-w-3xl w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-[#0b1329] border-b pb-2">Ajouter un nouveau client</h2>
            <MeasurementForm onSave={handleCreate} onCancel={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}