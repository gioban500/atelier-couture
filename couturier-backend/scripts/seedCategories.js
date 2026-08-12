import { initDB } from '../db.js';
import bcrypt from 'bcryptjs';

const categories = [
  { name: 'Costumes', slug: 'costumes' },
  { name: 'Robes', slug: 'robes' },
  { name: 'Tenues Traditionnelles', slug: 'tenues-traditionnelles' },
  { name: 'Retouches', slug: 'retouches' },
  { name: 'Stylisme & Design', slug: 'stylisme-design' },
  { name: 'Chemises', slug: 'chemises' },
  { name: 'Accessoires', slug: 'accessoires' },
];

const portfolioItems = [
  // --- COSTUMES (category_id: 1) ---
  {
    title: 'Costume 3 Pièces Sur-Mesure',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    position: 1
  },
  {
    title: 'Costume Cérémonie Bleu Nuit',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    position: 2
  },
  {
    title: 'Smoking Sur-Mesure Col Satin',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    position: 3
  },
  {
    title: 'Veste d\'Affaires Ajustée',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
    position: 4
  },

  // --- ROBES (category_id: 2) ---
  {
    title: 'Robe de Gala en Soie',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
    position: 5
  },
  {
    title: 'Robe de Mariée Sur-Mesure',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
    position: 6
  },
  {
    title: 'Robe de Cocktail Élégante',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    position: 7
  },
  {
    title: 'Robe de Soirée Draperie',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    position: 8
  },

  // --- TENUES TRADITIONNELLES (category_id: 3) ---
  {
    title: 'Ensemble Wax Contemporain',
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    position: 9
  },
  {
    title: 'Agbada Royal Brodé',
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    position: 10
  },
  {
    title: 'Tenue Traditionnelle Femme Wax',
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
    position: 11
  },

  // --- RETOUCHES (category_id: 4) ---
  {
    title: 'Ajustement & Precision Veste',
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    position: 12
  },
  {
    title: 'Retouche Haute Couture',
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1528575910086-38fa5531833a?q=80&w=800&auto=format&fit=crop',
    position: 13
  },
  {
    title: 'Finitions à la Main',
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1605289355680-75fb4526f618?q=80&w=800&auto=format&fit=crop',
    position: 14
  },

  // --- STYLISME & DESIGN (category_id: 5) ---
  {
    title: 'Croquis & Design Sur-Mesure',
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    position: 15
  },
  {
    title: 'Patronage & Création Textile',
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop',
    position: 16
  },

  // --- CHEMISES (category_id: 6) ---
  {
    title: 'Chemise Prestige Coton Egyptien',
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    position: 17
  },
  {
    title: 'Chemise Col Officier',
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    position: 18
  },
  {
    title: 'Chemise Blanche Cérémonie',
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=800&auto=format&fit=crop',
    position: 19
  },

  // --- ACCESSOIRES (category_id: 7) ---
  {
    title: 'Pochette & Cravate Assorties',
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    position: 20
  },
  {
    title: 'Boutons de Manchette & Noeud Papillon',
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    position: 21
  }
];

async function seed() {
  try {
    const db = await initDB();

    console.log('📝 Ajout des catégories...');
    for (const cat of categories) {
      await db.run(
        'INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)',
        [cat.name, cat.slug]
      );
    }
    console.log('✅ Catégories ajoutées!');

    console.log('📸 Ajout du portfolio...');
    for (const item of portfolioItems) {
      await db.run(
        'INSERT INTO portfolio (title, image_url, category_id, position) VALUES (?, ?, ?, ?)',
        [item.title, item.image_url, item.category_id, item.position]
      );
    }
    console.log('✅ Portfolio ajouté (21 articles)!');

    console.log('🔐 Ajout de l\'admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      ['admin@atelier.tg', hashedPassword, 'admin']
    );
    console.log('✅ Admin ajouté! Email: admin@atelier.tg, Mot de passe: admin123');

    console.log('\n🎉 Base de données peuplée avec succès!');
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

seed();