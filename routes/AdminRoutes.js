const express = require("express");
const {
  Register,
  AdminLogin,
  FetchAllAdmins,
  UpdateAdmin,
  GetAdminById,
  Refresh,
  verifyAdmin,
} = require("../controllers/AdminController");
const { AdminAuth } = require("../middlewares/Auth");

const router = express.Router();

router.post("/register", Register);
router.get("/alladmins", [AdminAuth], FetchAllAdmins);
router.post("/login", AdminLogin);
router.put("/update", [AdminAuth], UpdateAdmin);
router.get("/getadmin/:adminid", [AdminAuth], GetAdminById);
router.post("/refresh", [AdminAuth], Refresh);
router.post("/auth", [AdminAuth], verifyAdmin);

module.exports = router;
