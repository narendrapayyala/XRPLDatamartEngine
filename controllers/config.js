const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");
const { v4: uuidv4 } = require("uuid");
const ReportTemplates = require("../db/models").report_templates;
const ConfigSchema = require("../db/models").configs;

router.post("/create", async function (req, res, next) {
  let body;
  try {
    body = { ...req.body, uuid: uuidv4() };
    let response = await serverStatus(body.url, {
      id: 1,
      command: "server_state",
    });
    if (!response || !response.id) {
      throw { details: [{ message: "Error! Invalid server URI." }] };
    }
    await ConfigSchema.create(body);
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

router.get("/", async function (req, res, next) {
  let config;
  try {
    config = await ConfigSchema.findOne();
    return res.status(200).send({ status: true, config });
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

router.post("/update", async function (req, res, next) {
  let body;
  try {
    body = { ...req.body };
    let response = await serverStatus(body.url, {
      id: 1,
      command: "server_state",
    });
    if (!response || !response.id) {
      throw { details: [{ message: "Error! Invalid server URI." }] };
    }
    await ConfigSchema.update(body, { where: { id: body.id } });
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

module.exports = router;

async function serverStatus(url, params) {
  const client = new xrpl.Client(url);
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return response;
}
