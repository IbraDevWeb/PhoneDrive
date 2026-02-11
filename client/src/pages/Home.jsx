import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 1. CONFIGURATION DES SLIDES ---
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop",
      title: "Votre iPhone est cassé ?",
      subtitle: "Pas de panique. Écran, batterie, micro... Nous réparons tout en 30 minutes. Atelier à Argenteuil ou à domicile.",
      cta: "Prendre Rendez-vous",
      link: "/reparation",
      icon: <i className="fa-solid fa-screwdriver-wrench"></i>
    },
    {
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
      title: "L'iPhone Pro. À prix pas pro.",
      subtitle: "Pourquoi payer 1300€ ? Accédez à la puissance ultime d'Apple, reconditionnée à neuf.",
      cta: "Voir les iPhone",
      link: "/boutique",
      icon: <i className="fa-brands fa-apple"></i>
    },
    {
      image: "https://images.unsplash.com/photo-1556656793-02715d8dd660?q=80&w=2070&auto=format&fit=crop",
      title: "Une seconde vie. Une première classe.",
      subtitle: "Faites un geste pour la planète sans compromis sur la qualité. iPhones testés et vérifiés.",
      cta: "Acheter responsable",
      link: "/boutique",
      icon: <i className="fa-solid fa-leaf"></i>
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
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform 
                ${index === currentSlide ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-105 z-0 pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10"></div>
                <img src={slide.image} className="w-full h-full object-cover" alt="Bannière MKRR STORE" />
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-600/90 backdrop-blur-md border border-blue-400/30 text-white text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in shadow-lg shadow-blue-900/50">
                        {index === 0 ? 'Service Atelier Express' : 'MKRR STORE Premium'}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-2xl tracking-tight leading-tight max-w-4xl">
                        {slide.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl animate-fade-in delay-100 font-light leading-relaxed">
                        {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
                        <Link 
                            to={slide.link} 
                            className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transform duration-300 flex items-center gap-2"
                        >
                            {slide.cta} {slide.icon}
                        </Link>
                    </div>
                </div>
            </div>
        ))}
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

      {/* --- SECTION "L'ATELIER" --- */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="md:w-1/2">
                <img 
                    src="https://images.unsplash.com/photo-1597424214309-8aa2950d4d29?q=80&w=2070&auto=format&fit=crop" 
                    alt="Atelier de réparation" 
                    className="rounded-3xl shadow-2xl border border-slate-700 hover:scale-105 transition duration-500 w-full object-cover h-[400px]"
                    onError={(e) => {e.target.src = 'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}}
                />
            </div>
            <div className="md:w-1/2 space-y-6">
                <div className="inline-block bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Expertise Technique</div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ne jetez pas.<br/>Réparez.</h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                    Un écran brisé ou une batterie fatiguée ne devrait pas signifier la fin de votre appareil.
                    Nos techniciens redonnent vie à votre iPhone en utilisant des pièces de qualité d'origine.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <i className="fa-solid fa-store text-blue-500 text-xl"></i>
                        <div>
                            <span className="block font-bold text-white">Atelier Argenteuil</span>
                            <span className="text-xs">Sur RDV en 30 min</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <i className="fa-solid fa-motorcycle text-blue-500 text-xl"></i>
                        <div>
                            <span className="block font-bold text-white">À Domicile</span>
                            <span className="text-xs">On vient à vous</span>
                        </div>
                    </div>
                </div>
                <div className="pt-6">
                    <Link to="/reparation" className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition inline-flex items-center gap-2 shadow-lg hover:shadow-white/20">
                        Demander un devis gratuit <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
         </div>
      </div>

      {/* --- SECTION "POURQUOI NOUS ?" (Modifiée) --- */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">L'Expertise Apple à Argenteuil.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Que ce soit pour une réparation minutieuse ou un achat vérifié, nous ne laissons rien au hasard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. NOUVEAU : Réparation Express */}
            <div className="group bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-200 hover:border-blue-200">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-stopwatch"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Réparation Express</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Votre temps est précieux. Écrans et batteries sont remplacés en moins de 30 minutes, sous vos yeux.
                </p>
            </div>

            {/* 2. NOUVEAU : Prix Transparents */}
            <div className="group bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-200 hover:border-green-200">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Prix Transparents</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Fini les mauvaises surprises. Nos tarifs sont clairs, affichés et compétitifs pour une prestation haut de gamme.
                </p>
            </div>

            {/* 3. EXISTANT : Qualité d'Origine */}
            <div className="group bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-200 hover:border-purple-200">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-star"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Qualité d'Origine</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Nous n'utilisons que des composants de haute qualité pour garantir que votre iPhone reste un iPhone.
                </p>
            </div>
        </div>
      </div>

      {/* --- BANNIÈRE FINALE --- */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt à changer de mobile ?</h2>
            <p className="text-blue-100 mb-8 text-lg">Découvrez notre stock d'iPhone reconditionnés, testés et approuvés par nos experts.</p>
            <div className="flex justify-center gap-4">
                <Link to="/boutique" className="px-8 py-3 bg-white text-blue-700 rounded-full font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform">
                    Voir les offres
                </Link>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Home;