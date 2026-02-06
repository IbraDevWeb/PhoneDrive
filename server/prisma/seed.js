const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Liste des iPhones à ajouter
  const products = [
    {
      model: "iPhone 13",
      storage: "128 Go",
      color: "Minuit",
      price: 590,
      condition: "Parfait état",
      description: "iPhone 13 en excellent état. Batterie neuve. Câble inclus.",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=500&q=80"
    },
    {
      model: "iPhone 12",
      storage: "64 Go",
      color: "Bleu",
      price: 399,
      condition: "Très bon état",
      description: "Quelques micro-rayures invisibles écran allumé. 100% fonctionnel.",
      image: "https://images.unsplash.com/photo-1605236453806-6ff36a86fa83?auto=format&fit=crop&w=500&q=80"
    },
    {
      model: "iPhone 11",
      storage: "64 Go",
      color: "Noir",
      price: 290,
      condition: "Bon état",
      description: "Traces d'usure sur le châssis. Écran parfait.",
      image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b858?auto=format&fit=crop&w=500&q=80"
    },
    {
      model: "iPhone 13 Pro",
      storage: "256 Go",
      color: "Alpin",
      price: 790,
      condition: "Parfait état",
      description: "Le top du top. Photos incroyables.",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=500&q=80"
    },
    {
      model: "iPhone XR",
      storage: "64 Go",
      color: "Rouge",
      price: 199,
      condition: "État correct",
      description: "Idéal premier téléphone. Fonctionne parfaitement.",
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=500&q=80"
    },
    {
      model: "iPhone 14",
      storage: "128 Go",
      color: "Lumière stellaire",
      price: 720,
      condition: "Comme neuf",
      description: "À peine utilisé, batterie 100%.",
      image: "https://images.unsplash.com/photo-1663499482523-1c0c16692233?auto=format&fit=crop&w=500&q=80"
    }
  ];

  console.log('🌱 Démarrage du remplissage...');

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
    console.log(`✅ Créé : ${product.model}`);
  }

  console.log('🏁 Terminé ! La base de données est remplie.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });