const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
const { v4: uuidv4 } = require("uuid");
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

router.post("/account-info/fetch", async function (req, res, next) {
  let template,
    report_data = [];
  try {
    if (
      req.body.id &&
      req.body.uuid &&
      req.body.accounts &&
      req.body.accounts instanceof Array &&
      req.body.accounts.length &&
      req.body.params instanceof Object &&
      req.body.params
    ) {
      template = await ReportTemplates.findOne({ where: { id: req.body.id } });
      let requests = await req.body.accounts.map((account) =>
        accountInfo({ account, command: "account_info", ...req.body.params })
      );
      let response = await Promise.all(requests);
      template.fields = JSON.parse(template.fields).sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        let row = {};
        template.fields.forEach((obj) => {
          row[obj.field] = filterFields(
            resObj.result.info,
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
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return response;
}
