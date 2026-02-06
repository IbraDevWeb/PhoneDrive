function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 animate-pulse">
      {/* Carré pour l'image */}
      <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
      
      {/* Lignes pour le texte */}
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      
      {/* Ligne pour le prix et bouton */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;