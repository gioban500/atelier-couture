import  { useState } from 'react';
import MeasurementForm from './MeasurementForm';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MeasurementModal({ client, onClose, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);

  if (!client) return null;

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/measurements/${client.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      alert('Mesures enregistrées !');
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-[8px] max-w-3xl w-full overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0b1329] text-white p-4 flex justify-between items-center border-b border-[#D4AF37]/30">
          <div>
            <h2 className="text-lg font-bold text-[#D4AF37]">{client.client_name}</h2>
            <p className="text-xs text-slate-300">Stature : {client.height ? `${client.height} cm` : 'Non renseignée'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isEditing ? (
            <MeasurementForm initialData={client} onSave={handleUpdate} onCancel={() => setIsEditing(false)} />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-[120px] h-[160px] bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {client.photo_url ? (
                    <img src={client.photo_url} alt="Client" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400 text-center p-2">Aucune photo</span>
                  )}
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1329] uppercase border-b border-slate-200 pb-1 mb-2">Haut du corps</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      <div><span className="text-slate-500">Cou :</span> <strong>{client.neck_circ || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Carrure :</span> <strong>{client.shoulder_width || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Poitrine :</span> <strong>{client.chest || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Taille :</span> <strong>{client.waist || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Manche :</span> <strong>{client.arm_length || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Biceps :</span> <strong>{client.bicep_circ || '—'} cm</strong></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#0b1329] uppercase border-b border-slate-200 pb-1 mb-2">Bas du corps</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      <div><span className="text-slate-500">Bassin :</span> <strong>{client.hips || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Cuisse :</span> <strong>{client.thigh_circ || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Entrejambe :</span> <strong>{client.inside_leg || '—'} cm</strong></div>
                      <div><span className="text-slate-500">Jambe externe :</span> <strong>{client.outside_leg || '—'} cm</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {client.notes && (
                <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded-[6px]">
                  <h4 className="text-xs font-bold text-amber-900 uppercase mb-1">Notes</h4>
                  <p className="text-sm text-amber-950 italic">{client.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-[#0b1329] text-[#D4AF37] rounded-[6px] text-sm font-semibold hover:bg-[#121d3b]">
                  Modifier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}