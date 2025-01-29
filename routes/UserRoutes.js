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
} = require("../controllers/UserController");

const { UserAuth, AdminAuth } = require("../middlewares/Auth");

const router = express.Router();

router.post("/register", Register);
router.get("/allusers", [AdminAuth], FetchAllUsers);
router.post("/login", UserLogin);
router.post("/update", [AdminAuth], UpdateUser);
router.get("/getuserbyid/:userid", [UserAuth], GetUserById);
router.post("/refresh", [UserAuth], Refresh);
router.post("/auth", [UserAuth], verifyUser);
router.delete("/delete", [AdminAuth], DeleteUser);
router.get(
  "/oauth2/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/v1/garage/oauth2/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/failed",
  }),
  OauthRegister
);

module.exports = router;
