const path = require("path");
const { error } = require("../../network/response");

const notFound = (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "../../public", "NoFound.html"));
  } else if (req.accepts("json")) {
    error(req, res, "no encontrado", 404, "no encontrado");
  } else {
    res.type("txt").send("404 no encontrado");
  }
};

module.exports = notFound;
