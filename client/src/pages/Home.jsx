import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- CONFIGURATION DES SLIDES (Réparation en PREMIER) ---
  const slides = [
    {
      // SLIDE 1 : COEUR DE MÉTIER -> RÉPARATION
      image: "https://images.unsplash.com/photo-1597424214309-8aa2950d4d29?q=80&w=2070&auto=format&fit=crop",
      title: "Votre iPhone est cassé ?",
      subtitle: "Pas de panique. Écran, batterie, micro... Nous réparons tout en 30 minutes. Atelier à Paris ou à domicile.",
      cta: "Prendre Rendez-vous",
      link: "/reparation" // Celui-ci va vers la réparation
    },
    {
      // SLIDE 2 : VENTE (PRO)
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
      title: "L'iPhone Pro. À prix pas pro.",
      subtitle: "Pourquoi payer 1300€ ? Accédez à la puissance ultime d'Apple, reconditionnée à neuf.",
      cta: "Voir les iPhone",
      link: "/boutique" // Celui-ci va vers la boutique
    },
    {
      // SLIDE 3 : LIFESTYLE / ÉCOLO
      image: "https://images.unsplash.com/photo-1556656793-02715d8dd660?q=80&w=2070&auto=format&fit=crop",
      title: "Une seconde vie. Une première classe.",
      subtitle: "Faites un geste pour la planète sans compromis sur la qualité. Garantie 12 mois incluse.",
      cta: "Acheter responsable",
      link: "/boutique"
    }
  ];

  // Changement automatique (6 sec)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION (Carousel) --- */}
      <div className="relative h-[90vh] overflow-hidden bg-slate-900">
        
        {slides.map((slide, index) => (
            <div 
                key={index}
                // J'ai ajouté 'z-20' pour le slide actif et 'pointer-events-none' pour les inactifs
                // C'est ça qui rend le bouton CLIQUABLE !
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform 
                ${index === currentSlide ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-105 z-0 pointer-events-none'}`}
            >
                {/* Filtre sombre pour lire le texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10"></div>
                
                <img src={slide.image} className="w-full h-full object-cover" alt="Bannière" />
                
                {/* Contenu Texte */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-600/90 backdrop-blur-md border border-blue-400/30 text-white text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in shadow-lg shadow-blue-900/50">
                        {index === 0 ? 'Service Atelier Express' : 'PhoneDrive Premium'}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-2xl tracking-tight leading-tight max-w-4xl">
                        {slide.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl animate-fade-in delay-100 font-light leading-relaxed">
                        {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
                        {/* Le lien est maintenant dynamique (boutique ou réparation) */}
                        <Link 
                            to={slide.link} 
                            className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transform duration-300 flex items-center gap-2"
                        >
                            {slide.cta} {index === 0 ? <i className="fa-solid fa-screwdriver-wrench"></i> : <i className="fa-solid fa-arrow-right"></i>}
                        </Link>
                    </div>
                </div>
            </div>
        ))}
        
        {/* Indicateurs (Barres) */}
        <div className="absolute bottom-12 left-0 right-0 z-40 flex justify-center gap-4">
            {slides.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white w-12 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/30 w-4 hover:bg-white/60'}`}
                />
            ))}
        </div>
    </div>

      {/* --- 2. SECTION "POURQUOI NOUS ?" (Rassurante) --- */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">L'Expertise Apple à Paris.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Que ce soit pour une réparation minutieuse ou un achat vérifié, nous ne laissons rien au hasard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-blue-100">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Réparation Expert</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Écran cassé ? Batterie HS ? Nos techniciens certifiés réparent votre iPhone en 30 minutes avec des pièces de qualité d'origine.
                </p>
            </div>

            <div className="group bg-slate-50 hover:bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-green-100">
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-check-double"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Contrôle 35 Points</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Avant de vendre un iPhone, nous testons tout : FaceID, micros, caméras... Vous achetez un appareil fiable, garanti 12 mois.
                </p>
            </div>

            <div className="group bg-slate-50 hover:bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-purple-100">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Atelier & Domicile</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Pas le temps de passer ? Nous intervenons à votre bureau ou à domicile sur Paris et petite couronne. Simple et efficace.
                </p>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Home;