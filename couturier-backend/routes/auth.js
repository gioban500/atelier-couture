import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { initDB } from '../db.js';
import { sendResetPasswordEmail } from '../utils/email.js';

const router = express.Router();

const loginAttempts = new Map();

/**
 * POST /login - Connexion Administrateur
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const now = Date.now();
  let userAttempts = loginAttempts.get(email);

  // Si le temps de blocage est expiré, on réinitialise complètement le compteur
  if (userAttempts && userAttempts.lockUntil > 0 && userAttempts.lockUntil <= now) {
    loginAttempts.delete(email);
    userAttempts = undefined;
  }

  // Vérification si l'utilisateur est actuellement bloqué
  if (userAttempts && userAttempts.lockUntil > now) {
    const remainingMinutes = Math.ceil((userAttempts.lockUntil - now) / 60000);
    return res.status(429).json({ 
      error: `Compte temporairement bloqué. Réessayez dans ${remainingMinutes} minute(s).` 
    });
  }

  try {
    const db = await initDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return handleFailedAttempt(email, res);
    }

    const validPassword = await bcrypt.compare(password, user.password_hash || user.password);
    if (!validPassword) {
      return handleFailedAttempt(email, res);
    }

    // Connexion réussie : on nettoie les tentatives
    loginAttempts.delete(email);
    await db.run('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_couturier_local',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'authentification.' });
  }
});

function handleFailedAttempt(email, res) {
  const now = Date.now();
  let userAttempts = loginAttempts.get(email) || { count: 0, lockUntil: 0 };
  
  userAttempts.count += 1;
  
  if (userAttempts.count >= 5) {
    userAttempts.lockUntil = now + 5 * 60 * 1000; // Bloqué pour 5 minutes
    loginAttempts.set(email, userAttempts);
    return res.status(429).json({ 
      error: 'Compte temporairement bloqué pendant 5 minutes.' 
    });
  }
  
  loginAttempts.set(email, userAttempts);
  const attemptsLeft = 5 - userAttempts.count;
  return res.status(401).json({ 
    error: `Email ou mot de passe incorrect. Il vous reste ${attemptsLeft} tentative(s).` 
  });
}

/**
 * POST /forgot-password - Demande de réinitialisation de mot de passe
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'L\'email est requis.' });
    }

    const db = await initDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.json({ 
        message: 'Si un compte associe cet email, un lien de réinitialisation a été envoyé.' 
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600000;

    await db.run(
      `UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE id = ?`,
      [resetToken, expiresAt, user.id]
    );

    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ 
      message: 'Si un compte associe cet email, un lien de réinitialisation a été envoyé.'
    });

  } catch (err) {
    console.error('Erreur forgot-password:', err);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation.' });
  }
});

/**
 * POST /reset-password - Application du nouveau mot de passe
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, newPassword } = req.body;
    const passToUse = newPassword || password;

    if (!token || !passToUse) {
      return res.status(400).json({ error: 'Token et nouveau mot de passe requis.' });
    }

    if (passToUse.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    const db = await initDB();
    const now = Date.now();

    const user = await db.get(
      `SELECT * FROM users WHERE reset_token = ?`,
      [token]
    );

    if (!user || !user.reset_expires_at || user.reset_expires_at < now) {
      return res.status(400).json({ error: 'Lien invalide ou expiré.' });
    }

    const hashedPassword = await bcrypt.hash(passToUse, 10);

    await db.run(
      `UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?`,
      [hashedPassword, user.id]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.' });

  } catch (err) {
    console.error('Erreur reset-password:', err);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
});

export default router;