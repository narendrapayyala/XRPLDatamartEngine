const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const moment = require("moment");
const xrpl = require("xrpl");
const CsvParser = require("json2csv").Parser;
const { createPDFBase64, createPDFBinary } = require("../libs/PDFController");
const BalanceSheetPDFTemplate = require("../libs/PDFController/Templates/BalanceSheetTemplate");

router.get("/server-info/", async function (req, res, next) {
  try {
    let response = await serverInfo();
    return res.send(response);
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

router.post("/get-balance/csv", async function (req, res, next) {
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
      let csvPayload = [];
      response.forEach((obj) => {
        csvPayload.push({
          Address: obj.result.account_data.Account,
          Balance: obj.result.account_data.Balance,
          Ledger: obj.result.ledger_current_index,
          Validated: obj.result.validated,
        });
      });
      const csvFields = ["Address", "Balance", "Ledger Index", "Validated"];
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(csvPayload);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=BalanceSheet.csv"
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

router.post("/get-balance/pdf1", async function (req, res, next) {
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
      let balanceSheetPDFDocDefinition = await BalanceSheetPDFTemplate(
        response,
        req.body.ds_date
      );
      let pdfData = await createPDFBinary(balanceSheetPDFDocDefinition);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=BalanceSheet.pdf"
      );
      return res.status(200).end(pdfData);
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

router.post("/get-balance/pdf", async function (req, res, next) {
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
      let balanceSheetPDFDocDefinition = await BalanceSheetPDFTemplate(
        response,
        req.body.ds_date
      );
      let pdfData = await createPDFBase64(balanceSheetPDFDocDefinition);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment; filename=BalanceSheet.pdf"
      // );
      return res.status(200).send({ status: true, pdfBase64: pdfData });
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

router.post("/db/connection", async function (req, res, next) {
  try {
    let { host, port, user, password } = req.body;
    let mysql = require("mysql2/promise");
    let connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    const [rows, fields] = await connection.execute("SELECT 1 + 1 AS result");
    if (rows[0].result === 2) {
      return res
        .status(200)
        .send({ status: true, message: "Connection successful!" });
    }
    return res
      .status(400)
      .send({ status: false, message: "Authentication failed." });
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

router.post("/db/sync", async function (req, res, next) {
  let accounts_data;
  try {
    if (
      req.body.accounts &&
      req.body.accounts instanceof Array &&
      req.body.accounts.length
    ) {
      let requests = await req.body.accounts.map((account) =>
        getBalance(account)
      );
      accounts_data = await Promise.all(requests);
    } else {
      throw {
        details: [
          { message: "Error! Please provide atleast one account adderess." },
        ],
      };
    }

    let { host, port, user, password } = req.body;
    let mysql = require("mysql2/promise");
    let connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    const [rows, fields] = await connection.execute("SELECT 1 + 1 AS result");
    if (rows[0].result === 2) {
      await connection.execute(
        `CREATE DATABASE IF NOT EXISTS ${req.body.database}`
      );
      // xrpl_acc_bal
      await connection.execute(
        `CREATE TABLE IF NOT EXISTS ${req.body.database}.xrpl_acc_bal (id int NOT NULL AUTO_INCREMENT, address varchar(255), balance varchar(255), ledger_index varchar(255), validated BOOLEAN, ds_date varchar(255), PRIMARY KEY (id))`
      );
      // await connection.execute(
      //   `DROP TABLE IF EXISTS ${req.body.database}.${
      //     req.body.ds_date
      //       ? req.body.ds_date.split("-").join("")
      //       : moment().format("DDMMYYYY")
      //   }`
      // );
      // await connection.execute(
      //   `CREATE TABLE ${req.body.database}.${
      //     req.body.ds_date
      //       ? req.body.ds_date.split("-").join("")
      //       : moment().format("DDMMYYYY")
      //   } (id int NOT NULL AUTO_INCREMENT, address varchar(255), balance varchar(255), ledger_index varchar(255), validated BOOLEAN, PRIMARY KEY (id))`
      // );
      await connection.execute(
        `DELETE FROM ${req.body.database}.xrpl_acc_bal WHERE ds_date='${req.body.ds_date}'`
      );
      let insert_query = `INSERT INTO ${req.body.database}.xrpl_acc_bal (address, balance, ledger_index, validated, ds_date) values`;
      accounts_data.forEach((obj, index) => {
        insert_query += `('${obj.result.account_data.Account}', '${
          obj.result.account_data.Balance
        }', '${obj.result.ledger_current_index}', '${
          obj.result.validated ? 1 : 0
        }', '${req.body.ds_date}')`;
        if (index !== accounts_data.length - 1) {
          insert_query += ",";
        }
      });
      await connection.execute(insert_query);
      return res.status(200).send({ status: true });
    }
    return res
      .status(400)
      .send({ status: false, message: "Authentication failed." });
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

router.get("/transactions/:account", async function (req, res, next) {
  try {
    const payload = {
      method: "account_tx",
      params: [
        {
          account: req.params.account,
          // binary: false,
          // forward: false,
          ledger_index_max: -1,
          ledger_index_min: -1,
          limit: 15,
        },
      ],
    };
    const response = await fetch(process.env.XRPL_CLIENT_ADDRESS, {
      method: "post",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return res.send(data);
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

async function getBalance(account) {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  await client.connect();

  const response = await client.request({
    command: "account_info",
    strict: true,
    account: account,
    ledger_index: "validated",
  });
  console.log(response);

  client.disconnect();
  return response;
}

async function serverInfo() {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  await client.connect();

  const response = await client.request({
    command: "server_info",
  });
  client.disconnect();
  return response;
}
