const jwt = require("jsonwebtoken");
const UserAuth = async (req, res, next) => {
  const headers = req.headers.authorization;
  const token = headers && headers.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "access denied access token not found" });
  }

  jwt.verify(token, process.env.USER_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "access token invalid or expired" });
    }
    next();
  });
};

const AdminAuth = async (req, res, next) => {
  const headers = req.headers.authorization;
  const token = headers && headers.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "access denied access token not found" });
  }

  jwt.verify(token, process.env.ADMIN_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "access token invalid or expired" });
    }
    next();
  });
};

const ProfessinalAuth = async (req, res, next) => {
  const headers = req.headers.authorization;
  const token = headers && headers.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "access denied access token not found" });
  }

  jwt.verify(token, process.env.PROFESINAL_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "access token invalid or expired" });
    }
    next();
  });
};

module.exports = { UserAuth, ProfessinalAuth, AdminAuth };
