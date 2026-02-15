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

// --- ⚙️ CONFIGURATION DU MAGASIN (Modifie ici si besoin) ---
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "nishimiya.ichida@gmail.com"; // 👑 Le SEUL email qui a le pouvoir
const SHOP_NAME = "MKRR Store";
const SHOP_ADDRESS = "10 Rue de la Tech, 75000 Paris";
const SHOP_PHONE = "01 23 45 67 89";

// --- 🛡️ SÉCURITÉ ---
app.use(cors({
  origin: '*', // En prod, tu pourras restreindre à ton domaine Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- 👮‍♂️ LE VIGILE (MIDDLEWARE) ---
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "Authentification requise." });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Session expirée." });

    // SÉCURITÉ MAXIMALE : On vérifie si l'email du token est bien celui du patron
    const tokenEmail = (decoded.email || "").trim().toLowerCase();
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();

    if (tokenEmail !== adminEmail) {
        return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas l'administrateur." });
    }
    
    req.user = decoded;
    next();
  });
};

// --- 📧 GÉNÉRATEUR D'EMAILS PROS (HTML) ---
const emailStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;
`;

// --- 🚀 ROUTES AUTHENTIFICATION ---

// Connexion (Blindée)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Recherche insensible à la casse (majuscule/minuscule)
        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });

        if (!user) return res.status(404).json({ error: "Email inconnu." });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Mot de passe incorrect." });

        // Création du Token
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        // On ne renvoie jamais le mot de passe, même haché
        const { password: _, ...userData } = user;
        
        // Si c'est toi, on dit au frontend que tu es admin
        const isAdmin = user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
        
        res.json({ token, user: { ...userData, role: isAdmin ? 'admin' : 'client' } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Erreur serveur lors de la connexion." });
    }
});

// Inscription (Classique)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({ 
            data: { email, password: hashedPassword, name, phone, address } 
        });
        
        res.json({ message: "Compte créé avec succès." });
    } catch (error) { res.status(500).json({ error: "Erreur lors de l'inscription." }); }
});

// Récupérer ses infos (Me)
app.get('/api/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Non connecté" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token invalide" });
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
        
        const { password, ...userData } = user;
        const isAdmin = user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
        res.json({ ...userData, role: isAdmin ? 'admin' : 'client' });
    });
});

// --- 📱 ROUTES PRODUITS (CRUD) ---

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } }); // Les plus récents en premier
  res.json(products);
});

app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { model, price, image, description, storage, color } = req.body;
    const product = await prisma.product.create({ 
        data: { model, price: parseFloat(price), image, description, storage, color } 
    });
    res.json(product);
  } catch (error) { res.status(500).json({ error: "Impossible d'ajouter le produit." }); }
});

app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: "Produit supprimé." });
    } catch (error) { res.status(500).json({ error: "Erreur suppression." }); }
});

// --- 🛍️ ROUTES COMMANDES (EMAILS PROS) ---

app.get('/api/orders', authenticateAdmin, async (req, res) => {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, email, address, total, items, userId } = req.body; 
    
    // Sauvegarde en BDD
    const order = await prisma.order.create({ 
        data: { 
            customer, email, address, 
            total: parseFloat(total), 
            items: JSON.stringify(items), 
            status: "Paiement au retrait",
            userId: userId || null
        } 
    });

    // Génération de la liste HTML des produits
    const itemsListHtml = items.map(item => `
        <li style="margin-bottom: 5px;">
            <strong>${item.model}</strong> (${item.storage}) - ${item.color} <br>
            <span style="color: #666;">${item.price}€</span>
        </li>
    `).join('');

    // --- ENVOI DES EMAILS ---
    try {
        // 1. MAIL CLIENT (Reçu de commande)
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `✅ Commande confirmée #${order.id} - ${SHOP_NAME}`,
            html: `
            <div style="${emailStyles}">
                <h1 style="color: #000;">Merci pour votre commande !</h1>
                <p>Bonjour ${customer},</p>
                <p>Votre commande est bien enregistrée. Nous préparons vos articles.</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Récapitulatif</h3>
                    <ul style="list-style: none; padding: 0;">${itemsListHtml}</ul>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
                    <p style="font-size: 18px; font-weight: bold; text-align: right;">Total : ${total} €</p>
                </div>

                <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin-top: 20px;">
                    <p><strong>📍 Retrait en boutique :</strong><br>
                    ${SHOP_NAME}<br>${SHOP_ADDRESS}</p>
                    <p><strong>💳 Paiement :</strong> À régler sur place lors du retrait.</p>
                </div>
                
                <p style="font-size: 12px; color: #999; margin-top: 30px;">Ceci est un email automatique, merci de ne pas répondre.</p>
            </div>`
        });

        // 2. MAIL ADMIN (Alerte Vente)
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ADMIN_EMAIL,
            subject: `💰 NOUVELLE VENTE : ${total}€ (${customer})`,
            html: `
            <div style="${emailStyles}">
                <h2 style="color: green;">🤑 Nouvelle commande !</h2>
                <p><strong>Client :</strong> ${customer} (${email})</p>
                <p><strong>Total :</strong> ${total} €</p>
                <hr>
                <h3>Articles à préparer :</h3>
                <ul>${itemsListHtml}</ul>
                <a href="#" style="display: block; background: #000; color: #fff; text-decoration: none; padding: 10px; text-align: center; border-radius: 5px; margin-top: 20px;">Voir dans le Dashboard</a>
            </div>`
        });

    } catch (e) { console.error("Erreur d'envoi d'email (Commande):", e); }

    res.json(order);
  } catch (error) { 
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de la commande." }); 
  }
});

// --- 🔧 ROUTES RENDEZ-VOUS (EMAILS PROS) ---

app.get('/api/appointments', authenticateAdmin, async (req, res) => {
    const appointments = await prisma.appointment.findMany({ orderBy: { date: 'asc' } });
    res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { client, email, phone, device, issue, date, locationType } = req.body;
        
        await prisma.appointment.create({ 
            data: { 
                client, email, phone, device, 
                issue: `${issue} (${locationType})`, 
                date: new Date(date) 
            } 
        });

        const dateFormatted = new Date(date).toLocaleString('fr-FR', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });

        // --- ENVOI DES EMAILS ---
        try {
            // 1. MAIL CLIENT (Confirmation RDV)
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: `📅 Rendez-vous confirmé : ${device} - ${SHOP_NAME}`,
                html: `
                <div style="${emailStyles}">
                    <h1 style="color: #3b82f6;">Rendez-vous confirmé</h1>
                    <p>Bonjour ${client},</p>
                    <p>Votre demande de réparation a bien été prise en compte.</p>
                    
                    <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; margin: 20px 0;">
                        <p><strong>🗓 Date :</strong> ${dateFormatted}</p>
                        <p><strong>📱 Appareil :</strong> ${device}</p>
                        <p><strong>🔧 Problème :</strong> ${issue}</p>
                        <p><strong>📍 Lieu :</strong> ${locationType === 'atelier' ? "À l'atelier" : "À domicile/bureau"}</p>
                    </div>

                    <p>Si c'est à l'atelier, nous vous attendons ici :<br><strong>${SHOP_ADDRESS}</strong></p>
                    <p>Besoin de modifier ? Appelez-nous au ${SHOP_PHONE}.</p>
                </div>`
            });

            // 2. MAIL ADMIN (Nouveau Lead Réparation)
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: ADMIN_EMAIL,
                subject: `🔧 NOUVEAU RDV : ${device} (${client})`,
                html: `
                <div style="${emailStyles}">
                    <h2>🛠️ Nouvelle demande de réparation</h2>
                    <ul>
                        <li><strong>Client :</strong> ${client}</li>
                        <li><strong>Téléphone :</strong> <a href="tel:${phone}">${phone}</a></li>
                        <li><strong>Email :</strong> ${email}</li>
                        <li><strong>Appareil :</strong> ${device}</li>
                        <li><strong>Panne :</strong> ${issue}</li>
                        <li><strong>Lieu :</strong> ${locationType}</li>
                        <li><strong>Date :</strong> ${dateFormatted}</li>
                    </ul>
                </div>`
            });

        } catch (e) { console.error("Erreur d'envoi d'email (RDV):", e); }

        res.json({ message: "Rendez-vous enregistré avec succès." });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la prise de rendez-vous." }); 
    }
});

// --- DÉMARRAGE ---
app.listen(PORT, () => {
    console.log(`✅ Serveur MKRR Store démarré sur le port ${PORT}`);
    console.log(`📧 Admin Email configuré : ${ADMIN_EMAIL}`);
});