import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function Devis() {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    typePrestation: 'Sur-mesure',
    description: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const validServiceTypes = ['Sur-mesure', 'Retouche', 'Personnalisation', 'Autre'];

    if (formData.nom.trim().length < 3) newErrors.nom = 'Min 3 caractères';
    if (!/^[+]?([\d\s().-]){9,}$/.test(formData.telephone)) newErrors.telephone = 'Téléphone invalide';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.typePrestation || !validServiceTypes.includes(formData.typePrestation)) {
      newErrors.typePrestation = 'Type de prestation invalide';
    }
    if (formData.description.trim().length < 10) newErrors.description = 'Min 10 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Traitement centralisé du fichier image
  const processFile = (file) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Format requis : JPG, PNG, WEBP' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Taille max : 5 Mo' }));
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Gestion du Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  // Gestion du Copier-Coller (Ctrl + V)
  const handlePaste = (e) => {
    const clipboardItems = e.clipboardData?.items;
    if (!clipboardItems) return;

    for (const item of clipboardItems) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        processFile(file);
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const response = await fetch('http://atelierBack.miabetepe.com/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: formData.nom,
          client_phone: formData.telephone,
          client_email: formData.email,
          service_type: formData.typePrestation,
          description: formData.description,
          reference_img_url: imagePreview // Transmet l'image encodée en Base64
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Erreur serveur');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ nom: '', telephone: '', email: '', typePrestation: 'Sur-mesure', description: '', image: null });
        setImagePreview(null);
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldError) => `
    w-full px-4 py-3 rounded border transition
    ${fieldError 
      ? 'border-red-500 bg-red-50' 
      : 'border-slate-300 bg-slate-50 hover:border-slate-400 focus:border-gray-800 focus:ring-2 focus:ring-gray-800 focus:ring-opacity-20'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-100 to-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-gray-900 mb-6">
            Demander un Devis
          </h1>
          <p className="text-lg text-gray-600">
            Remplissez le formulaire et nous vous répondrons dans les 24-48h
          </p>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-900 mb-3">Demande Transmise!</h2>
              <p className="text-green-800 text-lg">Merci! Vous recevrez une réponse dans les 24-48 heures.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="mt-6 text-sm text-green-700 underline font-semibold"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg p-8 border border-slate-300">
              
              {serverError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                  ⚠️ {serverError}
                </div>
              )}

              {/* NOM */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Votre Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Jean Dupont"
                  className={inputClass(errors.nom)}
                />
                {errors.nom && <p className="text-red-600 text-sm mt-1">⚠️ {errors.nom}</p>}
              </div>

              {/* TEL */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+228 XX XX XX XX"
                  className={inputClass(errors.telephone)}
                />
                {errors.telephone && <p className="text-red-600 text-sm mt-1">⚠️ {errors.telephone}</p>}
              </div>

              {/* EMAIL */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean@example.com"
                  className={inputClass(errors.email)}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">⚠️ {errors.email}</p>}
              </div>

              {/* PRESTATION */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Type de Prestation *</label>
                <select
                  name="typePrestation"
                  value={formData.typePrestation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded border border-slate-300 bg-slate-50 hover:border-slate-400 focus:border-gray-800 focus:ring-2 focus:ring-gray-800 focus:ring-opacity-20 transition"
                >
                  <option value="Sur-mesure">Création Sur-Mesure</option>
                  <option value="Retouche">Retouche</option>
                  <option value="Personnalisation">Personnalisation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description du Projet *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Couleurs, style, occasion..."
                  rows="5"
                  className={`${inputClass(errors.description)} resize-none`}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">⚠️ {errors.description}</p>}
              </div>

              {/* IMAGE (DRAG & DROP + PASTE ZONE) */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Photo d'Inspiration (Optionnel)</label>
                
                <div
                  tabIndex={0}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer outline-none ${
                    isDragging 
                      ? 'border-gray-800 bg-gray-200' 
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400 focus:border-gray-800'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img src={imagePreview} alt="Aperçu" className="max-h-48 mb-4 rounded shadow-sm object-contain" />
                        <p className="text-sm font-medium text-gray-700">Cliquez ou glissez une autre image pour remplacer</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-3xl mb-2">📸</div>
                        <p className="text-gray-900 font-medium">Glissez une image ici ou cliquez pour parcourir</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Vous pouvez également coller une image directement (<kbd className="bg-slate-200 px-1 py-0.5 rounded">Ctrl + V</kbd>)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP — Max 5 Mo</p>
                      </div>
                    )}
                  </label>
                </div>

                {errors.image && <p className="text-red-600 text-sm mt-2">⚠️ {errors.image}</p>}
                {formData.image && <p className="text-sm text-gray-600 mt-2">✅ Fichier sélectionné : {formData.image.name}</p>}
              </div>

              {/* BOUTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-4 rounded font-semibold text-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer ma Demande'}
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                En envoyant ce formulaire, vous acceptez le traitement de vos données.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}