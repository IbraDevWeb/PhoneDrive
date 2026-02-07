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
const ADMIN_EMAIL = "nishimiya.ichida@gmail.com"; 

// 👇 ADRESSE DE LA BOUTIQUE
const SHOP_ADDRESS = "10 Rue de la Tech, 75000 Paris"; 

// Remplace "app.use(cors());" par tout ça :
app.use(cors({
  origin: '*', // Autorise tout le monde (Vercel, ton ordi, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Autorise toutes les actions
  allowedHeaders: ['Content-Type', 'Authorization'] // Autorise l'envoi du Token (le badge)
}));
app.use(express.json());

// --- MIDDLEWARES ---
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token manquant." });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // On accepte si le token dit 'admin' OU si l'email dans le token correspond à l'admin
    // (Mais ici on se base sur le rôle encodé dans le token)
    if (err || decoded.role !== 'admin') return res.status(403).json({ error: "Accès Admin requis." });
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

// Login Admin Classique (Via mot de passe unique)
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: "Mot de passe incorrect" });
    }
});

// Inscription Client
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email déjà utilisé." });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({ data: { email, password: hashedPassword, name, phone, address } });

        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email, 
                subject: 'Bienvenue chez PhoneDrive ! 📱',
                html: `<h1>Bienvenue ${name} !</h1><p>Votre compte a été créé avec succès.</p>`
            });
        } catch (e) { console.error("Erreur Mail:", e); }

        res.json({ message: "Compte créé !" });
    } catch (error) { res.status(500).json({ error: "Erreur inscription." }); }
});

// Login Client (AVEC PASSE-DROIT ADMIN)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Inconnu." });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Mot de passe faux." });
        
        // --- 👑 LE PASSE-DROIT ADMIN ---
        // Si c'est TON email, on force le rôle 'admin'. Sinon 'client'.
        let userRole = 'client';
        if (user.email === "nishimiya.ichida@gmail.com") {
            userRole = 'admin';
        }
        // -------------------------------
        
        const token = jwt.sign({ id: user.id, role: userRole }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userData } = user;
        
        // On renvoie le rôle modifié au frontend
        res.json({ token, user: { ...userData, role: userRole } });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: "Erreur connexion" }); 
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

app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { model, price, image, description, storage, color } = req.body;
    const product = await prisma.product.create({ data: { model, price: parseFloat(price), image, description, storage, color } });
    res.json(product);
  } catch (error) { res.status(500).json({ error: "Erreur ajout" }); }
});

app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Supprimé" });
});

// --- COMMANDES (PAIEMENT AU RETRAIT) ---
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, email, address, total, items, userId } = req.body; 
    
    const orderData = { 
        customer, email, address, 
        total: parseFloat(total), 
        items: JSON.stringify(items), 
        status: "Paiement au retrait" 
    };
    if (userId) orderData.userId = userId;

    const order = await prisma.order.create({ data: orderData });

    // 1. MAIL CLIENT
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', to: email, 
            subject: 'Commande confirmée (À retirer) ✅',
            html: `
                <h1>Merci ${customer} !</h1>
                <p>Votre commande de <strong>${total}€</strong> est bien réservée.</p>
                <p><strong>Paiement :</strong> À régler sur place (Espèces ou Carte) lors du retrait à la boutique :</p>
                <p><strong>📍 Adresse :</strong> ${SHOP_ADDRESS}</p>
                <p>Nous vous contacterons très vite pour convenir de l'heure.</p>
            `
        });
    } catch (e) { console.error("Erreur Mail Client:", e); }

    // 2. MAIL ADMIN (ALERTE)
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', to: ADMIN_EMAIL,
            subject: `💰 NOUVELLE VENTE : ${total}€`,
            html: `
                <h2>Nouvelle commande à préparer !</h2>
                <ul>
                    <li><strong>Client :</strong> ${customer}</li>
                    <li><strong>Total :</strong> ${total}€</li>
                    <li><strong>Email :</strong> ${email}</li>
                </ul>
                <p>Client en attente de contact pour le retrait.</p>
            `
        });
    } catch (e) { console.error("Erreur Mail Admin:", e); }

    res.json(order);
  } catch (error) { res.status(500).json({ error: "Erreur commande" }); }
});

app.get('/api/orders', authenticateAdmin, async (req, res) => {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
});

// --- RDV (AVEC LIEU ATELIER/DEPLACEMENT) ---
app.post('/api/appointments', async (req, res) => {
    try {
        const { client, email, phone, device, issue, date, locationType, locationAddress } = req.body;
        
        await prisma.appointment.create({ 
            data: { 
                client, email, phone, device, 
                issue: `${issue} (${locationType === 'atelier' ? 'Atelier' : 'Déplacement'})`, 
                date: new Date(date) 
            } 
        });
        
        // C'est ici qu'on définit l'adresse qui s'affichera dans le mail
        const locationText = locationType === 'atelier' 
            ? `À l'Atelier (${SHOP_ADDRESS})` 
            : `En Déplacement à : ${locationAddress}`;

        // 1. MAIL CLIENT
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev', to: email,
                subject: 'Rendez-vous confirmé 🛠️',
                html: `
                    <p>Bonjour ${client},</p>
                    <p>Votre RDV pour réparer votre <strong>${device}</strong> est confirmé.</p>
                    <p><strong>Date :</strong> ${new Date(date).toLocaleString()}</p>
                    <p><strong>Lieu :</strong> ${locationText}</p>
                `
            });
        } catch(e) {}

        // 2. MAIL ADMIN
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev', to: ADMIN_EMAIL,
                subject: `🔧 NOUVEAU RDV : ${device}`,
                html: `
                    <h2>Nouveau RDV Réparation</h2>
                    <ul>
                        <li><strong>Client :</strong> ${client} (${phone})</li>
                        <li><strong>Appareil :</strong> ${device} (${issue})</li>
                        <li><strong>Date :</strong> ${new Date(date).toLocaleString()}</li>
                        <li><strong>LIEU :</strong> ${locationText}</li>
                    </ul>
                `
            });
        } catch(e) {}
        
        res.json({ message: "RDV pris" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Erreur RDV" }); 
    }
});

app.get('/api/appointments', authenticateAdmin, async (req, res) => {
    const appointments = await prisma.appointment.findMany({ orderBy: { date: 'asc' } });
    res.json(appointments);
});

app.listen(PORT, () => {
    console.log(`✅ Serveur LITE (Retrait Boutique) lancé sur le port ${PORT}`);
});