const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string().trim().pattern(/^\+?[1-9]\d{7,14}$/).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('medic', 'doctor').optional()
});

const loginSchema = Joi.object({
  phone: Joi.string().trim().required(),
  password: Joi.string().required()
});

function signToken(user) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error('ACCESS_TOKEN_SECRET not set');
  const payload = { userId: user._id.toString(), role: user.role };
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '1h' });
}

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const existing = await User.findOne({ phone: value.phone });
    if (existing) return res.status(409).json({ status: 'error', message: 'Phone already registered' });

    const user = new User({ name: value.name, phone: value.phone, password: value.password, role: value.role });
    await user.save();

    const token = signToken(user);
    return res.json({ status: 'success', data: { accessToken: token } });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const user = await User.findOne({ phone: value.phone });
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const ok = await user.comparePassword(value.password);
    if (!ok) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ status: 'success', data: { accessToken: token } });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
