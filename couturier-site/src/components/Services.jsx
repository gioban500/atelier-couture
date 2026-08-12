// src/components/Services.jsx
export default function Services() {
  const services = [
    {
      title: "Création Sur-Mesure",
      desc: "Costumes, robes et tenues personnalisées selon vos mesures exactes.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Retouches Précises",
      desc: "Ajustements et modifications de vos vêtements existants avec finition impeccable.",
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Stylisme & Design",
      desc: "Conseil en style et création de modèles exclusifs adaptés à votre silhouette.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
        Nos Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, index) => (
          <div key={index} className="relative h-96 rounded-2xl overflow-hidden group shadow-lg">
            <img 
              src={s.image} 
              alt={s.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}