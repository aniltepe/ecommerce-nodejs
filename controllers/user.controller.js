const User = require("../models/user.model");
const Role = require("../models/role.model");

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

exports.createOrUpdateRoles = () => {
    let totalModified = 0;
    let totalInserted = 0;
    let totalMatch = 0;
    const roleList = ["user", "seller", "admin", "moderator"];
    roleList.forEach(r => {
        Role.updateOne({_id: r}, {_id: r}, {upsert: true}, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }
            totalModified += doc.modifiedCount;
            totalInserted += doc.upsertedCount;
            totalMatch += doc.matchedCount;
            if (totalMatch + totalInserted === roleList.length)
                console.log("roles are being created or updated", "count:", roleList.length, 
                "match:", totalMatch, "inserted:", totalInserted, "modified", totalModified);
        });
    });
}

exports.login = (req, res) => {
    User.findOne({ $or: [ {username: req.body.any}, {email: req.body.any}, {phone: req.body.any}]}, null, null,
    (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message:err});
        }
        if (user) {
            bcryptjs.compare(req.body.password, doc.password, (er, result) => {
                if (er) {
                    console.log(er);
                    return res.status(500).send({ message: er});
                }
                if (!result) {
                    return res.status(400).send({ message: "Password is invalid"});
                }
                const token = jwt.sign({ id: user._id }, 'garmnt-secret-key', { expiresIn: 86400 });
                res.status(200).send({...user, token: token})
            });
        }
    });
}

exports.signup = (req, res) => {
    console.log("user signup request received")
    User.findOne({ $or: [ {username: req.body.username}, req.body.email !== "" ? {email: req.body.email} : {}, {phone: req.body.phone}]}, null, null,
    (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: err});
        }
        if (user) {
            return res.status(400).send({ message: 'Username, email or phone already exists'});
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(req.body.password))
            return res.status(400).send({ message: 'Password is weak'});
        bcryptjs.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: err});
            }
            const user = new User({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                roles: ["user"],
                language: req.body.language,
                country: req.body.country,
                password: hash
            });
            user.save((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: err});
                }
                console.log("user signed up successfully");
                res.status(200).send({ message: "User signed up successfully" });
            })
        });
    });
    
}

exports.checkUsernameExists = (req, res) => {
    // console.log("checking username, value:", req.params.username);
    User.findOne({ username: req.params.username }, null, null,
    (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: err });
        }
        if (user) {
            // console.log("found username")
            return res.status(200).send(true);
        }
        return res.status(200).send(false);
    });
}

exports.checkEmailExists = (req, res) => {
    // console.log("checking email, value:", req.params.email);
    User.findOne({ email: req.params.email }, null, null,
    (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: err });
        }
        if (user) {
            // console.log("found email")
            return res.status(200).send(true);
        }
        return res.status(200).send(false);
    });
}

exports.checkPhoneExists = (req, res) => {
    // console.log("checking phone, value:", req.params.phone);
    User.findOne({ phone: req.params.phone }, null, null,
    (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: err });
        }
        if (user) {
            // console.log("found phone")
            return res.status(200).send(true);
        }
        return res.status(200).send(false);
    });
}