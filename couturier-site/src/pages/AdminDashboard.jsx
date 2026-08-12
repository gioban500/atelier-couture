import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DevisModal from '../components/DevisModal';
import PortfolioModal from '../components/PortfolioModal';
import PortfolioGrid from '../components/PortfolioGrid';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [devis, setDevis] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devisFilter, setDevisFilter] = useState('Nouveau');
  const [searchTerm, setSearchTerm] = useState('');

  // MODALE PORTFOLIO STATE
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', category_id: '', position: 0, image_url: '' });
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchAllData = useCallback(async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [photosRes, categoriesRes, devisRes] = await Promise.all([
        fetch('http://localhost:5000/api/portfolio', { headers }),
        fetch('http://localhost:5000/api/portfolio/categories', { headers }),
        fetch('http://localhost:5000/api/admin/devis', { headers })
      ]);

      if ([photosRes, categoriesRes, devisRes].some(r => r.status === 401)) {
        localStorage.removeItem('adminToken');
        navigate('/login');
        return;
      }

      setPhotos(await photosRes.json());
      setCategories(await categoriesRes.json());
      setDevis(await devisRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchAllData();
    };
    void load();

    return () => { isMounted = false; };
  }, [fetchAllData, navigate, token]);

  // OUVRIR MODALE POUR CRÉATION
  const handleOpenAddModal = () => {
    setFormData({ title: '', category_id: '', position: 0, image_url: '' });
    setEditingId(null);
    setIsPortfolioModalOpen(true);
  };

  // OUVRIR MODALE POUR MODIFICATION
  const handleOpenEditModal = (photo) => {
    setFormData({
      title: photo.title,
      category_id: photo.category_id || '',
      position: photo.position || 0,
      image_url: photo.image_url,
    });
    setEditingId(photo.id);
    setIsPortfolioModalOpen(true);
  };

  const handleSubmitPhoto = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/api/portfolio/${editingId}` 
      : 'http://localhost:5000/api/portfolio';

    const res = await fetch(url, {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...formData, 
        category_id: parseInt(formData.category_id), 
        position: parseInt(formData.position) 
      }),
    });

    if (res.ok) {
      setIsPortfolioModalOpen(false);
      fetchAllData();
    }
  };

  const handleArchivePhoto = async (id) => {
    await fetch(`http://localhost:5000/api/portfolio/${id}/archive`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Supprimer cette photo ?')) return;
    await fetch(`http://localhost:5000/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleStatusChange = async (e, devisId, newStatus) => {
    e.stopPropagation();
    await fetch(`http://localhost:5000/api/admin/devis/${devisId}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAllData();
  };

  const activePhotos = photos.filter(p => !p.archived_at);
  
  // Filtrage combiné : par statut actif ET par recherche sur le nom du client
  const filteredDevis = devis
    .filter(d => (d.status || 'Nouveau') === devisFilter)
    .filter(d => d.client_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const statuses = ['Nouveau', 'En attente', 'Traité', 'Archivé'];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      
      {/* HEADER SOMBRE */}
      <header className="bg-[#0b1329] text-white py-5 px-6 sm:px-10 border-b border-amber-500/30 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-amber-500 tracking-wider">ATELIER COUTURE</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Espace Administration & Gestion</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex text-xs">
            <button
              onClick={() => setActiveTab('devis')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'devis' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              Devis ({devis.length})
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'portfolio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              Portfolio ({activePhotos.length})
            </button>
          </div>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }} className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500/10">
            Déconnexion
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8">
        {loading ? (
          <p className="text-center py-20 text-slate-400">Chargement...</p>
        ) : (
          <>
            {/* ================= ONGLET DEVIS ================= */}
            {activeTab === 'devis' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  {/* BARRE DE RECHERCHE CLIENT */}
                  <input
                    type="text"
                    placeholder="Rechercher un client par son nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
                  />
                  
                  <div className="flex gap-2">
                    {statuses.map(st => (
                      <button
                        key={st}
                        onClick={() => setDevisFilter(st)}
                        className={`px-3 py-1 rounded text-xs font-semibold ${devisFilter === st ? 'bg-amber-500 text-slate-950' : 'bg-white border text-slate-600'}`}
                      >
                        {st} ({devis.filter(d => (d.status || 'Nouveau') === st).length})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase border-b">
                      <tr>
                        <th className="p-3">Client</th>
                        <th className="p-3">Prestation</th>
                        <th className="p-3">Téléphone</th>
                        <th className="p-3">Aperçu Visuel</th>
                        <th className="p-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDevis.map(d => (
                        <tr
                          key={d.id}
                          onClick={() => setSelectedDevis(d)}
                          className="hover:bg-amber-50/40 cursor-pointer transition"
                        >
                          <td className="p-3 font-semibold text-slate-900">{d.client_name}</td>
                          <td className="p-3"><span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full">{d.service_type}</span></td>
                          <td className="p-3 text-slate-600">{d.client_phone}</td>
                          <td className="p-3">
                            {d.image_url ? (
                              <img src={d.image_url} alt="Aperçu" className="w-10 h-10 object-cover rounded border border-slate-200" />
                            ) : (
                              <span className="text-xs text-slate-400 italic">Aucune image</span>
                            )}
                          </td>
                          <td className="p-3" onClick={e => e.stopPropagation()}>
                            <select
                              value={d.status || 'Nouveau'}
                              onChange={(e) => handleStatusChange(e, d.id, e.target.value)}
                              className="text-xs bg-white border rounded px-2 py-1"
                            >
                              {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= ONGLET PORTFOLIO ================= */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Articles du Portfolio</h2>
                    <p className="text-xs text-slate-500">Glissez-déposez pour réordonner • Gérez vos créations</p>
                  </div>
                  <button
                    onClick={handleOpenAddModal}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>➕</span> Ajouter une création
                  </button>
                </div>

                {activePhotos.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400">
                    Aucune création dans le portfolio.
                  </div>
                ) : (
                  <PortfolioGrid
                    key={JSON.stringify(activePhotos.map(p => p.id))}
                    photos={activePhotos}
                    categories={categories}
                    token={token}
                    onEdit={handleOpenEditModal}
                    onArchive={handleArchivePhoto}
                    onDelete={handleDeletePhoto}
                    onReorder={(updatedPhotos) => setPhotos(updatedPhotos.map(p => ({ ...p, archived_at: null })))}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODALE POUR LES DEVIS */}
      <DevisModal selectedDevis={selectedDevis} onClose={() => setSelectedDevis(null)} />

      {/* MODALE POUR AJOUTER / MODIFIER UN ARTICLE DU PORTFOLIO */}
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onSubmit={handleSubmitPhoto}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        categories={categories}
      />
    </div>
  );
}