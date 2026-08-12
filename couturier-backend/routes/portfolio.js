import express from 'express';
import { initDB } from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/portfolio (Public - Galerie filtrable)
router.get('/', async (req, res) => {
  try {
    const { category_id } = req.query;
    const db = await initDB();

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM portfolio p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.archived_at IS NULL
    `;
    const params = [];

    if (category_id) {
      query += ` AND p.category_id = ?`;
      params.push(category_id);
    }

    query += ` ORDER BY p.position ASC, p.created_at DESC`;

    const items = await db.all(query, params);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement du portfolio.' });
  }
});

// GET /api/portfolio/categories (Public - Liste des catégories)
router.get('/categories', async (req, res) => {
  try {
    const db = await initDB();
    const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement des catégories.' });
  }
});

// POST /api/portfolio (Protégé - Ajout d'image)
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, image_url, category_id, position } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Titre et URL de l\'image obligatoires.' });
    }

    const db = await initDB();
    const result = await db.run(
      `INSERT INTO portfolio (title, image_url, category_id, position)
       VALUES (?, ?, ?, ?)`,
      [title, image_url, category_id || null, position || 0]
    );

    res.status(201).json({
      message: 'Photo ajoutée et visible sur votre site !',
      id: result.lastID
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la photo.' });
  }
});

// ⚠️ PATCH /api/portfolio/reorder DOIT ÊTRE AVANT PATCH /:id ⚠️
// PATCH /api/portfolio/reorder (Protégé - Réordonner les photos)
router.patch('/reorder', authenticateJWT, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Liste d\'items invalide.' });
    }

    const db = await initDB();

    // Mettre à jour chaque item avec sa nouvelle position
    for (const item of items) {
      const { id, position } = item;

      if (typeof id !== 'number' || typeof position !== 'number') {
        return res.status(400).json({ error: 'Format d\'item invalide.' });
      }

      await db.run(
        `UPDATE portfolio SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [position, id]
      );
    }

    res.json({ 
      message: '✅ Ordre mis à jour',
      updated: items.length 
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'ordre.' });
  }
});

// PATCH /api/portfolio/:id (Protégé - Modifier une photo)
router.patch('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category_id, position } = req.body;

    const db = await initDB();
    const portfolio = await db.get('SELECT * FROM portfolio WHERE id = ?', [id]);

    if (!portfolio) {
      return res.status(404).json({ error: 'Photo introuvable.' });
    }

    await db.run(
      `UPDATE portfolio SET title = ?, category_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title || portfolio.title, category_id || portfolio.category_id, position ?? portfolio.position, id]
    );

    res.json({ message: 'Photo mise à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// PUT /api/portfolio/:id/archive (Protégé - Archiver une photo)
router.put('/:id/archive', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDB();

    await db.run(
      `UPDATE portfolio SET archived_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Photo archivée avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'archivage.' });
  }
});

// DELETE /api/portfolio/:id (Protégé - Suppression définitive)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDB();

    const portfolio = await db.get('SELECT * FROM portfolio WHERE id = ?', [id]);
    if (!portfolio) {
      return res.status(404).json({ error: 'Photo introuvable.' });
    }

    await db.run('DELETE FROM portfolio WHERE id = ?', [id]);
    res.json({ message: 'Création supprimée du portfolio.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

export default router;