const { where } = require("sequelize");
const ServiceModel = require("../models/ServiceModel");
const { isValidText } = require("../utils/ValidationsHelper");
const { generateUniquiId } = require("../utils/Helper");

const addService = async (req, res) => {
  const { name, description, price } = req.body;

  if (!isValidText(name) || !isValidText(description)) {
    return res.status(401).json({ message: "all feilds are required" });
  }

  const id = generateUniquiId();
  const service = await ServiceModel.create({ name, price, description, id });
  return res
    .status(201)
    .json({ message: "service added sucessfullly", data: service });
};

const getAllServices = async (req, res) => {
  const services = await ServiceModel.findAll();
  return res
    .status(200)
    .json({ message: "all services fetched sucessfully", data: services });
};

const updateServices = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(401)
      .json({ message: "please provide service id to update" });
  }

  const service = await ServiceModel.findOne({ where: { id } });
  const updatedService = await service.update(req.body, { where: { id } });

  return res.status(201).json({
    message: "service updated sucessfully",
    data: { service: updatedService },
  });
};
const deleteService = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(401)
      .json({ message: "please provide service id to update" });
  }

  const service = await ServiceModel.findOne({ where: { id } });
  service.destroy();

  return res.status(200).json({
    message: "service deleted sucessfully",
  });
};

module.exports = { addService, getAllServices, updateServices, deleteService };
