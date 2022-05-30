const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
const CsvParser = require("json2csv").Parser;
const { v4: uuidv4 } = require("uuid");
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
      // template.fields.push({
      //   field: "validated",
      //   field_normalized: "validated",
      //   type: "Boolean",
      //   order: 8,
      //   method: "account_tx",
      // });
      // template.fields.forEach((obj, i) => {
      //   // if (i > 3) {
      //   //   obj.method = "account_tx";
      //   // } else {
      //   obj.method = "account_info";
      //   // }
      // });
      // console.log(template.fields);
      // await ReportTemplates.update(
      //   { fields: JSON.stringify(template.fields) },
      //   { where: { id: req.body.id } }
      // );

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
      // console.log("formatted_data", formatted_data);
      let response = await Promise.all(requests);
      template.fields = template.fields.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        let row = {};
        let accIndex = formatted_data.findIndex(
          (obj) => obj.account === resObj.account
        );
        if (accIndex !== -1) {
          formatted_data[accIndex].data[resObj.method] = resObj.response.result;
        } else {
        }
        // methods.forEach((method) => {
        //   switch (method) {
        //     case "account_info":
        //       console.log("account_info");
        //       break;
        //     case "account_tx":
        //       console.log("account_tx");
        //       break;
        //     default:
        //       break;
        //   }
        // });
        // template.fields.forEach((obj) => {
        //   console.log(obj);
        //   row[obj.field] = filterFields(
        //     resObj.result,
        //     obj.field_normalized.split(".")
        //   );
        // });
        // report_data.push(row);
      });
      console.log("formatted_data", formatted_data);
      let normalized_data = [];
      formatted_data.forEach((account) => {
        // console.log(Object.keys(account.data));
        if (methods.includes("account_tx")) {
          // console.log(account.data.account_tx.transactions.length);
          account.data.account_tx.transactions.forEach((transaction) => {
            let row = { ...account.data };
            row.account_tx.transactions = transaction;
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
      // [{"field":"Account(Account Info)","field_normalized":"account_data.Account","type":"String","order":0,"method":"account_info"},{"field":"Balance(Account Info)","field_normalized":"account_data.Balance","type":"String","order":1,"method":"account_info"},{"field":"PreviousTxnID(Account Info)","field_normalized":"account_data.PreviousTxnID","type":"String\t","order":2,"method":"account_info"},{"field":"PreviousTxnLgrSeq(Account Info)","field_normalized":"account_data.PreviousTxnLgrSeq","type":"Number","order":3,"method":"account_info"},{"field":"AccountTxnID(Account Info)","field_normalized":"account_data.AccountTxnID","type":"String","order":4,"method":"account_info"},{"field":"TransferRate(Account Info)","field_normalized":"account_data.TransferRate","type":"Number","order":8,"method":"account_info"},{"field":"ledger_current_index(Account Info)","field_normalized":"aledger_current_index","type":"Integer","order":7,"method":"account_info"},{"field":"ledger_index(Account Info)","field_normalized":"ledger_index","type":"Integer","order":5,"method":"account_info"},{"field":"validated(Account Info)","field_normalized":"validated","type":"Boolean","order":6,"method":"account_info"}]
      // [{"field":"Account(account_data)","field_normalized":"account_data.Account","type":"String","order":0,"method":"account_info"},{"field":"Balance(account_data)","field_normalized":"account_data.Balance","type":"String","order":1,"method":"account_info"},{"field":"PreviousTxnID(account_data)","field_normalized":"account_data.PreviousTxnID","type":"String\t","order":2,"method":"account_info"},{"field":"PreviousTxnLgrSeq(account_data)","field_normalized":"account_data.PreviousTxnLgrSeq","type":"Number","order":3,"method":"account_info"},{"field":"AccountTxnID(account_data)","field_normalized":"account_data.AccountTxnID","type":"String","order":4,"method":"account_info"},{"field":"TransferRate(account_data)","field_normalized":"account_data.TransferRate","type":"Number","order":8,"method":"account_info"},{"field":"ledger_current_index","field_normalized":"aledger_current_index","type":"Integer","order":7,"method":"account_info"},{"field":"ledger_index","field_normalized":"ledger_index","type":"Integer","order":5,"method":"account_info"},{"field":"validated","field_normalized":"validated","type":"Boolean","order":6,"method":"account_info"},{"field":"ledger_index_min(Account transactions)","field_normalized":"ledger_index_min","type":"Integer","order":9,"method":"account_tx"},{"field":"TransactionType(Account transactions)","field_normalized":"transactions.tx.TransactionType","type":"String","order":10,"method":"account_tx"}]
      // [{"field":"Account(account_data)","field_normalized":"account_info.account_data.Account","type":"String","order":0,"method":"account_info"},{"field":"Balance(account_data)","field_normalized":"account_info.account_data.Balance","type":"String","order":1,"method":"account_info"},{"field":"PreviousTxnID(account_data)","field_normalized":"account_info.account_data.PreviousTxnID","type":"String\t","order":2,"method":"account_info"},{"field":"PreviousTxnLgrSeq(account_data)","field_normalized":"account_info.account_data.PreviousTxnLgrSeq","type":"Number","order":3,"method":"account_info"},{"field":"AccountTxnID(account_data)","field_normalized":"account_info.account_data.AccountTxnID","type":"String","order":4,"method":"account_info"},{"field":"TransferRate(account_data)","field_normalized":"account_info.account_data.TransferRate","type":"Number","order":8,"method":"account_info"},{"field":"ledger_current_index","field_normalized":"account_info.aledger_current_index","type":"Integer","order":7,"method":"account_info"},{"field":"ledger_index","field_normalized":"account_info.ledger_index","type":"Integer","order":5,"method":"account_info"},{"field":"validated","field_normalized":"account_info.validated","type":"Boolean","order":6,"method":"account_info"}]
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

router.post("/account-info/csv", async function (req, res, next) {
  let template,
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
        accountInfo({ account, command: "account_info", ...req.body.params })
      );
      let response = await Promise.all(requests);
      template.fields = JSON.parse(template.fields).sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj, index) => {
        let row = {};
        template.fields.forEach((obj) => {
          !index && csvFields.push(obj.field);
          row[obj.field] = filterFields(
            resObj.result,
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

router.post("/account-info/csv", async function (req, res, next) {
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
        let row = {};
        let accIndex = formatted_data.findIndex(
          (obj) => obj.account === resObj.account
        );
        if (accIndex !== -1) {
          formatted_data[accIndex].data[resObj.method] = resObj.response.result;
        } else {
        }
      });
      console.log("formatted_data", formatted_data);
      let normalized_data = [];
      formatted_data.forEach((account) => {
        // console.log(Object.keys(account.data));
        if (methods.includes("account_tx")) {
          account.data.account_tx.transactions.forEach((transaction) => {
            let row = { ...account.data };
            row.account_tx.transactions = transaction;
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
