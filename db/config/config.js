const moment = require("moment-timezone");
module.exports = {
  dev: {
    username: "admin",
    password: "Qazwsx4321",
    database: "xrpl-reporting",
    host: "xrpl.chftjjzep8bi.eu-west-2.rds.amazonaws.com",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false,
    // dialectOptions: {
    //     typeCast: function (field, next) {// for reading from database
    //         // if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
    //         //     return new Date(field.string() + 'Z');
    //         // }
    //         if (field.type == 'DATE') {
    //             return moment(field.string()).format("DD-MM-YYYY")
    //         }
    //         return next();
    //     }
    // },
    // timezone: "+09:30"
    // timezone: moment.tz(new Date(), "Australia/Adelaide").format("Z"),
    pool: {
      max: 1,
      min: 0,
      idle: 1000,
      acquire: 60000,
      evict: 1000,
    },
  },

  test: {
    username: "admin",
    password: "Qazwsx4321",
    database: "xrpl-reporting",
    host: "xrpl.chftjjzep8bi.eu-west-2.rds.amazonaws.com",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false,
    // dialectOptions: {
    //     typeCast: function (field, next) {// for reading from database
    //         // if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
    //         //     return new Date(field.string() + 'Z');
    //         // }
    //         if (field.type == 'DATE') {
    //             return moment(field.string()).format("DD-MM-YYYY")
    //         }
    //         return next();
    //     }
    // },
    // timezone: "+09:30"
    // timezone: moment.tz(new Date(), "Australia/Adelaide").format("Z"),
    pool: {
      max: 1,
      min: 0,
      idle: 1000,
      acquire: 60000,
      evict: 1000,
    },
  },

  prod: {
    username: "admin",
    password: "Qazwsx4321",
    database: "xrpl-reporting",
    host: "xrpl.chftjjzep8bi.eu-west-2.rds.amazonaws.com",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false,
    // dialectOptions: {
    //     typeCast: function (field, next) {// for reading from database
    //         // if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
    //         //     return new Date(field.string() + 'Z');
    //         // }
    //         if (field.type == 'DATE') {
    //             return moment(field.string()).format("DD-MM-YYYY")
    //         }
    //         return next();
    //     }
    // },
    // timezone: "+09:30"
    // timezone: moment.tz(new Date(), "Australia/Adelaide").format("Z"),
    pool: {
      max: 1,
      min: 0,
      idle: 1000,
      acquire: 60000,
      evict: 1000,
    },
  },
};
