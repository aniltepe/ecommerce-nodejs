const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    _id: { type: String }
  })
);

module.exports = Role;