import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/measurements - Liste globale
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT cm.id, cm.client_name, cm.devis_id, cm.height, cm.chest, cm.waist, cm.hips, 
           cm.arm_length, cm.outside_leg, cm.photo_url, d.service_type
    FROM client_measurements cm
    LEFT JOIN devis d ON cm.devis_id = d.id
    ORDER BY cm.updated_at DESC
    LIMIT 50
  `;
  try {
    const rows = db.prepare(query).all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des mesures' });
  }
});

// GET /api/measurements/:id - Détail client
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM client_measurements WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Mesures introuvables' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du détail' });
  }
});

// POST /api/measurements - Création
router.post('/', authenticateToken, (req, res) => {
  const {
    devis_id, client_name, client_phone, client_email,
    height, neck_circ, shoulder_width, chest, waist, arm_length, bicep_circ,
    hips, thigh_circ, inside_leg, outside_leg,
    photo_url, notes
  } = req.body;

  if (!client_name || !height) {
    return res.status(400).json({ error: 'Le nom du client et la stature globale sont requis.' });
  }

  const query = `
    INSERT INTO client_measurements 
    (devis_id, client_name, client_phone, client_email, 
     height, neck_circ, shoulder_width, chest, waist, arm_length, bicep_circ,
     hips, thigh_circ, inside_leg, outside_leg, photo_url, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const info = db.prepare(query).run(
      devis_id || null, client_name, client_phone || '', client_email || '',
      height || 0, neck_circ || 0, shoulder_width || 0, chest || 0, waist || 0, 
      arm_length || 0, bicep_circ || 0, hips || 0, thigh_circ || 0, 
      inside_leg || 0, outside_leg || 0, photo_url || '', notes || ''
    );
    res.status(201).json({ id: info.lastInsertRowid, message: 'Mesures créées avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création des mesures' });
  }
});

// PATCH /api/measurements/:id - Modification
router.patch('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const allowedKeys = [
    'client_name', 'client_phone', 'client_email', 
    'height', 'neck_circ', 'shoulder_width', 'chest', 'waist', 'arm_length', 'bicep_circ',
    'hips', 'thigh_circ', 'inside_leg', 'outside_leg', 'photo_url', 'notes'
  ];

  const updates = [];
  const values = [];

  Object.keys(fields).forEach(key => {
    if (allowedKeys.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE client_measurements SET ${updates.join(', ')} WHERE id = ?`;

  try {
    const result = db.prepare(query).run(...values);
    if (result.changes === 0) return res.status(404).json({ error: 'Client introuvable' });
    res.json({ message: 'Mesures mises à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// DELETE /api/measurements/:id - Suppression
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM client_measurements WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Client introuvable' });
    res.json({ message: 'Mesures supprimées avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;