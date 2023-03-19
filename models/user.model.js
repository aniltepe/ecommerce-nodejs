const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullname: { type: String, trim: true },
    username: { type: String, trim: true,  minLength: 4, maxLength: 30, index: true, unique: true, required: true },
    email: { type: String, trim: true, index: true, unique: true },
    phone: { type: String, trim: true, index: true, unique: true, minLength: 10, required: true },
    password: { type: String, required: true },
    roles: [ { type: mongoose.Schema.Types.ObjectId, ref: "Role" } ],
    image: { type: Buffer },
    gender: { type: String },
    bio: { type: String, trim: true },
    lang: { type: String, ref: "Lang" },
    country: { type: String, ref: "Country" },
    addresses: [ {type: mongoose.Schema.Types.ObjectId, ref: "Address" } ]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;