const express = require("express");
const {
  addBooking,
  ProfessinalAcceptService,
  ChangeStatus,
  ChangePaymentStatus,
  getAllBookings,
  getBookingsById,
  getBookingsByuserid,
  getBookingsByprofessinalid,
} = require("../controllers/BookingServiceController");

const router = express.Router();
router.get("/allbookings", getAllBookings);
router.post("/addbooking", addBooking);
router.post("/acceptbooking", ProfessinalAcceptService);
router.post("/changestatus", ChangeStatus);
router.post("/changepaymentstatus", ChangePaymentStatus);
router.get("/bookingbyid/:bookingid", getBookingsById);
router.get("/bookingbyuserid/:userid", getBookingsByuserid);
router.get("/bookingbyproid/:professinailid", getBookingsByprofessinalid);

module.exports = router;
