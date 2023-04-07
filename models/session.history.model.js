const mongoose = require('mongoose');

const sessionHistorySchema = mongoose.Schema({
    activeSession: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userAgent: { type: String },
    ip: { type: String },
    remember: { type: Boolean },
    expireAt: { type: Date }
}, {timestamps: true});

const SessionHistory = mongoose.model('SessionHistory', sessionHistorySchema);

module.exports = SessionHistory;