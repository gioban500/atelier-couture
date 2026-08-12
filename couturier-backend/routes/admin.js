import express from 'express';
import { initDB } from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Application globale de la sécurité sur /api/admin
router.use(authenticateJWT);

// GET /api/admin/devis (Consulter les devis)
router.get('/devis', async (req, res) => {
  try {
    const { status } = req.query;
    const db = await initDB();

    // On ajoute l'alias reference_img_url AS image_url pour le frontend
    let query = 'SELECT *, reference_img_url AS image_url FROM devis';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const list = await db.all(query, params);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des devis.' });
  }
});

// PUT /api/admin/devis/:id/status (Changer statut + Historique)
router.put('/devis/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Nouveau', 'En attente', 'Traité', 'Archivé'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut demandé non valide.' });
    }

    const db = await initDB();
    const currentDevis = await db.get('SELECT status FROM devis WHERE id = ?', [id]);

    if (!currentDevis) {
      return res.status(404).json({ error: 'Devis introuvable.' });
    }

    const oldStatus = currentDevis.status;

    // Mise à jour du statut principal
    await db.run(
      `UPDATE devis SET status = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE id = ?`,
      [status, req.user.id, id]
    );

    // Historisation (Section 6.1)
    await db.run(
      `INSERT INTO devis_history (devis_id, old_status, new_status, changed_by)
       VALUES (?, ?, ?, ?)`,
      [id, oldStatus, status, req.user.id]
    );

    res.json({ message: `Statut mis à jour : ${oldStatus} -> ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
});

// DELETE /api/admin/portfolio/:id (Suppression définitive)
router.delete('/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDB();

    await db.run('DELETE FROM portfolio WHERE id = ?', [id]);
    res.json({ message: 'Création supprimée du portfolio.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

export default router;