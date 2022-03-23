const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
const { v4: uuidv4 } = require("uuid");
const { entity_model, req_parameters } = require("./entity_model");
const ReportTemplates = require("../../../db/models").report_templates;
const { filterFields } = require("../../helper");

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

router.get("/server-info/params", async function (req, res, next) {
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

router.get("/server-info/", async function (req, res, next) {
  try {
    let response = await serverInfo();
    return res.status(200).send({ status: true, response });
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

router.post("/server-info/template", async function (req, res, next) {
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

router.post("/server-info/fetch", async function (req, res, next) {
  let template,
    report_data = [{}];
  try {
    if (
      req.body.id &&
      req.body.uuid &&
      req.body.params instanceof Object &&
      req.body.params
    ) {
      template = await ReportTemplates.findOne({ where: { id: req.body.id } });
      let response = await serverInfo({
        command: "server_info",
        ...req.body.params,
      });
      template.fields = JSON.parse(template.fields);
      template.fields.forEach((obj) => {
        console.log(obj.field_normalized.split("."));
        report_data[0][obj.field] = filterFields(
          response.result.info,
          obj.field_normalized.split(".")
        );
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

module.exports = router;

async function serverInfo(params) {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return response;
}
