const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ }, // Email validation
  name: { type: String, required: true },
  surname: { type: String, required: true },
  country: { type: String, default: null },
  password: { type: String, required: true, minlength: 8 },
  isActive: { type: Boolean, default: false },
  activationToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  isLogin: { type: Boolean, default: false },

}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


// Compare hashed passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.activationToken;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
