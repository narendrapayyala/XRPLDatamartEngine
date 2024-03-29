const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");
const { v4: uuidv4 } = require("uuid");
const ReportTemplates = require("../db/models").report_templates;
const ConfigSchema = require("../db/models").configs;
const VerifyToken = require("./middlewares").verifyToken;
router.use(VerifyToken);

router.post("/create", async function (req, res, next) {
  let body;
  try {
    body = { ...req.body, uuid: uuidv4(), user_id: req.auth_user.id };
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
    config = await ConfigSchema.findOne({
      where: { user_id: req.auth_user.id },
    });
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
    await ConfigSchema.update(body, {
      where: { id: body.id, user_id: req.auth_user.id },
    });
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

module.exports = router;

async function serverStatus(url, params) {
  const client = new xrpl.Client(url);
  await client.connect();
  const response = await client.request(params);
  client.disconnect();
  return response;
}
