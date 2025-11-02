const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['medic', 'doctor'], default: 'medic' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

// phone format validator (E.164-like)
userSchema.path('phone').validate(function (v) {
  if (!v) return false;
  // allow + followed by 8-15 digits (simple E.164-like)
  return /^\+?[1-9]\d{7,14}$/.test(v);
}, 'Invalid phone number format');

// password length validator
userSchema.path('password').validate(function (v) {
  return v && v.length >= 8;
}, 'Password must be at least 8 characters long');

// hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// helper to compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
