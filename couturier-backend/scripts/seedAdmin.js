import bcrypt from 'bcryptjs';
import { initDB } from '../db.js';

async function seedAdmin() {
  try {
    const db = await initDB();
    const adminEmail = 'mangavolmet@gmail.com';
    const rawPassword = 'Admin123';

    // Vérifier si l'admin existe déjà
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);
    
    if (existingUser) {
      console.log(' L\'utilisateur admin existe déjà.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    await db.run(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')`,
      [adminEmail, passwordHash]
    );

    console.log(' Admin initial créé avec succès !');
    console.log(` Identifiants : ${adminEmail} / ${rawPassword}`);
    process.exit(0);
  } catch (err) {
    console.error(' Erreur lors de la création de l\'admin :', err);
    process.exit(1);
  }
}

seedAdmin();