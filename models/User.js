const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ }, // Email validation
  name: { type: String, required: true },
  surname: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 }, // Ensure strong passwords
  isActive: { type: Boolean, default: false }, // For email verification
  activationToken: { type: String, default: null }, // For account activation flow
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
});


// Compare hashed passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON responses
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password; // Do not expose the password
    delete ret.activationToken; // Do not expose activation tokens
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
