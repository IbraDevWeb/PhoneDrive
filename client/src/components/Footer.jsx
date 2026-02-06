import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Colonne 1 : Marque */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">
                <span className="font-bold text-sm">P</span>
              </div>
              PhoneDrive
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Le spécialiste du reconditionné premium. <br/>
              Achetez, réparez et économisez en toute confiance.
            </p>
          </div>

          {/* Colonne 2 : Liens */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/boutique" className="hover:text-white transition">Acheter un iPhone</Link></li>
              <li><Link to="/reparation" className="hover:text-white transition">Atelier Réparation</Link></li>
              <li><Link to="/panier" className="hover:text-white transition">Mon Panier</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Espace Admin</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Garantie 12 mois</li>
              <li>Livraison 24/48h</li>
              <li>Paiement Sécurisé (Stripe)</li>
              <li>SAV Français 🇫🇷</li>
            </ul>
          </div>

          {/* Colonne 4 : Newsletter (Visuel) */}
          <div>
            <h3 className="font-bold text-lg mb-4">Restez connecté</h3>
            <p className="text-slate-400 text-sm mb-4">Recevez nos meilleures offres.</p>
            <div className="flex gap-2">
                <input type="email" placeholder="Email..." className="bg-slate-800 text-white border-none rounded-lg px-4 py-2 w-full text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                <button className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">OK</button>
            </div>
            <div className="flex gap-4 mt-6 text-slate-400 text-xl">
                <i className="fa-brands fa-instagram hover:text-white cursor-pointer transition"></i>
                <i className="fa-brands fa-tiktok hover:text-white cursor-pointer transition"></i>
                <i className="fa-brands fa-twitter hover:text-white cursor-pointer transition"></i>
            </div>
          </div>

        </div>

        {/* Barre du bas */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2026 PhoneDrive. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                {/* Remplace les spans statiques par ça : */}
<div className="flex gap-6 mt-4 md:mt-0">
    <Link to="/mentions-legales" className="hover:text-blue-500 transition">Mentions Légales & CGV</Link>
    <Link to="/mentions-legales" className="hover:text-blue-500 transition">Confidentialité</Link>
    <Link to="/login" className="hover:text-blue-500 transition text-slate-700">Espace Admin</Link> {/* Petit accès discret */}
</div>
                <span>CGV</span>
                <span>Confidentialité</span>
            </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;