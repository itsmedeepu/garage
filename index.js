const express = require("express");
const sequelize = require("./database/conn");
const app = express();
const port = process.env.PORT || 3000;

//middlware
app.use(express.json());
app.use(express.urlencoded());

const userRoutes = require("./routes/UserRoutes");
const professinalRoutes = require("./routes/ProfessinalRoutes");
const serviceRoutes = require("./routes/ServiceRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const bookingRoutes = require("./routes/BookingRoutes");

//routes
app.use("/api/v1/garage/user", userRoutes);
app.use("/api/v1/garage/professinal", professinalRoutes);
app.use("/api/v1/garage/service", serviceRoutes);
app.use("/api/v1/garage/admin", adminRoutes);
app.use("/api/v1/garage/booking", bookingRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  sequelize.sync({ force: false });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});
