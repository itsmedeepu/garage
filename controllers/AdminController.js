const {
  isValidText,
  isValidEmail,
  isValidPassword,
  isValidObject,
} = require("../utils/ValidationsHelper");
const { generateUniquiId } = require("../utils/Helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const AdminModel = require("../models/AdminModel");

const Register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || name.trim() === "") {
    return res
      .status(404)
      .json({ message: "name feild is required", statusCode: 404 });
  }
  if (!email || email.trim() === "") {
    return res
      .status(404)
      .json({ message: "email feild is required", statusCode: 404 });
  }
  if (!phone || phone.trim() === "") {
    return res
      .status(404)
      .json({ message: "phone feild is required", statusCode: 404 });
  }
  if (!password || password.trim() === "") {
    return res
      .status(404)
      .json({ message: "password feild is required", statusCode: 404 });
  }
  const admin = await AdminModel.findOne({
    where: {
      phone: phone,
      email: email,
    },
  });

  if (admin) {
    return res.status(409).json({
      message: "admin already exist with this details",
      statusCode: 409,
    });
  }

  const id = generateUniquiId();
  const hashedpassword = await bcrypt.hash(password, 10);

  const Admin = await AdminModel.create({
    name,
    email,
    phone,
    password: hashedpassword,
    id,
  });
  return res.status(200).json({
    message: "admin registred sucessfully",
    statusCode: 200,
    data: Admin,
  });
};

const FetchAllAdmins = async (req, res) => {
  const admins = await AdminModel.findAll();
  return res
    .status(200)
    .json({ message: "admins  fetched sucessfully", data: admins });
};

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidText(email) || !isValidText(password)) {
    return res
      .status(401)
      .json({ message: "all feilds are required", statusCode: 401 });
  }

  const findadmin = await AdminModel.findOne({ where: { email } });
  if (!findadmin) {
    return res
      .status(401)
      .json({ message: "invalid login details", statusCode: 401 });
  }

  const verifyadminPass = await bcrypt.compare(password, findadmin.password);

  if (!verifyadminPass) {
    return res
      .status(401)
      .json({ message: "invalid login details", statusCode: 401 });
  }

  //create tokens

  const accesstoken = jwt.sign(
    { adminid: findadmin.id },
    process.env.ADMIN_PRIVATE_KEY,
    {
      expiresIn: "5m",
    }
  );

  const refreshtoken = jwt.sign(
    { adminid: findadmin.id },
    process.env.ADMIN_PRIVATE_KEY,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    message: "admin  login sucessfull",
    statusCode: 200,
    data: {
      accesstoken,
      refreshtoken,
      adminid: findadmin.id,
    },
  });
};

const UpdateAdmin = async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ message: "updtaing feilds are required" });
  }

  if (!isValidObject(req.body)) {
    return res.status(401).json({ message: "updtaing feilds are required" });
  }

  const { id } = req.body;

  const findAdmin = await AdminModel.findOne({ where: { id } });

  if (!findAdmin) {
    return res.status(404).json({ message: "no admin found with this id" });
  }
  const updatedAdmin = await findAdmin.update(req.body, {
    where: {
      id,
    },
  });
  return res
    .status(201)
    .json({ message: "admin updated sucessfully", data: { updatedAdmin } });
};

const GetAdminById = async (req, res) => {
  const { adminid } = req.params;
  if (!adminid) {
    return res.status(404).json({ message: "admin not found with this id " });
  }

  const admin = await AdminModel.findByPk(adminid);

  if (!admin) {
    return res.status(404).json({ message: "admin not found" });
  }

  return res
    .status(200)
    .json({ message: "admin fetched sucessfully", data: { admin } });
};

const Refresh = async (req, res) => {
  const headers = req.headers.authorization;

  const refreshtoken = headers && headers.split(" ")[1];

  jwt.verify(refreshtoken, process.env.ADMIN_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "refresh token expired " });
    }

    const accesstoken = jwt.sign(
      { adminid: decoded.adminid },
      process.env.ADMIN_PRIVATE_KEY,
      { expiresIn: "5m" }
    );
    const refreshtoken = jwt.sign(
      { adminid: decoded.adminid },
      process.env.ADMIN_PRIVATE_KEY,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "new pair of token created successfully",
      data: { accesstoken, refreshtoken },
    });
  });
};

const verifyAdmin = async (req, res) => {
  const headers = req.headers.authorization;

  const accesstoken = headers && headers.split(" ")[1];

  jwt.verify(
    accesstoken,
    process.env.ADMIN_PRIVATE_KEY,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "access token expired " });
      }

      const admin = await AdminModel.findByPk(decoded.adminid);

      return res.status(200).json({
        message: "admin verify sucessfully",
        data: { admin: admin },
      });
    }
  );
};
module.exports = {
  Register,
  FetchAllAdmins,
  AdminLogin,
  UpdateAdmin,
  GetAdminById,
  verifyAdmin,
  Refresh,
};
