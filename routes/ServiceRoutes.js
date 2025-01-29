const express = require("express");
const {
  addService,
  deleteService,
  updateServices,
  getAllServices,
} = require("../controllers/ServiceController");

const router = express.Router();

router.post("/addservice", addService);
router.get("/getservices", getAllServices);
router.put("/update", updateServices);
router.delete("/delete", deleteService);

module.exports = router;
