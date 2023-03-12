const mongoose = require("mongoose");

const RegionL0 = mongoose.model(
  "RegionL0",
  new mongoose.Schema({
    _id: { type: String },
    name: { type: String }
  })
);

module.exports = RegionL0;