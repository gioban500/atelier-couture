import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

export async function initDB() {
  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`PRAGMA foreign_keys = ON;`);

  // Lecture et exécution du fichier db.sql
  const sqlScript = fs.readFileSync(path.join(process.cwd(), 'config', 'db.sql'), 'utf-8');
  await db.exec(sqlScript);
  

  console.log(' Base de données SQLite initialisée via config/db.sql !');
  return db;
}