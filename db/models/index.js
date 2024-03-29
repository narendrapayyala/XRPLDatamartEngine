"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  console.log("Connecting to Database........");
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
  console.log("Connecting to Database........");
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // const model = sequelize['import'](path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize.addHook('afterInit', function(sequelize) {
//   sequelize.options.handleDisconnects = false;
//   // Disable pool completely
//   sequelize.connectionManager.pool.clear();
//   sequelize.connectionManager.pool = null;
//   sequelize.connectionManager.getConnection = function getConnection() {
//     return this._connect(sequelize.config);
//   };
//   sequelize.connectionManager.releaseConnection = function releaseConnection(connection) {
//     return this._disconnect(connection);
//   };
// })

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// const Sequelize = require('sequelize')
// const UserModel = require('./user')
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// var sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
// const User = UserModel(sequelize, Sequelize)
// const Models = { User }
// const connection = {}
// module.exports = async () => {
//   if (connection.isConnected) {
//     console.log('=> Using existing connection.')
//     return Models
//   }
//
//   await sequelize.authenticate()
//   connection.isConnected = true
//   console.log('=> Created a new connection.')
//   return Models
// }
