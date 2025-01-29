const { v4: uuidv4 } = require("uuid");

const generateUniquiId = () => {
  return uuidv4();
};

module.exports = { generateUniquiId };
