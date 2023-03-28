const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: { type: String, trim: true, maxLength: 150 },
    username: { type: String, trim: true,  minLength: 4, maxLength: 30, required: true, validate: {
        validator: (val) => {
            return /^([a-z0-9]+[\._]?)*$/.test(val);
        },
        message: () => "username not valid"
    }},
    email: { type: String, trim: true, validate: { 
        validator: (val) => {
            return val && val !== "" ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) : true;
        }, 
        message: () => "email not valid" 
    }},
    phone: { type: String, trim: true, minLength: 12, maxLength: 15, required: true, validate: {
        validator: (val) => {
            return /^(\+[\d]*)$/.test(val);
        },
        message: () => "phone not valid" 
    }},
    password: { type: String, required: true },
    roles: [ { type: String, ref: "Role" } ],
    image: { type: Buffer },
    gender: { type: String },
    bio: { type: String, trim: true },
    language: { type: String, ref: "Language" },
    country: { type: String, ref: "Country" },
    addresses: [ {type: mongoose.Schema.Types.ObjectId, ref: "Address" } ]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;