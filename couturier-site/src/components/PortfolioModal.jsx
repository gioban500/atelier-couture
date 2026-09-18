export default function PortfolioModal({ isOpen, onClose, onSubmit, formData, setFormData, editingId, categories }) {
  if (!isOpen) return null;

  // Conversion du fichier image en chaîne Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limite de taille à 5 Mo
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image choisie est trop lourde. Veuillez choisir une image de moins de 5 Mo.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold text-sm"
        >
          ✕
        </button>

        <h3 className="text-xl font-serif font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editingId ? '✏️ Modifier la création' : '➕ Ajouter une nouvelle création'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Titre de la création *</label>
            <input
              type="text"
              placeholder="Ex: Robe de Soirée Draperie"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Catégorie *</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Position d'affichage</label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Photo de la création *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!formData.image_url}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer"
            />
          </div>

          {/* APERÇU IMAGE ET OPTION DE SUPPRESSION */}
          {formData.image_url && (
            <div className="relative mt-2 rounded-lg overflow-hidden h-32 border border-slate-200 bg-slate-100">
              <img src={formData.image_url} alt="Aperçu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image_url: '' })}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow transition"
                title="Changer d'image"
              >
                ✕
              </button>
            </div>
          )}

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-xs transition shadow-sm"
            >
              {editingId ? 'Sauvegarder' : 'Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}