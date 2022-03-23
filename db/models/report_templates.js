"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class report_templates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  report_templates.init(
    {
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      report_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      entity_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fields: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filters: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      property_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_generation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "report_templates",
    }
  );
  return report_templates;
};
