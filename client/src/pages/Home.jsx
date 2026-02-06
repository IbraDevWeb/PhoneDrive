import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- NOUVELLES IMAGES & TEXTES ---
  const slides = [
    {
      // Image sombre, très "Pro", mise en valeur des objectifs
      image: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=2070&auto=format&fit=crop",
      title: "L'iPhone Pro. À prix pas pro.",
      subtitle: "Pourquoi payer 1300€ ? Accédez à la puissance ultime d'Apple, reconditionnée à neuf, pour une fraction du prix.",
      cta: "Découvrir les Pro"
    },
    {
      // Image épurée, blanche/grise, très clean
      image: "https://images.unsplash.com/photo-1592814053501-5747775ddc27?q=80&w=2070&auto=format&fit=crop",
      title: "Reconditionné. Pas abîmé.",
      subtitle: "Aucune rayure, batterie neuve ou >85%. Nos standards sont aussi élevés que ceux d'Apple.",
      cta: "Voir le stock"
    },
    {
      // Image "Lifestyle" (quelqu'un qui tient le téléphone), rassurante
      image: "https://images.unsplash.com/photo-1556656793-02715d8dd660?q=80&w=2070&auto=format&fit=crop",
      title: "Une seconde vie. Une première classe.",
      subtitle: "Faites un geste pour la planète sans compromis sur la qualité. Garantie 12 mois incluse.",
      cta: "Acheter responsable"
    }
  ];

  // Changement automatique des slides (6 secondes cette fois, pour laisser le temps de lire)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION (Carousel Plein Écran) --- */}
      <div className="relative h-[90vh] overflow-hidden bg-slate-900">
        
        {slides.map((slide, index) => (
            <div 
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            >
                {/* Image de fond + Filtre sombre pour lire le texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-10"></div>
                <img src={slide.image} className="w-full h-full object-cover" alt="Bannière iPhone" />
                
                {/* Contenu Texte */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in">
                        PhoneDrive Premium
                    </span>
                    <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 animate-fade-in drop-shadow-2xl tracking-tighter leading-tight">
                        {slide.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl animate-fade-in delay-100 font-light">
                        {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
                        <Link to="/boutique" className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-300">
                            {slide.cta}
                        </Link>
                    </div>
                </div>
            </div>
        ))}
        
        {/* Indicateurs (Barres au lieu de points) */}
        <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-4">
            {slides.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white w-12' : 'bg-white/30 w-4 hover:bg-white/60'}`}
                />
            ))}
        </div>
    </div>

      {/* --- 1. SECTION "L'ATELIER" (Mise en avant réparation - Remontée ici) --- */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
         {/* Cercle décoratif en fond */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="md:w-1/2">
                <img 
                    src="https://images.unsplash.com/photo-1581092921461-e398d1f4312c?q=80&w=2070&auto=format&fit=crop" 
                    alt="Atelier de réparation" 
                    className="rounded-3xl shadow-2xl border border-slate-700"
                />
            </div>
            <div className="md:w-1/2 space-y-6">
                <div className="inline-block bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Service Atelier</div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">Votre iPhone est cassé ?<br/>On s'en occupe.</h2>
                <p className="text-slate-300 text-lg">
                    Un écran brisé ou une batterie fatiguée ne devrait pas signifier la fin de votre appareil.
                    Choisissez : passez à l'atelier ou demandez une intervention à domicile/bureau.
                </p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-slate-300"><i className="fa-solid fa-check-circle text-blue-500"></i> Réparation en Atelier ou en Déplacement</li>
                    <li className="flex items-center gap-3 text-slate-300"><i className="fa-solid fa-check-circle text-blue-500"></i> Garantie 6 mois sur les réparations</li>
                </ul>
                <div className="pt-4">
                    <Link to="/reparation" className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition inline-flex items-center gap-2">
                        Prendre rendez-vous <i className="fa-solid fa-calendar-check"></i>
                    </Link>
                </div>
            </div>
         </div>
      </div>

      {/* --- 2. SECTION "POURQUOI NOUS ?" (Design Grille) --- */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">L'expérience Apple, sans le stress.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Nous avons réinventé l'achat d'occasion. Fini les mauvaises surprises, place à la sérénité.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-blue-100">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-magnifying-glass-chart"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">35 Points de Contrôle</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Écran, batterie, FaceID, micro... Rien n'est laissé au hasard. Nos techniciens certifiés vérifient chaque pixel avant la mise en vente.
                </p>
            </div>

            {/* Carte 2 */}
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-green-100">
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-battery-full"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Batterie Top Forme</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    La peur n°1 du reconditionné ? La batterie. Chez PhoneDrive, nous garantissons une capacité supérieure à 85% ou nous la remplaçons à neuf.
                </p>
            </div>

            {/* Carte 3 */}
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-purple-100">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-headset"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">SAV Français Réactif</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Un problème ? Notre atelier est à Paris. Pas de chatbots, de vrais humains vous répondent et réparent votre mobile en 24h.
                </p>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Home;