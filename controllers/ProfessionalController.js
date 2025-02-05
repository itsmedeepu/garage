const {
  isValidText,
  isValidEmail,
  isValidPassword,
  isValidObject,
} = require("../utils/ValidationsHelper");
const { generateUniquiId } = require("../utils/Helper");
const ProfessinalModel = require("../models/ProfessinalModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const ProfessRegister = async (req, res) => {
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

  const Professinal = await ProfessinalModel.findOne({
    where: {
      phone: phone,
      email: email,
    },
  });

  if (Professinal) {
    return res
      .status(409)
      .json({ message: "professinal already exist with this details" });
  }

  const id = generateUniquiId();
  const hashedpassword = await bcrypt.hash(password, 10);

  const Professinalsave = await ProfessinalModel.create({
    name,
    email,
    phone,
    password: hashedpassword,
    id,
  });
  return res
    .status(201)
    .json({ message: "professional registred sucessfully", statusCode: 201 });
};

const FetchAllProfessinals = async (req, res) => {
  const Professinals = await ProfessinalModel.findAll();
  return res
    .status(200)
    .json({ message: "professianls  fetched sucessfully", data: Professinals });
};

const ProfessinalLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidText(email) || !isValidText(password)) {
    return res.status(401).json({ message: "all feilds are required" });
  }

  const findProfessinal = await ProfessinalModel.findOne({ where: { email } });
  if (!findProfessinal) {
    return res.status(401).json({ message: "invalid login details" });
  }

  const verifyProfessianlPassword = await bcrypt.compare(
    password,
    findProfessinal.password
  );

  if (!verifyProfessianlPassword) {
    return res
      .status(401)
      .json({ message: "invalid login details", statusCode: 401 });
  }

  //create tokens

  const accesstoken = jwt.sign(
    { professianlid: findProfessinal.id },
    process.env.PROFESINAL_PRIVATE_KEY,
    {
      expiresIn: "5m",
    }
  );

  const refreshtoken = jwt.sign(
    { professianlid: findProfessinal.id },
    process.env.PROFESINAL_PRIVATE_KEY,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    message: "professinal login sucessfull",
    statusCode: 200,
    data: {
      professinalid: findProfessinal.id,
      accesstoken,
      refreshtoken,
    },
  });
};

const UpdateProfessinal = async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ message: "updtaing feilds are required" });
  }

  if (!isValidObject(req.body)) {
    return res.status(401).json({ message: "All feilds are required" });
  }
  const { id } = req.body;

  const findProfessinal = await ProfessinalModel.findOne({ where: { id } });

  if (!findProfessinal) {
    return res.status(404).json({ message: "no user found with this id" });
  }
  const updateProfessinal = await findProfessinal.update(req.body, {
    where: {
      id,
    },
  });
  return res.status(201).json({
    message: "professianl updated sucessfully",
    data: { professinal: updateProfessinal },
  });
};

const GetProfById = async (req, res) => {
  const { professinalid } = req.params;
  if (!professinalid) {
    return res.status(401).json({ message: "please provide user id " });
  }

  const professianl = await ProfessinalModel.findOne({
    where: {
      id: professinalid,
    },
  });

  if (!professianl) {
    return res.status(404).json({ message: "profesinal not found" });
  }

  return res.status(200).json({
    message: "user fetched sucessfully",
    data: { prof: professianl },
  });
};

const Refresh = async (req, res) => {
  const headers = req.headers.authorization;

  const refreshtoken = headers && headers.split(" ")[1];

  jwt.verify(
    refreshtoken,
    process.env.PROFESINAL_PRIVATE_KEY,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "refresh token expired " });
      }

      const accesstoken = jwt.sign(
        { professianlid: decoded.professianlid },
        process.env.PROFESINAL_PRIVATE_KEY,
        { expiresIn: "5m" }
      );
      const refreshtoken = jwt.sign(
        { professianlid: decoded.professianlid },
        process.env.PROFESINAL_PRIVATE_KEY,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: "new pair of token created successfully",
        data: { accesstoken, refreshtoken },
      });
    }
  );
};

const verifyProf = async (req, res) => {
  const headers = req.headers.authorization;

  const accesstoken = headers && headers.split(" ")[1];

  jwt.verify(
    accesstoken,
    process.env.PROFESINAL_PRIVATE_KEY,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "access token expired " });
      }
      console.log(decoded);
      const profesinal = await ProfessinalModel.findByPk(decoded.professianlid);

      return res.status(200).json({
        message: "professional verify sucessfully",
        data: { professianl: profesinal },
      });
    }
  );
};

module.exports = {
  ProfessRegister,
  FetchAllProfessinals,
  ProfessinalLogin,
  UpdateProfessinal,
  GetProfById,
  verifyProf,
  Refresh,
};
