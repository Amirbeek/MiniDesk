const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const eventSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        default: "No Title"
    },
    location: {
        type: String,
        default: "Not provided"
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'], // Define repeat types
        default: 'none'
    },
    customRepeatInterval: {
        type: Number, // Interval in days for custom repeat
        default: null
    },
    timezone: {
        type: String,
        default: "UTC" // Default to UTC
    }
});


const UserSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true, minlength: 3 },
      email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ },
      name: { type: String, required: true },
      surname: { type: String, required: true },
      country: { type: String, default: null },
      password: { type: String, required: true, minlength: 8 },
      isActive: { type: Boolean, default: false },
      activationToken: { type: String, default: null },
      resetPasswordToken: { type: String, default: null },
      events: [eventSchema],
    },
    { timestamps: true }
);

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
