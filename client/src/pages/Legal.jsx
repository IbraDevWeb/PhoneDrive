import { useState } from 'react';

function Legal() {
  const [activeTab, setActiveTab] = useState('mentions');

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Informations Légales</h1>

        {/* --- ONGLETS --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('mentions')}
            className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'mentions' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            Mentions Légales
          </button>
          <button 
            onClick={() => setActiveTab('cgv')}
            className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'cgv' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            CGV (Vente)
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            Confidentialité
          </button>
        </div>

        {/* --- CONTENU --- */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-slate-700 leading-relaxed space-y-6">
            
            {activeTab === 'mentions' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Éditeur du site</h2>
                    <p>Le site PhoneDrive est édité par l'entreprise <strong>PhoneDrive SAS</strong>, au capital de 10 000€.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris</li>
                        <li><strong>SIRET :</strong> 123 456 789 00012</li>
                        <li><strong>Directeur de la publication :</strong> Ibrahim (Admin)</li>
                        <li><strong>Contact :</strong> hello@phonedrive.fr</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Hébergement</h2>
                    <p>Le site est hébergé par <strong>Vercel Inc.</strong> (Frontend) et <strong>Render/Supabase</strong> (Backend/Database).</p>
                </div>
            )}

            {activeTab === 'cgv' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Conditions Générales de Vente</h2>
                    <p>Ces conditions s'appliquent à toutes les ventes conclues sur le site PhoneDrive.</p>
                    
                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Article 1 : Produits</h3>
                    <p>Les produits vendus sont des téléphones reconditionnés. Chaque appareil subit une batterie de tests (35 points de contrôle).</p>

                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Article 2 : Garantie</h3>
                    <p>Tous nos appareils sont garantis <strong>12 mois</strong> (hors casse et oxydation). La batterie est garantie 3 mois.</p>

                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Article 3 : Retours</h3>
                    <p>Conformément à la loi, vous disposez de <strong>14 jours</strong> pour changer d'avis et nous retourner le produit (à vos frais) pour remboursement intégral.</p>
                </div>
            )}

            {activeTab === 'privacy' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Politique de Confidentialité</h2>
                    <p>Vos données sont précieuses. Voici ce que nous en faisons :</p>

                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Collecte des données</h3>
                    <p>Nous collectons votre nom, email et adresse uniquement pour traiter vos commandes et rendez-vous.</p>

                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Partage</h3>
                    <p>Vos données ne sont <strong>jamais revendues</strong>. Elles sont partagées uniquement avec nos partenaires logistiques (pour la livraison) et Stripe (pour le paiement).</p>

                    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Cookies</h3>
                    <p>Nous utilisons des cookies uniquement pour le fonctionnement du panier et de la connexion.</p>
                </div>
            )}

        </div>

      </div>
    </div>
  );
}

export default Legal;