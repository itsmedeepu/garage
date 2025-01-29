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
router.get("/alladmins", FetchAllAdmins);
router.post("/login", AdminLogin);
router.put("/update", UpdateAdmin);
router.get("/getadmin/:adminid", GetAdminById);
router.post("/refresh", [AdminAuth], Refresh);
router.post("/auth", [AdminAuth], verifyAdmin);

module.exports = router;
