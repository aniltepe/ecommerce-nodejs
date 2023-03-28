const mongoose = require("mongoose");

const Language = mongoose.model(
  "Language",
  new mongoose.Schema({ _id: String }, { strict: false })
);

module.exports = Language;