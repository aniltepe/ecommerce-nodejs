const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clientUserAgent: { type: String },
    ip: { type: String }
}, {timestamps: true});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;