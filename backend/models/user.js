const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// schéma des utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// s'assurer que deux utilisateurs ne puissent pas avoir la même adresse e-mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);