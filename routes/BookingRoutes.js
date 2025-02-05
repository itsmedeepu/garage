const express = require("express");
const {
  addBooking,
  ProfessinalAcceptService,
  ChangeStatus,
  ChangePaymentStatus,
  getBookingsById,
  getBookingsByuserid,
  getBookingsByprofessinalid,
} = require("../controllers/BookingServiceController");
const { ProfessinalAuth, AdminAuth, UserAuth } = require("../middlewares/Auth");

const router = express.Router();
router.post("/addbooking", [UserAuth], addBooking);
router.post("/acceptbooking", [ProfessinalAuth], ProfessinalAcceptService);
router.post("/changestatus", [ProfessinalAuth], ChangeStatus);
router.post("/changepaymentstatus", [UserAuth], ChangePaymentStatus);
router.get("/bookingbyid/:bookingid", [ProfessinalAuth], getBookingsById);
router.get("/bookingbyuserid/:userid", getBookingsByuserid);
router.get(
  "/bookingbyproid/:professinailid",
  [ProfessinalAuth],
  getBookingsByprofessinalid
);

module.exports = router;
