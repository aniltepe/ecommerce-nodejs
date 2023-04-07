const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userAgent: { type: String },
    ip: { type: String },
    remember: { type: Boolean },
    accessToken: { type: String },
    refreshToken: { type: String },
    expireAt: { type: Date }
}, {timestamps: true});

sessionSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;