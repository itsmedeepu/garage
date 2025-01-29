const { generateUniquiId } = require("../utils/Helper");
const BookingServiceModel = require("../models/BookingServiceModel");
const { where } = require("sequelize");

const addBooking = async (req, res) => {
  const { serviceId, userId } = req.body;

  if (!serviceId || !userId) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary details" });
  }

  const id = generateUniquiId();
  const service_date = new Date(); // Corrected

  const newBooking = await BookingServiceModel.create({
    id,
    service_date, // Use the correct field
    serviceId, // Use the correct foreign key name
    userId, // Use the correct foreign key name
  });

  return res.status(201).json({
    message: "Booking created successfully",
    data: newBooking,
  });
};

const ProfessinalAcceptService = async (req, res) => {
  const { professinailid, bookingid } = req.body;

  if (!professinailid) {
    return res
      .status(409)
      .json({ message: "professinal details are required" });
  }
  const findBookingById = await BookingServiceModel.findOne({
    where: {
      id: bookingid,
    },
  });

  if (!findBookingById) {
    return res.status(409).json({ message: "bookings not found with this id" });
  }
  const update = await findBookingById.update(
    {
      professionalId: professinailid,
    },
    {
      where: {
        id: bookingid,
      },
    }
  );
  return res.status(201).json({ message: "professinal mapped to booking " });
};

const ChangeStatus = async (req, res) => {
  const { professinailid, bookingid, status } = req.body;
  if (!professinailid || !status) {
    return res.status(409).json({ message: "please provide professinal id" });
  }

  const changeStatus = await BookingServiceModel.findOne({
    where: {
      id: bookingid,
      professionalId: professinailid,
    },
  });

  if (!changeStatus) {
    return res.status(409).json({ message: "no bookings found" });
  }

  const updatestatus = await changeStatus.update(
    { status },
    {
      where: {
        id: bookingid,
        professionalId: professinailid,
      },
    }
  );

  return res.status(201).json({
    message: "booking status updated sucessfully",
    data: { booking: updatestatus },
  });
};

const ChangePaymentStatus = async (req, res) => {
  const { userId, bookingid, paymentstatus } = req.body;
  if (!userId || !paymentstatus) {
    return res.status(409).json({ message: "please provide user id" });
  }

  const changeStatus = await BookingServiceModel.findOne({
    where: {
      id: bookingid,
      userId: userId,
    },
  });

  if (!changeStatus) {
    return res.status(409).json({ message: "no bookings found" });
  }

  const updatestatus = await changeStatus.update(
    { payment: paymentstatus },
    {
      where: {
        id: bookingid,
        user: userId,
      },
    }
  );

  return res.status(201).json({
    message: "booking paymentstatus updated sucessfully",
    data: { booking: updatestatus },
  });
};

const getAllBookings = async (req, res) => {
  const allboookings = await BookingServiceModel.findAll();
  return res.status(200).json({
    message: "all bookings fetched sucessfully",
    data: {
      Bookings: allboookings,
    },
  });
};

const getBookingsById = async (req, res) => {
  const { bookingid } = req.params;

  if (!bookingid) {
    return res.status(409).json({ message: "provide booking id" });
  }
  const booking = await BookingServiceModel.findOne({
    where: {
      id: bookingid,
    },
  });
  if (!booking) {
    return res.status(409).json({ message: "no booking founds" });
  }

  return res
    .status(200)
    .json({ message: "booking found", data: { booking: booking } });
};

const getBookingsByuserid = async (req, res) => {
  const { userid } = req.params;

  if (!userid) {
    return res.status(409).json({ message: "provide booking id" });
  }
  const booking = await BookingServiceModel.findOne({
    where: {
      userId: userid,
    },
  });
  if (!booking) {
    return res.status(409).json({ message: "no booking founds" });
  }

  return res
    .status(200)
    .json({ message: "booking found", data: { booking: booking } });
};

const getBookingsByprofessinalid = async (req, res) => {
  const { professinailid } = req.params;

  if (!professinailid) {
    return res.status(409).json({ message: "provide booking id" });
  }
  const booking = await BookingServiceModel.findOne({
    where: {
      professionalId: professinailid,
    },
  });
  if (!booking) {
    return res.status(409).json({ message: "no booking founds" });
  }

  return res
    .status(200)
    .json({ message: "booking found", data: { booking: booking } });
};

module.exports = {
  addBooking,
  ProfessinalAcceptService,
  ChangeStatus,
  ChangePaymentStatus,
  getAllBookings,
  getBookingsById,
  getBookingsByprofessinalid,
  getBookingsByuserid,
};
