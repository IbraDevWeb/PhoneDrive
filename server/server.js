const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Resend } = require('resend'); 

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// --- CONFIGURATION ---
const resend = new Resend(process.env.RESEND_API_KEY);
// Ton email Admin (On met tout en minuscule pour être sûr)
const ADMIN_EMAIL = "nishimiya.ichida@gmail.com"; 
const SHOP_ADDRESS = "10 Rue de la Tech, 75000 Paris"; 

// --- SÉCURITÉ CORS ---
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- MIDDLEWARES ---
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "Token manquant." });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalide." });
    // Vérification stricte du rôle
    if (decoded.role !== 'admin') {
        return res.status(403).json({ error: "Accès Admin refusé." });
    }
    req.user = decoded;
    next();
  });
};

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Connectez-vous." });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Session expirée." });
      req.userId = decoded.id;
      next();
    });
};

// --- AUTHENTIFICATION ---

// Inscription
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email déjà pris." });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        // On ne définit PAS de rôle ici pour éviter les bugs de base de données
        await prisma.user.create({ 
            data: { email, password: hashedPassword, name, phone, address } 
        });

        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev', to: email, 
                subject: 'Bienvenue chez PhoneDrive ! 📱',
                html: `<h1>Bienvenue ${name} !</h1><p>Compte créé.</p>`
            });
        } catch (e) {}

        res.json({ message: "Compte créé !" });
    } catch (error) { res.status(500).json({ error: "Erreur inscription." }); }
});

// 👇 LE LOGIN "SAFE" (Sans écriture en BDD) 👇
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Recherche de l'utilisateur ( insensible à la casse si possible)
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
             const users = await prisma.user.findMany({
                where: { email: { equals: email, mode: 'insensitive' } }
             });
             user = users[0];
        }

        if (!user) return res.status(404).json({ error: "Email inconnu." });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Mot de passe faux." });

        // --- 🛡️ PASSE-DROIT VIRTUEL ---
        // On décide du rôle ICI, dans le code, sans toucher à la base de données.
        const cleanEmail = email.trim().toLowerCase();
        
        let virtualRole = 'client'; // Par défaut
        
        // Si c'est TOI, tu es Admin. Point final.
        if (cleanEmail === ADMIN_EMAIL) {
            console.log("👑 ADMIN CONNECTÉ (Mode Virtuel) : " + email);
            virtualRole = 'admin';
        }
        // ------------------------------

        // On génère le badge avec ce rôle virtuel
        const token = jwt.sign(
            { id: user.id, role: virtualRole, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        const { password: _, ...userData } = user;
        
        // On renvoie les infos au frontend en TRICHANT sur le rôle affiché
        res.json({ 
            token, 
            user: { 
                ...userData, 
                role: virtualRole // Le frontend verra 'admin' même si la BDD ne le sait pas
            } 
        });

    } catch (error) { 
        console.error("Login Error:", error);
        res.status(500).json({ error: "Erreur serveur" }); 
    }
});

app.get('/api/me', authenticateUser, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: { id: req.userId }, 
            include: { orders: { orderBy: { createdAt: 'desc' } } } 
        });
        const { password, ...userData } = user;
        res.json(userData);
    } catch (error) { res.status(500).json({ error: "Erreur" }); }
});

// --- PRODUITS ---
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: "Introuvable" });
    res.json(product);
});

// Route Protégée : Ajout
app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { model, price, image, description, storage, color } = req.body;
    const product = await prisma.product.create({ 
        data: { model, price: parseFloat(price), image, description, storage, color } 
    });
    res.json(product);
  } catch (error) { 
      console.error(error);
      res.status(500).json({ error: "Erreur ajout produit" }); 
  }
});

// Route Protégée : Suppression
app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Supprimé" });
});

// --- COMMANDES ---
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, email, address, total, items, userId } = req.body; 
    const order = await prisma.order.create({ 
        data: { 
            customer, email, address, 
            total: parseFloat(total), 
            items: JSON.stringify(items), 
            status: "Paiement au retrait",
            userId: userId || null
        } 
    });

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', to: email, 
            subject: 'Commande confirmée ✅',
            html: `<h1>Merci ${customer} !</h1><p>Commande de ${total}€ enregistrée.</p>`
        });
        await resend.emails.send({
            from: 'onboarding@resend.dev', to: ADMIN_EMAIL, 
            subject: `💰 VENTE : ${total}€`,
            html: `<p>Nouvelle commande de ${customer}</p>`
        });
    } catch (e) {}

    res.json(order);
  } catch (error) { res.status(500).json({ error: "Erreur commande" }); }
});

app.get('/api/orders', authenticateAdmin, async (req, res) => {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
});

// --- RDV ---
app.post('/api/appointments', async (req, res) => {
    try {
        const { client, email, phone, device, issue, date, locationType, locationAddress } = req.body;
        await prisma.appointment.create({ 
            data: { 
                client, email, phone, device, 
                issue: `${issue} (${locationType})`, 
                date: new Date(date) 
            } 
        });
        res.json({ message: "RDV pris" });
    } catch (e) { res.status(500).json({ error: "Erreur RDV" }); }
});

app.get('/api/appointments', authenticateAdmin, async (req, res) => {
    const appointments = await prisma.appointment.findMany({ orderBy: { date: 'asc' } });
    res.json(appointments);
});

app.listen(PORT, () => {
    console.log(`✅ Serveur LITE lancé sur le port ${PORT}`);
});