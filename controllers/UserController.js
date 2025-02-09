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

  const user = await UserModel.findOne({
    where: {
      email: email,
      phone: phone,
    },
  });

  if (user) {
    return res.status(409).json({
      message: "user already exist with this details",
      statusCode: 409,
    });
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
    statusCode: 201,
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
    return res.status(404).json({ message: "all feilds are required" });
  }

  const finduser = await UserModel.findOne({ where: { email } });
  if (!finduser) {
    return res.status(401).json({ message: "invalid login details" });
  }

  const verifyUserPass = await bcrypt.compare(password, finduser.password);

  if (!verifyUserPass) {
    return res.status(401).json({ message: "invalid login details" });
  }

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
      userid: finduser.id,
    },
  });
};

const UpdateUser = async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ message: "updtaing feilds are required" });
  }

  if (!isValidObject(req.body)) {
    return res.status(401).json({ message: "some feilds are invalid" });
  }

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

  setTimeout(() => {
    return res.status(201).json({
      message: "user updated sucessfully",
      data: { user: updatedUser },
    });
  }, 4000);
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
    return res.status(201).json({
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
  const userid = req.params.id;
  if (!userid) {
    return res.status(401).json({ message: "user id is required" });
  }

  const finduser = await UserModel.findOne({ where: { id: userid } });
  if (!finduser) {
    return res.status(404).json({ message: "user not found" });
  }

  finduser.destroy();
  return res.status(201).json({ message: "user delted sucessfully" });
};

const OauthRegister = async (req, res) => {
  console.log(req.user);

  res.redirect(
    `${process.env.FRONTEND_URL}/user/login/oauth?` +
      `accesstoken=${encodeURIComponent(req.user.accesstoken)}` +
      `&refreshtoken=${encodeURIComponent(req.user.refreshtoken)}` +
      `&userid=${encodeURIComponent(req.user.userid)}`
  );
};

const ResetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!isValidObject(req.body)) {
    return res.status(401).json({ message: "email is required" });
  }

  const finduser = await UserModel.findOne({
    where: {
      email: email,
    },
  });

  if (!finduser) {
    return res.status(404).json({ message: "user not found with this email" });
  }

  const hashedpassword = await bcrypt.hash(password, 10);

  const updateUser = await finduser.update(
    { password: hashedpassword },
    {
      where: {
        email: email,
      },
    }
  );
  if (!updateUser) {
    return res.status(404).json({ message: "user not found with this email" });
  }
  return res.status(201).json({ message: "user password resetted" });
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
  ResetPassword,
};
