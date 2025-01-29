const Sequelize = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  "garage",
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host:
      process.env.ENIVIORNMENT === "DEVELOPMENT"
        ? "localhost"
        : process.env.DATABASE_HOST,
    dialect: "postgres",
  }
);

sequelize
  .authenticate()
  .then((response) => {
    console.log("connected to postgres ");
  })
  .catch((error) => {
    console.log("something went bad ");
  });

module.exports = sequelize;
