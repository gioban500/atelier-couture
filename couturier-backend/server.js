import dotenv from 'dotenv';
dotenv.config(); // ⬅️ Chargement des variables d'environnement en premier

import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';

// Chargement des routes
import authRoutes from './routes/auth.js';
import devisRoutes from './routes/devis.js';
import portfolioRoutes from './routes/portfolio.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
app.use(cors({
  origin: ['http://atelier.miabetepe.com', 'https://atelier.miabetepe.com'],
  
  credentials: true
}));

// Augmentation de la limite du body pour accepter les images en Base64 (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialisation BDD
initDB();

// Liaison des routes
app.use('/api/auth', authRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// Route de santé (Health Check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Couturier fonctionnelle sur ' + PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend en écoute sur : http://localhost:${PORT}`);
});