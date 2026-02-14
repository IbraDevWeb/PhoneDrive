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

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "nishimiya.ichida@gmail.com"; 
const SHOP_ADDRESS = "10 Rue de la Tech, 75000 Paris"; 

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- LE VIGILE COOL (Laisse passer tout le monde connecté) ---
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "Pas de token." });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalide." });

    // 👇 ICI : ON A SUPPRIMÉ LA VÉRIFICATION DU RÔLE
    // Tant que le token est valide, on laisse passer.
    req.user = decoded;
    next();
  });
};

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Connectez-vous." });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Expiré." });
      req.userId = decoded.id;
      next();
    });
};

// --- ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        // Vérif simple
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email pris." });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({ 
            data: { email, password: hashedPassword, name, phone, address } 
        });
        res.json({ message: "Compte créé !" });
    } catch (error) { res.status(500).json({ error: "Erreur inscription." }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // On cherche l'user (mode insensible à la casse pour éviter les bugs)
        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });

        if (!user) return res.status(404).json({ error: "Inconnu." });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Mot de passe faux." });

        // On génère un token simple
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        const { password: _, ...userData } = user;
        // On force l'affichage "admin" pour le frontend, juste pour que les menus s'affichent
        res.json({ token, user: { ...userData, role: 'admin' } });

    } catch (error) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get('/api/me', authenticateUser, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
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

// Ajout Produit (Protégé par le vigile cool)
app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { model, price, image, description, storage, color } = req.body;
    const product = await prisma.product.create({ 
        data: { model, price: parseFloat(price), image, description, storage, color } 
    });
    res.json(product);
  } catch (error) { res.status(500).json({ error: "Erreur ajout" }); }
});

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
            customer, email, address, total: parseFloat(total), items: JSON.stringify(items), status: "Paiement au retrait", userId: userId || null
        } 
    });
    // Envoi des emails (si ça échoue, on continue quand même)
    try {
         await resend.emails.send({ from: 'onboarding@resend.dev', to: email, subject: 'Commande OK', html: '<p>Merci !</p>' });
         await resend.emails.send({ from: 'onboarding@resend.dev', to: ADMIN_EMAIL, subject: 'Nouvelle Vente', html: '<p>$$$</p>' });
    } catch(e) {}
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
        const { client, email, phone, device, issue, date, locationType } = req.body;
        await prisma.appointment.create({ 
            data: { client, email, phone, device, issue: `${issue} (${locationType})`, date: new Date(date) } 
        });
        res.json({ message: "RDV pris" });
    } catch (e) { res.status(500).json({ error: "Erreur RDV" }); }
});

app.get('/api/appointments', authenticateAdmin, async (req, res) => {
    const appointments = await prisma.appointment.findMany({ orderBy: { date: 'asc' } });
    res.json(appointments);
});

app.listen(PORT, () => {
    console.log(`✅ Serveur OPEN BAR lancé sur le port ${PORT}`);
});