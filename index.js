const express = require("express");
const sequelize = require("./database/conn");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 3000;

//middlware
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());

const userRoutes = require("./routes/UserRoutes");
const professinalRoutes = require("./routes/ProfessinalRoutes");
const serviceRoutes = require("./routes/ServiceRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const bookingRoutes = require("./routes/BookingRoutes");
require("./googleOauth/Googleoauth");

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

app.get(
  "/api/v1/garage/oauth2/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/v1/garage/oauth2/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/failed",
  }),
  (req, res) => {
    // Send tokens to client
    return res.json({
      user: req.user.user,
      accesstoken: req.user.accesstoken,
      refreshtoken: req.user.refreshtoken,
    });
  }
);

app.get("/failed", (req, res) => {
  return res.status(400).json({ message: "faile to authenticate" });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});
