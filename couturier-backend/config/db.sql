-- config/db.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  reset_token TEXT,
  reset_expires_at TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  archived_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_img_url TEXT,
  status TEXT DEFAULT 'Nouveau',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS devis_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  devis_id INTEGER NOT NULL REFERENCES devis(id) ON DELETE CASCADE,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  devis_id INTEGER REFERENCES devis(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  
  -- Stature
  height INTEGER,          -- Stature globale (cm)
  
  -- Haut du corps
  neck_circ INTEGER,       -- Tour de cou (cm)
  shoulder_width INTEGER,  -- Carrure dos (cm)
  chest INTEGER,           -- Tour de poitrine (cm)
  waist INTEGER,           -- Tour de taille (cm)
  arm_length INTEGER,      -- Longueur de manche (cm)
  bicep_circ INTEGER,      -- Tour de biceps (cm)
  
  -- Bas du corps
  hips INTEGER,            -- Tour de bassin (cm)
  thigh_circ INTEGER,      -- Tour de cuisse (cm)
  inside_leg INTEGER,      -- Entrejambe (cm)
  outside_leg INTEGER,     -- Longueur jambe externe (cm)
  
  photo_url TEXT,          -- Image encodée en Base64
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);