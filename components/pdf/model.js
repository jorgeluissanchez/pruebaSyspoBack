const { Schema, model } = require("mongoose");

const mySchema = new Schema(
  {
    html: String,
    state: {
      type: String,
      default: "pendiente",
    },
    title: String,
    user: String,
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Pdf", mySchema);
