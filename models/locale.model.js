const mongoose = require("mongoose");

const Locale = mongoose.model(
  "Locale",
  new mongoose.Schema({ _id: String }, { strict: false })
);

module.exports = Locale;