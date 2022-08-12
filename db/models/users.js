"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user", // admin or user
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
