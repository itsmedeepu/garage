const express = require("express");
const {
  ProfessRegister,
  ProfessinalLogin,
  UpdateProfessinal,
  FetchAllProfessinals,
  GetProfById,
  Refresh,
  verifyProf,
} = require("../controllers/ProfessionalController");
const { ProfessinalAuth, AdminAuth } = require("../middlewares/Auth");

const router = express.Router();

router.post("/register", ProfessRegister);
router.get("/getall", [AdminAuth], FetchAllProfessinals);
router.post("/login", ProfessinalLogin);
router.post("/update", UpdateProfessinal);
router.get("/getprof/:professinalid", GetProfById);
router.post("/refresh", [ProfessinalAuth], Refresh);
router.post("/auth", [ProfessinalAuth], verifyProf);

module.exports = router;
