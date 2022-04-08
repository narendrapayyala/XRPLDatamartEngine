"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class configs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  configs.init(
    {
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "configs",
    }
  );
  return configs;
};
