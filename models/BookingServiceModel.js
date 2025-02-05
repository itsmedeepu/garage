const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/conn");
const UserModel = require("./UserModel");
const ServiceModel = require("./ServiceModel");
const ProfessionalModel = require("./ProfessinalModel");

const BookingServiceModel = sequelize.define("Booking", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  service_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  ratings: {
    type: DataTypes.INTEGER,
  },
  // Define the foreign keys for each association
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: UserModel, // Refers to the UserModel
      key: "id", // Primary key of the User model
    },
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: ServiceModel,
      key: "id",
    },
  },
  professionalId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: ProfessionalModel,
      key: "id",
    },
  },
});

// Define associations
BookingServiceModel.belongsTo(UserModel, { foreignKey: "userId" });
BookingServiceModel.belongsTo(ServiceModel, { foreignKey: "serviceId" });
BookingServiceModel.belongsTo(ProfessionalModel, {
  foreignKey: "professionalId",
});

module.exports = BookingServiceModel;
