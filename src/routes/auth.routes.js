const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/reset-password", ctrl.resetPassword);
router.post("/verify-reset", ctrl.verifyReset);

module.exports = router;
