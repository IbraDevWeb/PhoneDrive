import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import confetti from 'canvas-confetti'; // Petit bonus animation

function Success() {
  
  useEffect(() => {
    // Lance un feu d'artifice de confettis au chargement
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50">
      
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm animate-bounce-slow">
        <i className="fa-solid fa-check"></i>
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mb-4">Merci pour votre commande !</h1>
      <p className="text-slate-500 text-lg max-w-md mb-8">
        Votre paiement a été validé. Vous recevrez un email de confirmation dans quelques instants.
      </p>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-sm w-full mb-8 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-2">Prochaine étape ?</h3>
        <p className="text-sm text-slate-500">
            Nos équipes vont préparer votre iPhone, le vérifier une dernière fois et l'expédier sous 24h. 📦
        </p>
      </div>

      <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg">
        Retour à l'accueil
      </Link>

    </div>
  );
}

export default Success;