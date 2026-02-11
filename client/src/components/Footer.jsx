import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Colonne 1 : Marque */}
          <div className="col-span-1">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-lg shadow-blue-900/50">
                <span className="font-bold text-sm">P</span>
              </div>
              MKRR STORE
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              L'expert de la réparation iPhone à Paris. <br/>
              Service express, pièces de qualité et transparence totale.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Navigation</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <Link to="/boutique" className="hover:text-blue-400 transition flex items-center gap-2">
                  <i className="fa-solid fa-angle-right text-xs"></i> Acheter un iPhone
                </Link>
              </li>
              <li>
                <Link to="/reparation" className="hover:text-blue-400 transition flex items-center gap-2">
                  <i className="fa-solid fa-angle-right text-xs"></i> Atelier Réparation
                </Link>
              </li>
              <li>
                <Link to="/panier" className="hover:text-blue-400 transition flex items-center gap-2">
                  <i className="fa-solid fa-angle-right text-xs"></i> Mon Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Nos Engagements (SANS GARANTIE) */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Nos Engagements</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-stopwatch text-blue-500"></i> Réparation en 30 min
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-tag text-blue-500"></i> Prix Transparents
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-star text-blue-500"></i> Pièces Qualité Origine
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-lock text-blue-500"></i> Paiement Sécurisé
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Restez connecté</h3>
            <p className="text-slate-400 text-sm mb-4">Recevez nos offres exclusives.</p>
            <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Votre email..." 
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 w-full text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition" 
                />
                <button className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg text-sm">OK</button>
            </div>
            <div className="flex gap-6 mt-6 text-slate-400 text-lg">
                <a href="#" className="hover:text-white transition transform hover:scale-110"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="hover:text-white transition transform hover:scale-110"><i className="fa-brands fa-tiktok"></i></a>
                <a href="#" className="hover:text-white transition transform hover:scale-110"><i className="fa-brands fa-snapchat"></i></a>
            </div>
          </div>

        </div>

        {/* Barre du bas (Clean) */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2026 MKRR STORE. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <Link to="/mentions-legales" className="hover:text-blue-400 transition">Mentions Légales</Link>
                <Link to="/mentions-legales" className="hover:text-blue-400 transition">CGV</Link>
                <Link to="/mentions-legales" className="hover:text-blue-400 transition">Politique de Confidentialité</Link>
            </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;