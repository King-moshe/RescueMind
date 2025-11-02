const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header || !String(header).startsWith('Bearer ')) return res.status(401).json({ status: 'error', message: 'Missing token' });
  const token = String(header).split(' ')[1];
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) throw new Error('ACCESS_TOKEN_SECRET not set');
    const payload = jwt.verify(token, secret);
    req.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}

module.exports = requireAuth;
