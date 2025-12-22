const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetCode: String,
    resetCodeExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
