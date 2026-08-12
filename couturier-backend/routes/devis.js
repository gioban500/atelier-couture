import express from 'express';
import { initDB } from '../db.js';
import rateLimit from 'express-rate-limit';
import { sendNewDevisNotificationToCouturier, sendClientConfirmationEmail } from '../utils/email.js';

const router = express.Router();

/**
 * RATE LIMITING: Max 10 devis par IP par jour (Spécification C-07)
 */
const devisLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  message: 'Trop de demandes. Veuillez réessayer demain.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /devis - Soumission avec validation et envoi de mail
 */
router.post('/', devisLimiter, async (req, res) => {
  try {
    const { 
      client_name, 
      client_phone, 
      client_email, 
      service_type, 
      description, 
      reference_img_url 
    } = req.body;

    // Validations (C-07)
    if (!client_name || client_name.length < 3 || client_name.length > 100) {
      return res.status(400).json({ error: 'Le nom doit contenir entre 3 et 100 caractères.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!client_email || !emailRegex.test(client_email)) {
      return res.status(400).json({ error: 'Email invalide.' });
    }

    const phoneRegex = /^[+]?[\d\s().-]{9,}$/;
    if (!client_phone || !phoneRegex.test(client_phone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    }

    if (!description || description.length < 10 || description.length > 1000) {
      return res.status(400).json({ error: 'La description doit faire entre 10 et 1000 caractères.' });
    }

    const validServiceTypes = {
      'sur-mesure': 'Sur-mesure',
      'retouche': 'Retouche',
      'personnalisation': 'Personnalisation',
      'autre': 'Autre'
    };

    const rawServiceType = typeof service_type === 'string' ? service_type.trim() : '';
    const normalizedServiceType = rawServiceType.toLowerCase();

    if (!rawServiceType || !validServiceTypes[normalizedServiceType]) {
      return res.status(400).json({ error: 'Type de prestation invalide.' });
    }

    const normalizedType = validServiceTypes[normalizedServiceType];

    // Insertion BDD
    const db = await initDB();
    const result = await db.run(
      `INSERT INTO devis (client_name, client_phone, client_email, service_type, description, reference_img_url, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Nouveau', datetime('now'))`,
      [client_name, client_phone, client_email, normalizedType, description, reference_img_url || null]
    );

    const devisId = result.lastID;

    // Notifications email SMTP (asynchrones)
    const newDevisData = {
      id: devisId,
      client_name,
      client_phone,
      client_email,
      service_type: normalizedType,
      description,
      reference_img_url: reference_img_url || null
    };

    sendNewDevisNotificationToCouturier(newDevisData).catch(err => 
      console.error('❌ Erreur notif mail couturier:', err)
    );
    sendClientConfirmationEmail(client_email, client_name).catch(err => 
      console.error('❌ Erreur notif mail client:', err)
    );

    res.status(201).json({
      success: true,
      message: 'Votre demande a bien été transmise ! Vous recevrez une réponse dans les 24-48h.',
      devis_id: devisId
    });

  } catch (error) {
    console.error('❌ Erreur soumission devis:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la soumission. Veuillez réessayer.' });
  }
});

/**
 * GET /devis - Liste tous les devis
 */
router.get('/', async (req, res) => {
  try {
    const db = await initDB();
    const devis = await db.all(`SELECT *, reference_img_url AS image_url FROM devis ORDER BY created_at DESC`);
    res.json(devis);
  } catch (error) {
    console.error('❌ Erreur récupération devis:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/**
 * GET /devis/:id - Récupère un devis par ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDB();
    const devis = await db.get(`SELECT *, reference_img_url AS image_url FROM devis WHERE id = ?`, [id]);

    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé.' });
    }

    res.json(devis);
  } catch (error) {
    console.error('❌ Erreur récupération devis:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

export default router;