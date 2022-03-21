"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("report_templates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      report_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fields: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      filters: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      property_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_generation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("report_templates");
  },
};
