const mongoose = require("mongoose");

const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
    title: { type: String, trim: true },
    country: { type: String, ref: "Country" },
    level1: { type: String, ref: "RegionL1" },
    level2: { type: String, ref: "RegionL2" },
    address: { type: String, trim: true },
    description: { type: String, trim: true },
    zipcode: { type: Number }
  })
);

module.exports = Address;