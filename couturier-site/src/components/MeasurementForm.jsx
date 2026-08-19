import  { useState } from 'react';

export default function MeasurementForm({ initialData = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    client_name: initialData.client_name || '',
    client_phone: initialData.client_phone || '',
    client_email: initialData.client_email || '',
    height: initialData.height || '',
    neck_circ: initialData.neck_circ || '',
    shoulder_width: initialData.shoulder_width || '',
    chest: initialData.chest || '',
    waist: initialData.waist || '',
    arm_length: initialData.arm_length || '',
    bicep_circ: initialData.bicep_circ || '',
    hips: initialData.hips || '',
    thigh_circ: initialData.thigh_circ || '',
    inside_leg: initialData.inside_leg || '',
    outside_leg: initialData.outside_leg || '',
    photo_url: initialData.photo_url || '',
    notes: initialData.notes || '',
  });

  const [preview, setPreview] = useState(initialData.photo_url || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convertisseur d'image native -> Base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop lourde (max 5Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        setFormData((prev) => ({ ...prev, photo_url: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview('');
    setFormData((prev) => ({ ...prev, photo_url: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Nom Complet *</label>
          <input required type="text" name="client_name" value={formData.client_name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Téléphone</label>
          <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email</label>
          <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" />
        </div>
      </div>

      {/* Stature */}
      <div>
        <label className="block text-xs font-semibold uppercase text-[#0b1329] mb-1">Stature globale (cm) *</label>
        <input required type="number" min="1" name="height" value={formData.height} onChange={handleChange} className="w-full md:w-1/3 p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: 175" />
      </div>

      {/* Haut du corps */}
      <div className="border-t pt-2">
        <h4 className="text-xs font-bold text-[#D4AF37] uppercase mb-2">Haut du corps</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Tour de cou', name: 'neck_circ' },
            { label: 'Carrure dos', name: 'shoulder_width' },
            { label: 'Tour de poitrine', name: 'chest' },
            { label: 'Tour de taille', name: 'waist' },
            { label: 'Longueur de manche', name: 'arm_length' },
            { label: 'Tour de biceps', name: 'bicep_circ' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">{field.label} (cm)</label>
              <input type="number" min="0" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" />
            </div>
          ))}
        </div>
      </div>

      {/* Bas du corps */}
      <div className="border-t pt-2">
        <h4 className="text-xs font-bold text-[#D4AF37] uppercase mb-2">Bas du corps</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Tour de bassin', name: 'hips' },
            { label: 'Tour de cuisse', name: 'thigh_circ' },
            { label: 'Entrejambe', name: 'inside_leg' },
            { label: 'Jambe externe', name: 'outside_leg' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">{field.label} (cm)</label>
              <input type="number" min="0" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" />
            </div>
          ))}
        </div>
      </div>

      {/* Téléversement Fichier Photo */}
      <div className="border-t pt-2 space-y-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Téléverser une photo du modèle</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#0b1329] file:text-[#D4AF37] file:font-semibold hover:file:bg-[#121d3b] cursor-pointer" 
            />
            {preview && (
              <div className="relative w-16 h-20 border border-slate-300 rounded overflow-hidden flex-shrink-0">
                <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={handleRemovePhoto} 
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Notes / Instructions particulières</label>
          <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#D4AF37]" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-[6px] hover:bg-slate-100 text-sm font-semibold">Annuler</button>
        <button type="submit" className="px-4 py-2 bg-[#0b1329] text-[#D4AF37] rounded-[6px] hover:bg-[#121d3b] text-sm font-semibold">Sauvegarder</button>
      </div>
    </form>
  );
}