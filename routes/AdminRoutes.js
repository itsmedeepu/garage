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
const { getAllBookings } = require("../controllers/BookingServiceController");
const { AdminAuth } = require("../middlewares/Auth");
const {
  FetchAllUsers,
  UpdateUser,
  DeleteUser,
} = require("../controllers/UserController");
const {
  FetchAllProfessinals,
  DeleteProf,
  UpdateProfessinal,
} = require("../controllers/ProfessionalController");

const { addService } = require("../controllers/ServiceController");

const router = express.Router();
router.get("/allbookings", [AdminAuth], getAllBookings);
router.post("/register", Register);
router.get("/alladmins", [AdminAuth], FetchAllAdmins);
router.post("/login", AdminLogin);
router.post("/update", [AdminAuth], UpdateAdmin);
router.get("/getadmin/:adminid", [AdminAuth], GetAdminById);
router.post("/refresh", [AdminAuth], Refresh);
router.post("/auth", [AdminAuth], verifyAdmin);
router.get("/allusers", [AdminAuth], FetchAllUsers);
router.get("/getallprofs", [AdminAuth], FetchAllProfessinals);
router.post("/userupdate", [AdminAuth], UpdateUser);
router.delete("/deleteuser/:id", [AdminAuth], DeleteUser);
router.delete("/deleteprof/:id", [AdminAuth], DeleteProf);
router.post("/profupdate", [AdminAuth], UpdateProfessinal);
router.post("/addservice", [AdminAuth], addService);

module.exports = router;
