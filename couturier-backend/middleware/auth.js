import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Session non authentifiée.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_couturier_local');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Votre session a expiré. Veuillez vous reconnecter.' });
  }
};