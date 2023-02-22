const fs = require('fs');
const path = require('path');
const Country = require("../models/country.model");
const Locale = require('../models/locale.model');
const RegionL1 = require("../models/regionl1.model");
const RegionL2 = require("../models/regionl2.model");

const FILE_DATA_PATH = "../files/data/";
const FILE_COUNTRIES_NAME = "countries.json";
const FILE_ICONS_PATH = "../files/icons/";
const FILE_REGIONSL1_PATH = "../files/data/regionsl1/";
const FILE_REGIONSL2_PATH = "../files/data/regionsl2/";
const FILE_LOCALES_PATH = "../files/data/locales/";

exports.createOrUpdateCountries = () => {
    let totalModified = 0;
    let totalInserted = 0;
    let totalMatch = 0;
    const countryList = require(FILE_DATA_PATH + FILE_COUNTRIES_NAME);
    countryList.forEach(c => {
        const path_svg = FILE_ICONS_PATH + c._id + ".svg";
        const file_path = path.resolve(__dirname, path_svg);
        const b64_svg = fs.readFileSync(file_path);
        c["icon"] = b64_svg.toString('base64');
        Country.updateOne({_id: c._id}, c, {upsert: true}, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }
            totalModified += doc.modifiedCount;
            totalInserted += doc.upsertedCount;
            totalMatch += doc.matchedCount;
            if (totalMatch + totalInserted === countryList.length)
                console.log("countries are being created or updated from file", FILE_COUNTRIES_NAME, "count:", countryList.length, 
                "match:", totalMatch, "inserted:", totalInserted, "modified", totalModified);
        });
    });
}

exports.createOrUpdateRegionsL1 = () => {
    const dirPath = path.resolve(__dirname, FILE_REGIONSL1_PATH);
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => path.extname(entry.name) === ".json")
      .map(entry => entry.name);
    files.forEach(f => {
        let totalModified = 0;
        let totalInserted = 0;
        let totalMatch = 0;
        const regionList = require(FILE_REGIONSL1_PATH + f);
        regionList.forEach(r => {
            RegionL1.updateOne({_id: r._id}, r, {upsert: true}, (err, doc) => {
                if (err) {
                    console.log(err);
                    return;
                }
                totalModified += doc.modifiedCount;
                totalInserted += doc.upsertedCount;
                totalMatch += doc.matchedCount;
                if (totalMatch + totalInserted === regionList.length)
                    console.log("level 1 regions are being created or updated from file", f, "count:", regionList.length,
                    "match:", totalMatch, "inserted:", totalInserted, "modified", totalModified);
            });
        });
    });
}

exports.createOrUpdateRegionsL2 = () => {
    const dirPath = path.resolve(__dirname, FILE_REGIONSL2_PATH);
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => path.extname(entry.name) === ".json")
      .map(entry => entry.name);
    files.forEach(f => {
        let totalModified = 0;
        let totalInserted = 0;
        let totalMatch = 0;
        const regionList = require(FILE_REGIONSL2_PATH + f);
        regionList.forEach(r => {
            RegionL2.updateOne({_id: r._id}, r, {upsert: true}, (err, doc) => {
                if (err) {
                    console.log(err);
                    return;
                }
                totalModified += doc.modifiedCount;
                totalInserted += doc.upsertedCount;
                totalMatch += doc.matchedCount;
                if (totalMatch + totalInserted === regionList.length)
                    console.log("level 2 regions are being created or updated from file", f, "count:", regionList.length, 
                    "match:", totalMatch, "inserted:", totalInserted, "modified", totalModified);
            });
        });
    });
}

exports.createOrUpdateLocales = () => { 
    let totalModified = 0;
    let totalInserted = 0;
    let totalMatch = 0;
    const dirPath = path.resolve(__dirname, FILE_LOCALES_PATH);
    const codes = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    codes.forEach(code => {
        const l = { "_id": code };
        const nsPath = path.resolve(__dirname, FILE_LOCALES_PATH + code);
        const ns = fs.readdirSync(nsPath, { withFileTypes: true })
            .filter(entry => path.extname(entry.name) === ".json")
            .map(entry => entry.name);

        ns.forEach(n => {
            l[n.split(".")[0]] = require(FILE_LOCALES_PATH + code + "/" + n);
        });
        Locale.updateOne({_id: code}, l, {upsert: true}, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }
            totalModified += doc.modifiedCount;
            totalInserted += doc.upsertedCount;
            totalMatch += doc.matchedCount;
            if (totalMatch + totalInserted === codes.length)
                console.log("locales are being created or updated from files", "count:", codes.length, 
                "match:", totalMatch, "inserted:", totalInserted, "modified", totalModified);
        });
    });
}

exports.getLocales = async (req, res) => {
    console.log("returning locales list");
    const sampleDoc = await Locale.findOne({}, {_id: 0, __v: 0}).then(res => {return res}).catch(err => console.log(err));
    Locale.aggregate([{$sort: {"main.order": 1}}, {$project: {_id: 0, id:"$_id", name: "$main.name", namespaces: Object.keys(sampleDoc._doc)}}], null, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send({msg:err});
        }
        return res.status(200).json(docs);
    });
}

exports.getCountries = (req, res) => {
    console.log("returning countries list");
    Country.aggregate([{$sort: {displayOrder:1}}, {$project: {_id: 0, id:"$_id", name: 1, preferredLang: 1, dialCode: 1}}], null,
        (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send({msg:err});
        }
        return res.status(200).json(docs);
    });
}

