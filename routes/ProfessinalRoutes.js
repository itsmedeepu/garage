const express = require("express");
const {
  ProfessRegister,
  ProfessinalLogin,
  UpdateProfessinal,
  FetchAllProfessinals,
  GetProfById,
  Refresh,
  verifyProf,
  ResetPassword,
} = require("../controllers/ProfessionalController");
const { ProfessinalAuth, AdminAuth } = require("../middlewares/Auth");

const {
  getAllBookings,
  ProfessinalAcceptService,
  ChangeStatus,
} = require("../controllers/BookingServiceController");
const { FetchAllUsers } = require("../controllers/UserController");
const { getBookingsById } = require("../controllers/BookingServiceController");

const router = express.Router();
router.get("/allbookings", [ProfessinalAuth], getAllBookings);
router.post("/acceptbooking", [ProfessinalAuth], ProfessinalAcceptService);
router.post("/register", ProfessRegister);
router.get("/getall", [AdminAuth], FetchAllProfessinals);
router.post("/login", ProfessinalLogin);
router.post("/update", UpdateProfessinal);
router.get("/getprof/:professinalid", GetProfById);
router.post("/refresh", [ProfessinalAuth], Refresh);
router.post("/auth", [ProfessinalAuth], verifyProf);
router.get("/allusers", [ProfessinalAuth], FetchAllUsers);
router.get("/bookingbyid/:bookingid", [ProfessinalAuth], getBookingsById);
router.post("/changestatus", [ProfessinalAuth], ChangeStatus);
router.post("/resetpassword", ResetPassword);

module.exports = router;
