const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
const CsvParser = require("json2csv").Parser;
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2/promise");
const { filterFields } = require("../../helper");
const VerifyToken = require("../../middlewares").verifyToken;
router.use(VerifyToken);
const { entity_model, req_parameters } = require("./entity_model");
const ReportTemplates = require("../../../db/models").report_templates;

router.get("/", async function (req, res, next) {
  try {
    return res
      .status(200)
      .send({ status: true, message: "Success From Account NFTs connector" });
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

router.get("/nft-info/params", async function (req, res, next) {
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

router.post("/nft-info/template", async function (req, res, next) {
  let body;
  try {
    body = { ...req.body, uuid: uuidv4(), created_by: req.auth_user.id };
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

router.post("/nft-info/template/update", async function (req, res, next) {
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

router.post("/nft-info/fetch", async function (req, res, next) {
  let template,
    formatted_data = [],
    report_data = [];
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
      let requests = await req.body.params.accounts.map((account) =>
        getNfTokens({
          account,
          command: "account_nfts",
          limit: 400,
          ...req.body.params,
        })
      );
      let response = await Promise.all(requests);
      // template = {
      //   fields:
      //     '[{"field":"Account","field_normalized":"account","method":"account_nfts","type":"String","order":10},{"field":"Flags","field_normalized":"account_nfts.Flags","method":"account_nfts","type":"String","order":1},{"field":"NFTokenID","field_normalized":"account_nfts.NFTokenID","method":"account_nfts","type":"String","order":3},{"field":"ledger_current_index","field_normalized":"ledger_current_index","method":"account_nfts","type":"Number","order":3},{"field":"ledger_index","field_normalized":"ledger_index","method":"account_nfts","type":"Number","order":2}]',
      // };
      template.fields = JSON.parse(template.fields).sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        resObj.result.account_nfts.forEach((tokenObj) => {
          let temp = {
            ...JSON.parse(JSON.stringify(resObj.result)),
            account_nfts: tokenObj,
          };
          formatted_data.push(temp);
        });
      });
      formatted_data.forEach((resObj) => {
        let row = {};
        template.fields.forEach((obj) => {
          row[obj.field] = filterFields(
            resObj,
            obj.field_normalized.split(".")
          );
        });
        report_data.push(row);
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

router.post("/nft-info/csv", async function (req, res, next) {
  let template,
    formatted_data = [],
    report_data = [],
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
      let requests = await req.body.params.accounts.map((account) =>
        getNfTokens({
          account,
          command: "account_nfts",
          limit: 400,
          ...req.body.params,
        })
      );
      let response = await Promise.all(requests);
      // template = {
      //   fields:
      //     '[{"field":"Account","field_normalized":"account","method":"account_nfts","type":"String","order":10},{"field":"Flags","field_normalized":"account_nfts.Flags","method":"account_nfts","type":"String","order":1},{"field":"NFTokenID","field_normalized":"account_nfts.NFTokenID","method":"account_nfts","type":"String","order":3},{"field":"ledger_current_index","field_normalized":"ledger_current_index","method":"account_nfts","type":"Number","order":3},{"field":"ledger_index","field_normalized":"ledger_index","method":"account_nfts","type":"Number","order":2}]',
      // };
      template.fields = JSON.parse(template.fields).sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        resObj.result.account_nfts.forEach((tokenObj) => {
          let temp = {
            ...JSON.parse(JSON.stringify(resObj.result)),
            account_nfts: tokenObj,
          };
          formatted_data.push(temp);
        });
      });
      formatted_data.forEach((resObj, index) => {
        let row = {};
        template.fields.forEach((obj) => {
          !index && csvFields.push(obj.field);
          row[obj.field] = filterFields(
            resObj,
            obj.field_normalized.split(".")
          );
        });
        report_data.push(row);
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

router.post("/nft-info/db/sync", async function (req, res, next) {
  let template,
    formatted_data = [],
    report_data = [],
    db_data = [];
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
      let requests = await req.body.params.accounts.map((account) =>
        getNfTokens({
          account,
          command: "account_nfts",
          limit: 400,
          ...req.body.params,
        })
      );
      let response = await Promise.all(requests);
      template.fields = template.fields.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        resObj.result.account_nfts.forEach((tokenObj) => {
          let temp = {
            ...JSON.parse(JSON.stringify(resObj.result)),
            account_nfts: tokenObj,
          };
          formatted_data.push(temp);
        });
      });
      formatted_data.forEach((resObj, index) => {
        let row = {};
        template.fields.forEach((obj) => {
          row[obj.field] = filterFields(
            resObj,
            obj.field_normalized.split(".")
          );
        });
        report_data.push(row);
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
      throw {
        details: [
          { message: "Error! Please provide atleast one account adderess." },
        ],
      };
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
      .send({ status: false, message: "DB Authentication failed." });
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

router.post("/nft-info/nfts", async function (req, res, next) {
  let requests = [],
    formatted_data = [];
  try {
    if (
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.accounts &&
      req.body.params.accounts instanceof Array &&
      req.body.params.accounts.length
    ) {
      requests = await req.body.params.accounts.map((account) =>
        getNfTokens({
          account,
          command: "account_nfts",
          limit: 400,
          ...req.body.params,
        })
      );
      let response = await Promise.all(requests);
      response.forEach((resObj) => {
        resObj.result.account_nfts.forEach((tokenObj) => {
          let temp = {
            ...JSON.parse(JSON.stringify(resObj.result)),
            account_nfts: tokenObj,
          };
          console.log(temp);
          formatted_data.push(temp);
        });
      });
      return res.status(200).send({ status: true, response, formatted_data });
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

async function getNfTokens(params) {
  const client = new xrpl.Client(process.env.XRPL_WS_NFT_CLIENT_ADDRESS);
  // const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return response;
}
