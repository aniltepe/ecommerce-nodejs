const mongoose = require("mongoose");

const RegionL2 = mongoose.model(
  "RegionL2",
  new mongoose.Schema({
    _id: { type: String },
    name: { type: String },
    level1: { type: String, ref: "RegionL1" }
  })
);

module.exports = RegionL2;