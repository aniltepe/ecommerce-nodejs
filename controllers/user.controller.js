const fs = require('fs');
const path = require('path');
const User = require("../models/user.model");
const Role = require("../models/role.model");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Session = require('../models/session.model');
const SessionHistory = require('../models/session.history.model');
const ms = require("ms");

const SALT_ROUNDS = 10;
const USER_PLACEHOLDER_IMAGE_PATH = "../files/images/user.png";
const SHORT_TERM_EXP = "15m";
const LONG_TERM_EXP = "30d";

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

exports.auth = (req, res) => {
    if (req.cookies["refresh-token"]) {
        jwt.verify(req.cookies["refresh-token"], 'garmnt-refresh-key', function(err, decoded) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: err });
            }
            const filter = {
                user: decoded.id,
                refreshToken: req.cookies["refresh-token"],
                userAgent: req.headers['user-agent'],
                ip: req.ip
            }
            Session.findOne(filter, null, null, (err_session, sesh) => {
                if (err_session) {
                    console.log(err_session);
                    return res.status(500).send({ message: err_session });
                }
                if (sesh) {
                    User.findById(sesh.user,
                        {_id: 0, id:"$_id", fullname: 1, username: 1, email: 1, phone: 1, roles: 1, language: 1, country: 1, addresses: 1, createdAt: 1, password: 1, image: 1}, 
                        null, (err_user, user) => {
                            if (err_user) {
                                console.log(err_user);
                                return res.status(500).send({ message: err_user });
                            }
                            const expiry = sesh.remember ? LONG_TERM_EXP : SHORT_TERM_EXP;
                            const accessToken = jwt.sign({ id: user._doc.id }, 'garmnt-secret-key', { expiresIn: expiry });
                            const refreshToken = jwt.sign({ id: user._doc.id }, 'garmnt-refresh-key', { expiresIn: expiry });
                            Session.findOneAndUpdate({_id: sesh._id}, {accessToken: accessToken, refreshToken: refreshToken, expireAt: Date.now() + ms(expiry)}, 
                                (err_sesh, doc) => {
                                    if (err_sesh) {
                                        console.log(err_sesh);
                                        return res.status(500).send({ message: err_sesh });
                                    }
                                    SessionHistory.findOneAndUpdate({activeSession: sesh._id}, {expireAt: Date.now() + ms(expiry)}, (err_sesh_hist, doc_hist) => {
                                        if (err_sesh_hist) {
                                            console.log(err_sesh_hist);
                                            return res.status(500).send({ message: err_sesh_hist });
                                        }
                                        res.cookie('refresh-token', refreshToken, {secure: true, sameSite: 'none', maxAge: sesh.remember ? ms(LONG_TERM_EXP) : ms(SHORT_TERM_EXP)});
                                        return res.status(200).send({...user._doc, password: undefined, accessToken: accessToken, session: sesh._id});
                                    });
                                }
                            )
                            
                        }
                    )
                }
                else {
                    res.clearCookie('refresh-token', {secure: true, sameSite: 'none', maxAge: (decoded.exp - decoded.iat) * 1000 });
                    return res.status(404).send({ message: "no session found related with refresh-token"});
                }
            })
        });
    }
    else {
        return res.status(401).send({ message: "no cookie"});
    }
}

exports.login = (req, res) => {
    let criteria = undefined;
    if (/^([\+])?([0-9]){10,13}$/.test(req.body.any))
        criteria = {phone: req.body.any.startsWith("+") ? req.body.any : { $regex: '.*' + req.body.any + '.*'}};
    else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.any))
        criteria = {email: req.body.any};
    else if (/^([a-z0-9]+[\._]?)*$/.test(req.body.any))
        criteria = {username: req.body.any};
    else
        return res.status(404).send({ message: "The information is neither username nor email nor phone"});

    User.findOne(criteria,
        {_id: 0, id:"$_id", fullname: 1, username: 1, email: 1, phone: 1, roles: 1, language: 1, country: 1, addresses: 1, createdAt: 1, password: 1, image: 1},
        null, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: err });
        }
        if (user) {
            bcryptjs.compare(req.body.password, user.password, (er, result) => {
                if (er) {
                    console.log(er);
                    return res.status(500).send({ message: er });
                }
                if (result) {
                    const accessToken = jwt.sign({ id: user._doc.id }, 'garmnt-secret-key', { expiresIn: req.body.remember ? LONG_TERM_EXP : SHORT_TERM_EXP });
                    const refreshToken = jwt.sign({ id: user._doc.id }, 'garmnt-refresh-key', { expiresIn: req.body.remember ? LONG_TERM_EXP : SHORT_TERM_EXP });
                    const sesh = {
                        user: user._doc.id,
                        userAgent: req.headers['user-agent'],
                        ip: req.ip,
                        remember: req.body.remember,
                        expireAt: req.body.remember ? Date.now() + ms(LONG_TERM_EXP) : Date.now() + ms(SHORT_TERM_EXP),
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                    Session.create(sesh, (err_sesh, doc) => {
                        if (err_sesh) {
                            console.log(err_sesh);
                            return res.status(500).send({ message: err_sesh });
                        }
                        SessionHistory.create({...sesh, accessToken: undefined, refreshToken: undefined, activeSession: doc._id}, (err_sesh_hist, doc_hist) => {
                            if (err_sesh_hist) {
                                console.log(err_sesh_hist);
                                return res.status(500).send({ message: err_sesh_hist });
                            }
                            res.cookie('refresh-token', refreshToken, {secure: true, sameSite: 'none', maxAge: req.body.remember ? ms(LONG_TERM_EXP) : ms(SHORT_TERM_EXP)});
                            return res.status(200).send({...user._doc, password: undefined, accessToken: accessToken, session: doc._id});
                        });
                    });
                }
                else {
                    return res.status(401).send({ message: "Password is invalid" });
                }
            });
        }
        else {
            return res.status(404).send({message: "User not found"});
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
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/.test(req.body.password))
            return res.status(400).send({ message: 'Password is weak'});
        bcryptjs.hash(req.body.password, SALT_ROUNDS, (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: err});
            }
            const userimagepath = path.resolve(__dirname, USER_PLACEHOLDER_IMAGE_PATH);
            const userimagebuffer = fs.readFileSync(userimagepath);
            const user = new User({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                roles: ["user"],
                language: req.body.language,
                country: req.body.country,
                image: userimagebuffer.toString("base64"),
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

exports.logout = (req, res) => {
    const filter = {
        user: req.body.id,
        accessToken: req.headers["x-access-token"],
        userAgent: req.headers['user-agent'],
        ip: req.ip
    }
    Session.findOneAndDelete(filter, null, (err_sesh, doc) => {
        if (err_sesh) {
            console.log(err_sesh);
            return res.status(500).send({ message: err_sesh });
        }
        SessionHistory.findOneAndUpdate({activeSession: doc._id}, {expireAt: Date.now()}, (err_sesh_hist, doc_hist) => {
            if (err_sesh_hist) {
                console.log(err_sesh_hist);
                return res.status(500).send({ message: err_sesh_hist });
            }
            jwt.verify(req.cookies["refresh-token"], 'garmnt-refresh-key', (err_jwt, decoded) => {
                if (err_jwt) {
                    console.log(err_jwt);
                    return res.status(500).send({ message: err_jwt });
                }
                res.clearCookie('refresh-token', {secure: true, sameSite: 'none', maxAge: (decoded.exp - decoded.iat) * 1000 });
                return res.status(200).send({ message: "logout successful"});
            });
        });
    })
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