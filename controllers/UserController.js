const User = require("../models/UserModel");
const {
  isValidText,
  isValidEmail,
  isValidPassword,
  isValidObject,
} = require("../utils/ValidationsHelper");
const { generateUniquiId } = require("../utils/Helper");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const { head } = require("../routes/UserRoutes");
const Register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (
    !isValidText(name) ||
    !isValidText(email) ||
    !isValidText(password) ||
    !isValidText(phone)
  ) {
    return res.status(401, "please provide all details");
  }

  if (!isValidEmail(email)) {
    return res.status(401, "please provide valid email id");
  }

  if (!isValidPassword(password)) {
    return res.status(401, "please provide valid password");
  }

  const user = await UserModel.findOne({
    where: {
      phone: phone,
      email: email,
    },
  });

  if (user) {
    return res
      .status(409)
      .json({ message: "user already exist with this details" });
  }

  const id = generateUniquiId();
  const hashedpassword = await bcrypt.hash(password, 10);

  const User = await UserModel.create({
    name,
    email,
    phone,
    password: hashedpassword,
    id,
  });
  return res.status(201).json({
    message: "user created sucessfully",
    data: {
      user: User,
    },
  });
};

const FetchAllUsers = async (req, res) => {
  const users = await User.findAll();
  return res
    .status(200)
    .json({ message: "user  fetched sucessfully", data: users });
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidText(email) || !isValidText(password)) {
    return res.status(401).json({ message: "all feilds are required" });
  }

  const finduser = await UserModel.findOne({ where: { email } });
  if (!finduser) {
    return res.status(401).json({ message: "invalid login details" });
  }

  const verifyUserPass = await bcrypt.compare(password, finduser.password);

  //create tokens

  const accesstoken = jwt.sign(
    { userid: finduser.id },
    process.env.USER_PRIVATE_KEY,
    {
      expiresIn: "5m",
    }
  );

  const refreshtoken = jwt.sign(
    { userid: finduser.id },
    process.env.USER_PRIVATE_KEY,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    message: "user  login sucessfull",
    data: {
      accesstoken,
      refreshtoken,
    },
  });
};

const UpdateUser = async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ message: "updtaing feilds are required" });
  }

  // if (!isValidObject(req.body)) {
  //   return res.status(409).json({ message: "some feilds are invalid" });
  // }

  const { id } = req.body;

  const findUser = await UserModel.findOne({ where: { id } });

  if (!findUser) {
    return res.status(404).json({ message: "no user found with this id" });
  }
  const updatedUser = await findUser.update(req.body, {
    where: {
      id,
    },
  });
  return res
    .status(201)
    .json({ message: "user updated sucessfully", data: { user: updatedUser } });
};

const GetUserById = async (req, res) => {
  const { userid } = req.params;
  if (!userid) {
    return res.status(401).json({ message: "please provide user id " });
  }

  const user = await UserModel.findOne({
    where: {
      id: userid,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  return res
    .status(200)
    .json({ message: "user fetched sucessfully", data: { user } });
};

const Refresh = async (req, res) => {
  const headers = req.headers.authorization;

  const refreshtoken = headers && headers.split(" ")[1];

  jwt.verify(refreshtoken, process.env.USER_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "refresh token expired " });
    }

    const accesstoken = jwt.sign(
      { userid: decoded.userid },
      process.env.USER_PRIVATE_KEY,
      { expiresIn: "5m" }
    );
    const refreshtoken = jwt.sign(
      { userid: decoded.userid },
      process.env.USER_PRIVATE_KEY,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "new pair of token created successfully",
      data: { accesstoken, refreshtoken },
    });
  });
};

const verifyUser = async (req, res) => {
  const headers = req.headers.authorization;

  const accesstoken = headers && headers.split(" ")[1];

  jwt.verify(
    accesstoken,
    process.env.USER_PRIVATE_KEY,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "access token expired " });
      }

      const user = await UserModel.findByPk(decoded.userid);

      return res.status(200).json({
        message: "user verify sucessfully",
        data: { User: user },
      });
    }
  );
};

const DeleteUser = async (req, res) => {
  const { userid } = req.body;
  if (!userid) {
    return res.status(409).json({ message: "user id is required" });
  }

  const finduser = await UserModel.findOne({ where: { id: userid } });
  if (!finduser) {
    return res.status(409).json({ message: "user not found" });
  }

  finduser.destroy();
  return res.status(200).json({ message: "user delted sucessfully" });
};

const OauthRegister = async (req, res) => {
  return res.status(200).json({
    user: req.user.user,
    accesstoken: req.user.accesstoken,
    refreshtoken: req.user.refreshtoken,
  });
};

module.exports = {
  Register,
  FetchAllUsers,
  UserLogin,
  UpdateUser,
  GetUserById,
  Refresh,
  verifyUser,
  DeleteUser,
  OauthRegister,
};
