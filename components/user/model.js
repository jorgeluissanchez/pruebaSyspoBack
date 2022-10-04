const { Schema, model } = require("mongoose");

const mySchema = new Schema(
  {
    user: String,
    full_name: String,
    age: Number,
    gender: String,
    city: String,
    identificationType: String,
    identification: Number,
    password: String,
    pfp: {
      type: String,
      default: "",
    },
    signature: {
      type: String,
      default: "",
    },
    refreshToken: [String],
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("User", mySchema);
