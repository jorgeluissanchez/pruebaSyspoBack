const express = require("express");
const response = require("../../network/response");

const verifyJWT = require("../../network/middleware/verifyJWT");
const {
  createController,
  readOneController,
  readAllController,
  printPDF,
  updateController,
  deleteController,
} = require("./controller");

const router = express.Router();

router.post("/", verifyJWT, (req, res) => {
  createController(req.body)
    .then((info) => {
      response.success(req, res, info, 201);
    })
    .catch((err) => {
      response.error(req, res, "error interno", 500, err);
    });
});

router.get("/:id", verifyJWT, (req, res) => {
  readOneController(req.params.id)
    .then((info) => {
      response.success(req, res, info, 200);
    })
    .catch((err) => {
      response.error(req, res, "error interno", 500, err);
    });
});

router.get("/content/:id", verifyJWT, (req, res) => {
  printPDF(req.params.id).then((pdf) => {
    response.success(req, res, pdf, 200);
  });
});

router.get("/", verifyJWT, (req, res) => {
  readAllController()
    .then((info) => {
      response.success(req, res, info, 200);
    })
    .catch((err) => {
      response.error(req, res, "error interno", 500, err);
    });
});

router.put("/:id", verifyJWT, (req, res) => {
  updateController(req.params.id, req.body)
    .then(() => {
      response.success(
        req,
        res,
        `Pdf ${req.params.id} ha sido actualizado`,
        200
      );
    })
    .catch((err) => {
      response.error(req, res, "error interno", 500, err);
    });
});

router.delete("/:id", verifyJWT, (req, res) => {
  deleteController(req.params.id)
    .then(() => {
      response.success(req, res, `Pdf ${req.params.id} ha sido eliminado`, 200);
    })
    .catch((err) => {
      response.success(req, res, "error interno", 500, err);
    });
});

module.exports = router;
