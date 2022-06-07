const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
const CsvParser = require("json2csv").Parser;
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2/promise");
const { filterFields } = require("../../helper");
const { entity_model, req_parameters } = require("./entity_model");
const ReportTemplates = require("../../../db/models").report_templates;

router.get("/model", async function (req, res, next) {
  try {
    return res.status(200).send({ status: true, entity_model });
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

router.get("/account-info/params", async function (req, res, next) {
  try {
    return res.status(200).send({ status: true, req_parameters });
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

router.post("/account-info/template", async function (req, res, next) {
  let body;
  try {
    body = { ...req.body, uuid: uuidv4() };
    await ReportTemplates.create(body);
    return res.status(200).send({ status: true, message: "Success" });
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

router.post("/account-info/template/update", async function (req, res, next) {
  let body;
  try {
    body = { ...req.body };
    await ReportTemplates.update(body, { where: { id: body.id } });
    return res.status(200).send({ status: true, message: "Success" });
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

// router.post("/account-info/fetch", async function (req, res, next) {
//   let template,
//     report_data = [];
//   try {
//     if (
//       req.body.id &&
//       req.body.uuid &&
//       req.body.params instanceof Object &&
//       req.body.params &&
//       req.body.params.accounts &&
//       req.body.params.accounts instanceof Array &&
//       req.body.params.accounts.length
//     ) {
//       template = await ReportTemplates.findOne({ where: { id: req.body.id } });
//       let requests = await req.body.params.accounts.map((account) =>
//         accountInfo({ account, command: "account_info", ...req.body.params })
//       );
//       let response = await Promise.all(requests);
//       template.fields = JSON.parse(template.fields).sort((a, b) =>
//         a.order > b.order ? 1 : -1
//       );
//       response.forEach((resObj) => {
//         let row = {};
//         template.fields.forEach((obj) => {
//           row[obj.field] = filterFields(
//             resObj.result,
//             obj.field_normalized.split(".")
//           );
//         });
//         report_data.push(row);
//       });
//       return res
//         .status(200)
//         .send({ status: true, report_data, template, response });
//     }
//     throw { details: [{ message: "Error! Invalid input data." }] };
//   } catch (err) {
//     if (err.details) {
//       return res
//         .status(400)
//         .send({ status: false, message: err.details[0].message });
//     } else {
//       console.log(err);
//       return res.status(500).send({
//         status: false,
//         message: err.message ? err.message : "Internal Server Error.",
//       });
//     }
//   }
// });

router.post("/account-info/fetch", async function (req, res, next) {
  let template,
    requests = [],
    formatted_data = [],
    report_data = [],
    methods = [];
  try {
    if (
      req.body.id &&
      req.body.uuid &&
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.accounts &&
      req.body.params.accounts instanceof Array &&
      req.body.params.accounts.length
    ) {
      template = await ReportTemplates.findOne({ where: { id: req.body.id } });
      template.fields = JSON.parse(template.fields);
      methods = template.fields
        .map((obj) => obj.method)
        .filter((value, i, arr) => arr.indexOf(value) === i);
      req.body.params.accounts.map((account) => {
        formatted_data.push({ account: account, data: {} });
        methods.forEach((method) => {
          switch (method) {
            case "account_info":
              requests.push(
                getAccountInfo({
                  account,
                  ...req.body.params,
                  command: "account_info",
                })
              );
              break;
            case "account_tx":
              requests.push(
                getAccountTx({
                  account,
                  ...req.body.params,
                  command: "account_tx",
                })
              );
              break;
            default:
              break;
          }
        });
      });
      let response = await Promise.all(requests);
      template.fields = template.fields.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        let accIndex = formatted_data.findIndex(
          (obj) => obj.account === resObj.account
        );
        if (accIndex !== -1) {
          formatted_data[accIndex].data[resObj.method] = resObj.response.result;
        } else {
        }
      });
      let normalized_data = [];
      formatted_data.forEach((account) => {
        if (methods.includes("account_tx")) {
          account.data.account_tx.transactions.forEach((transaction) => {
            let row = { ...JSON.parse(JSON.stringify(account.data)) };
            row.account_tx.transactions = JSON.parse(
              JSON.stringify(transaction)
            );
            if (typeof row.account_tx.transactions.tx.Amount == "object") {
              row.account_tx.transactions.tx.Amount =
                row.account_tx.transactions.tx.Amount.value;
            }
            normalized_data.push(row);
          });
        } else {
          normalized_data.push({ ...account.data });
        }
      });
      normalized_data.forEach((resObj) => {
        let row = {};
        template.fields.forEach((obj) => {
          row[obj.field] = filterFields(resObj, [
            obj.method,
            ...obj.field_normalized.split("."),
          ]);
        });
        report_data.push(row);
      });
      report_data = report_data.filter((obj, i, arr) => {
        let _obj = JSON.stringify(obj);
        return i === arr.findIndex((arrObj) => JSON.stringify(arrObj) === _obj);
      });
      return res
        .status(200)
        .send({ status: true, report_data, template, response });
    }
    throw { details: [{ message: "Error! Invalid input data." }] };
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

// router.post("/account-info/csv", async function (req, res, next) {
//   let template,
//     report_data = [],
//     csvFields = [];
//   try {
//     if (
//       req.body.id &&
//       req.body.uuid &&
//       req.body.params instanceof Object &&
//       req.body.params &&
//       req.body.params.accounts &&
//       req.body.params.accounts instanceof Array &&
//       req.body.params.accounts.length
//     ) {
//       template = await ReportTemplates.findOne({ where: { id: req.body.id } });
//       let requests = await req.body.params.accounts.map((account) =>
//         accountInfo({ account, command: "account_info", ...req.body.params })
//       );
//       let response = await Promise.all(requests);
//       template.fields = JSON.parse(template.fields).sort((a, b) =>
//         a.order > b.order ? 1 : -1
//       );
//       response.forEach((resObj, index) => {
//         let row = {};
//         template.fields.forEach((obj) => {
//           !index && csvFields.push(obj.field);
//           row[obj.field] = filterFields(
//             resObj.result,
//             obj.field_normalized.split(".")
//           );
//         });
//         report_data.push(row);
//       });
//       const csvParser = new CsvParser({ csvFields });
//       const csvData = csvParser.parse(report_data);
//       res.setHeader("Content-Type", "text/csv");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=${template.report_name}.csv`
//       );
//       return res.status(200).end(csvData);
//     }
//     throw { details: [{ message: "Error! Invalid input data." }] };
//   } catch (err) {
//     if (err.details) {
//       return res
//         .status(400)
//         .send({ status: false, message: err.details[0].message });
//     } else {
//       console.log(err);
//       return res.status(500).send({
//         status: false,
//         message: err.message ? err.message : "Internal Server Error.",
//       });
//     }
//   }
// });

router.post("/account-info/csv", async function (req, res, next) {
  let template,
    requests = [],
    formatted_data = [],
    report_data = [],
    methods = [],
    csvFields = [];
  try {
    if (
      req.body.id &&
      req.body.uuid &&
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.accounts &&
      req.body.params.accounts instanceof Array &&
      req.body.params.accounts.length
    ) {
      template = await ReportTemplates.findOne({ where: { id: req.body.id } });
      template.fields = JSON.parse(template.fields);
      methods = template.fields
        .map((obj) => obj.method)
        .filter((value, i, arr) => arr.indexOf(value) === i);
      req.body.params.accounts.map((account) => {
        formatted_data.push({ account: account, data: {} });
        methods.forEach((method) => {
          switch (method) {
            case "account_info":
              requests.push(
                getAccountInfo({
                  account,
                  ...req.body.params,
                  command: "account_info",
                })
              );
              break;
            case "account_tx":
              requests.push(
                getAccountTx({
                  account,
                  ...req.body.params,
                  command: "account_tx",
                })
              );
              break;
            default:
              break;
          }
        });
      });
      let response = await Promise.all(requests);
      template.fields = template.fields.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        let accIndex = formatted_data.findIndex(
          (obj) => obj.account === resObj.account
        );
        if (accIndex !== -1) {
          formatted_data[accIndex].data[resObj.method] = resObj.response.result;
        } else {
        }
      });
      let normalized_data = [];
      formatted_data.forEach((account) => {
        if (methods.includes("account_tx")) {
          account.data.account_tx.transactions.forEach((transaction) => {
            let row = { ...JSON.parse(JSON.stringify(account.data)) };
            row.account_tx.transactions = JSON.parse(
              JSON.stringify(transaction)
            );
            if (typeof row.account_tx.transactions.tx.Amount == "object") {
              row.account_tx.transactions.tx.Amount =
                row.account_tx.transactions.tx.Amount.value;
            }
            normalized_data.push(row);
          });
        } else {
          normalized_data.push({ ...account.data });
        }
      });
      normalized_data.forEach((resObj, index) => {
        let row = {};
        template.fields.forEach((obj) => {
          !index && csvFields.push(obj.field);
          row[obj.field] = filterFields(resObj, [
            obj.method,
            ...obj.field_normalized.split("."),
          ]);
        });
        report_data.push(row);
      });
      report_data = report_data.filter((obj, i, arr) => {
        let _obj = JSON.stringify(obj);
        return i === arr.findIndex((arrObj) => JSON.stringify(arrObj) === _obj);
      });
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(report_data);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${template.report_name}.csv`
      );
      return res.status(200).end(csvData);
    }
    throw { details: [{ message: "Error! Invalid input data." }] };
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

router.post("/account-info/db/sync", async function (req, res, next) {
  let template,
    requests = [],
    formatted_data = [],
    normalized_data = [],
    report_data = [],
    db_data = [],
    methods = [];
  try {
    if (
      req.body.id &&
      req.body.uuid &&
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.accounts &&
      req.body.params.accounts instanceof Array &&
      req.body.params.accounts.length
    ) {
      template = await ReportTemplates.findOne({ where: { id: req.body.id } });
      if (!template.is_db_sync) {
        throw {
          details: [{ message: "Error! Please provide DB credentials." }],
        };
      }
      template.fields = JSON.parse(template.fields);
      template.db_creds = JSON.parse(template.db_creds);

      methods = template.fields
        .map((obj) => obj.method)
        .filter((value, i, arr) => arr.indexOf(value) === i);
      req.body.params.accounts.map((account) => {
        formatted_data.push({ account: account, data: {} });
        methods.forEach((method) => {
          switch (method) {
            case "account_info":
              requests.push(
                getAccountInfo({
                  account,
                  ...req.body.params,
                  command: "account_info",
                })
              );
              break;
            case "account_tx":
              requests.push(
                getAccountTx({
                  account,
                  ...req.body.params,
                  command: "account_tx",
                })
              );
              break;
            default:
              break;
          }
        });
      });
      let response = await Promise.all(requests);
      template.fields = template.fields.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        let accIndex = formatted_data.findIndex(
          (obj) => obj.account === resObj.account
        );
        if (accIndex !== -1) {
          formatted_data[accIndex].data[resObj.method] = resObj.response.result;
        } else {
        }
      });
      formatted_data.forEach((account) => {
        if (methods.includes("account_tx")) {
          account.data.account_tx.transactions.forEach((transaction) => {
            let row = { ...JSON.parse(JSON.stringify(account.data)) };
            row.account_tx.transactions = JSON.parse(
              JSON.stringify(transaction)
            );
            if (typeof row.account_tx.transactions.tx.Amount == "object") {
              row.account_tx.transactions.tx.Amount =
                row.account_tx.transactions.tx.Amount.value;
            }
            normalized_data.push(row);
          });
        } else {
          normalized_data.push({ ...account.data });
        }
      });
      normalized_data.forEach((resObj) => {
        let row = {};
        template.fields.forEach((obj) => {
          row[obj.field] = filterFields(resObj, [
            obj.method,
            ...obj.field_normalized.split("."),
          ]);
        });
        report_data.push(row);
      });
      report_data = report_data.filter((obj, i, arr) => {
        let _obj = JSON.stringify(obj);
        return i === arr.findIndex((arrObj) => JSON.stringify(arrObj) === _obj);
      });
      report_data.forEach((report_obj, index) => {
        let db_obj = {};
        entity_model.forEach((obj, index) => {
          db_obj[
            obj.field
              .split("(")
              .join("")
              .split(")")
              .join("")
              .split(" ")
              .join("_")
          ] = report_obj[obj.field] ? report_obj[obj.field] : "";
        });
        db_data.push(db_obj);
      });
    } else {
      throw { details: [{ message: "Error! Invalid input data." }] };
    }

    let { host, port, user, password } = template.db_creds;
    let connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    const [rows, fields] = await connection.execute("SELECT 1 + 1 AS result");
    if (rows[0].result === 2) {
      await connection.execute(
        `CREATE DATABASE IF NOT EXISTS ${template.db_creds.database}`
      );
      let create_tbl_query = `CREATE TABLE IF NOT EXISTS ${
        template.db_creds.database
      }.${template.report_name
        .split(" ")
        .join("_")} (id int NOT NULL AUTO_INCREMENT,`;
      entity_model.forEach((obj, index) => {
        create_tbl_query += `${obj.field
          .split("(")
          .join("")
          .split(")")
          .join("")
          .split(" ")
          .join("_")} varchar(255),`;
      });
      create_tbl_query += `ds_date varchar(255), PRIMARY KEY (id))`;
      await connection.execute(create_tbl_query);
      await connection.execute(
        `DELETE FROM ${template.db_creds.database}.${template.report_name
          .split(" ")
          .join("_")} WHERE ds_date='${moment().format("DD-MM-YYYY")}'`
      );
      let insert_query = `INSERT INTO ${
        template.db_creds.database
      }.${template.report_name.split(" ").join("_")} (`;
      Object.keys(db_data[0]).forEach((obj) => {
        insert_query += `${obj}, `;
      });
      insert_query += `ds_date) values`;
      db_data.forEach((db_obj, index) => {
        let row = "(";
        Object.values(db_obj).forEach((db_obj_val) => {
          row += `'${db_obj_val}',`;
        });
        row += `'${moment().format("DD-MM-YYYY")}')`;
        insert_query += row;
        if (index !== db_data.length - 1) {
          insert_query += ",";
        }
      });
      await connection.execute(insert_query);
      return res.status(200).send({ status: true });
    }
    return res
      .status(400)
      .send({ status: false, message: "DB uthentication failed." });
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

// router.get("/account-info/", async function (req, res, next) {
//   try {
//     let response = await serverInfo();
//     return res.status(200).send(response);
//   } catch (err) {
//     if (err.details) {
//       return res
//         .status(400)
//         .send({ status: false, message: err.details[0].message });
//     } else {
//       console.log(err);
//       return res.status(500).send({
//         status: false,
//         message: err.message ? err.message : "Internal Server Error.",
//       });
//     }
//   }
// });

router.post("/get-balance", async function (req, res, next) {
  try {
    if (
      req.body.accounts &&
      req.body.accounts instanceof Array &&
      req.body.accounts.length
    ) {
      let requests = await req.body.accounts.map((account) =>
        getBalance(account)
      );
      let response = await Promise.all(requests);
      return res.send(response);
    }
    throw { details: [{ message: "Error! Invalid input data." }] };
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      console.log(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
});

module.exports = router;

async function accountInfo(params) {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  // const client = new xrpl.Client(req.server_config.url);
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return response;
}
async function getAccountInfo(params) {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  // const client = new xrpl.Client(req.server_config.url);
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return { account: params.account, method: "account_info", response };
}
async function getAccountTx(params) {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  // const client = new xrpl.Client(req.server_config.url);
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return { account: params.account, method: "account_tx", response };
}
