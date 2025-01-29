const express = require("express");
const {
  Register,
  FetchAllUsers,
  UserLogin,
  UpdateUser,
  GetUserById,
  verifyUser,
  Refresh,
  DeleteUser,
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

module.exports = router;
