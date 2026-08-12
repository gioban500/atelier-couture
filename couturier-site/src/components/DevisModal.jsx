import React, { useState } from 'react';

export default function DevisModal({ selectedDevis, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!selectedDevis) return null;

  // On récupère la bonne URL d'image peu importe la clé utilisée
  const imageUrl = selectedDevis.image_url || selectedDevis.reference_img_url;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* BOUTON FERMER */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 font-bold transition z-10"
          >
            ✕
          </button>

          {/* ENTÊTE */}
          <div className="mb-4 border-b border-slate-100 pb-3 pr-8">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Devis #{selectedDevis.id}
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-900 truncate">
              {selectedDevis.client_name}
            </h3>
          </div>

          <div className="overflow-y-auto pr-1 space-y-4">
            {/* IMAGE DU MODÈLE */}
            {imageUrl ? (
              <div 
                className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner flex items-center justify-center cursor-pointer min-h-[200px] max-h-[280px]"
                onClick={() => setIsZoomed(true)}
              >
                <img 
                  src={imageUrl} 
                  alt="Modèle demandé par le client" 
                  className="w-full h-full max-h-[280px] object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow">
                    🔍 Cliquer pour agrandir
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                <span>📷</span>
                <span>Aucun modèle/photo fourni pour cette demande de devis.</span>
              </div>
            )}

            {/* GRILLE D'INFORMATIONS */}
            <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 text-xs block font-semibold">Téléphone</span>
                <span className="font-medium text-slate-800">{selectedDevis.client_phone || 'N/A'}</span>
              </div>

              <div>
                <span className="text-slate-400 text-xs block font-semibold">Email</span>
                <span className="font-medium text-slate-800 truncate block">{selectedDevis.client_email || 'N/A'}</span>
              </div>

              <div>
                <span className="text-slate-400 text-xs block font-semibold">Prestation</span>
                <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
                  {selectedDevis.service_type}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-xs block font-semibold">Date</span>
                <span className="font-medium text-slate-700">
                  {selectedDevis.created_at ? new Date(selectedDevis.created_at).toLocaleDateString('fr-FR') : 'Non renseignée'}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Description / Détails du projet
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-line">
                {selectedDevis.description || "Aucune description fournie."}
              </p>
            </div>
          </div>

          {/* ACTIONS RAPIDES */}
          <div className="flex gap-2 pt-4 mt-2 border-t border-slate-100">
            <a
              href={`tel:${selectedDevis.client_phone}`}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-center py-2.5 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              📞 Appeler
            </a>
            <a
              href={`https://wa.me/${selectedDevis.client_phone?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2.5 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              💬 WhatsApp
            </a>
            <a
              href={`mailto:${selectedDevis.client_email}`}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-center py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              ✉️ Email
            </a>
          </div>
        </div>
      </div>

      {/* MODALE DE ZOOM PLEIN ÉCRAN */}
      {isZoomed && imageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={imageUrl}
            alt="Vue agrandie"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button 
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            onClick={() => setIsZoomed(false)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}