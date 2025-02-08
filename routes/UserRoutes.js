const express = require("express");
const passport = require("passport");
const {
  Register,
  FetchAllUsers,
  UserLogin,
  UpdateUser,
  GetUserById,
  verifyUser,
  Refresh,
  DeleteUser,
  OauthRegister,
  ResetPassword,
} = require("../controllers/UserController");

const { addBooking } = require("../controllers/BookingServiceController");

const { UserAuth, AdminAuth } = require("../middlewares/Auth");

const router = express.Router();

router.post("/register", Register);
router.get("/allusers", [AdminAuth], FetchAllUsers);
router.post("/login", UserLogin);
router.post("/update", [UserAuth], UpdateUser);
router.get("/getuserbyid/:userid", [UserAuth], GetUserById);
router.post("/refresh", [UserAuth], Refresh);
router.post("/auth", [UserAuth], verifyUser);
router.delete("/delete/:id", [AdminAuth], DeleteUser);
router.post("/addbooking", [UserAuth], addBooking);
router.get(
  "/oauth2/google/sigin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.post("/resetpassword", ResetPassword);

router.get(
  "/oauth2/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/garage/user/login",
  }),
  OauthRegister
);

module.exports = router;
