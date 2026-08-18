import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [filter, setFilter] = useState('tous');
  const [selectedImage, setSelectedImage] = useState(null);
  const [allPortfolioData, setAllPortfolioData] = useState([]); // ← Tous les données
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_TO_SHOW = 6;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadPortfolio = async () => {
      try {
        const [portfolioRes, categoriesRes] = await Promise.all([
          fetch('http://atelierBack.miabetepe.com/api/portfolio', { signal: controller.signal }),
          fetch('http://atelierBack.miabetepe.com/api/portfolio/categories', { signal: controller.signal })
        ]);

        const portfolioData = await portfolioRes.json();
        const categoriesData = await categoriesRes.json();

        if (cancelled) {
          return;
        }

        // ✅ Stocke TOUS les données
        setAllPortfolioData(portfolioData);
        setCategories([{ id: 'tous', name: 'Tous' }, ...categoriesData]);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erreur chargement portfolio:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPortfolio();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // ✅ FILTRE d'abord sur TOUS, puis prends les 6 derniers
  const getFilteredAndLimited = () => {
    let filtered = allPortfolioData;

    // Applique le filtre
    if (filter !== 'tous') {
      filtered = filtered.filter(item => item.category_id === parseInt(filter));
    }

    // Trie par créé récemment et prend les 6 premiers
    return filtered
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, ITEMS_TO_SHOW);
  };

  const portfolioData = getFilteredAndLimited();

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sans catégorie';
  };

  return (
    <>
      <section id="portfolio" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
          Dernières Créations
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Chargement...</p>
        ) : (
          <>
            {/* FILTRES */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id.toString())}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    filter === cat.id.toString()
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* GALERIE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {portfolioData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative h-72 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition"
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-end justify-end p-4">
                    <h3 className="text-white font-serif font-semibold text-base">{item.title}</h3>
                    <p className="text-gray-300 text-xs mt-1">
                      {getCategoryName(item.category_id)}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a href="/portfolio">
                <button className="px-6 py-3 border border-gray-800 text-gray-800 rounded font-semibold hover:bg-gray-50 transition">
                  Voir Toute la Galerie
                </button>
              </a>
            </div>
          </>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.title} 
              className="w-full h-auto rounded-lg"
            />
            <div className="bg-black/80 text-white p-4 rounded-b-lg">
              <h3 className="text-2xl font-serif font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">
                {getCategoryName(selectedImage.category_id)}
              </p>
            </div>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button 
              onClick={() => {
                const currentIndex = portfolioData.findIndex(i => i.id === selectedImage.id);
                if (currentIndex > 0) setSelectedImage(portfolioData[currentIndex - 1]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded transition"
            >
              ❮
            </button>
            <button 
              onClick={() => {
                const currentIndex = portfolioData.findIndex(i => i.id === selectedImage.id);
                if (currentIndex < portfolioData.length - 1) setSelectedImage(portfolioData[currentIndex + 1]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded transition"
            >
              ❯
            </button>
          </div>
        </div>
      )}
    </>
  );
}