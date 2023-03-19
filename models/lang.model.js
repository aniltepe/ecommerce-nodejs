const mongoose = require("mongoose");

const Lang = mongoose.model(
  "Lang",
  new mongoose.Schema({ _id: String }, { strict: false })
);

module.exports = Lang;