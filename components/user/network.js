const express = require("express");
const { success, error } = require("../../network/response");
const verifyJWT = require("../../network/middleware/verifyJWT");

const router = express.Router();
const {
  createController,
  readOneController,
  readAllController,
  updateController,
  deleteController,
  validateController,
} = require("./controller");

router.post("/registro", (req, res) => {
  createController(req.body)
    .then((data) => {
      success(req, res, data, 201);
    })
    .catch((err) => {
      error(req, res, "error interno", 500, err);
    });
});

router.get("/:id", verifyJWT, (req, res) => {
  readOneController(req.params.id)
    .then((data) => {
      success(req, res, data, 200);
    })
    .catch((err) => {
      error(req, res, "error interno", 500, err);
    });
});
router.get("/", verifyJWT, (req, res) => {
  readAllController()
    .then((data) => {
      success(req, res, data, 200);
    })
    .catch((err) => {
      error(req, res, "error interno", 500, err);
    });
});

router.put("/:id", verifyJWT, (req, res) => {
  updateController(req.params.id, req.body, req.files)
    .then(() => {
      success(req, res, `usuario ${req.params.id} ha sido actualizado`, 200);
    })
    .catch((err) => {
      error(req, res, "error interno", 500, err);
    });
});

router.delete("/:id", verifyJWT, (req, res) => {
  deleteController(req.params.id)
    .then(() => {
      success(req, res, `usuario ${req.params.id} ha sido eliminado`, 200);
    })
    .catch((err) => {
      success(req, res, "error interno", 500, err);
    });
});

router.post("/login", (req, res) => {
  validateController(req.body, req.cookies, res)
    .then((data) => {
      success(req, res, data, 201);
    })
    .catch((err) => {
      error(req, res, "error interno", 500, err);
    });
});

module.exports = router;
