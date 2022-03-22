const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
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
    body = { ...req.body };
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

// router.get("/server-info/report/:uuid", async function (req, res, next) {
//   try {
//     let response = await serverInfo();
//     return res.status(200).send({ status: true, response });
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

module.exports = router;

async function serverInfo() {
  const client = new xrpl.Client(process.env.XRPL_WS_CLIENT_ADDRESS);
  await client.connect();

  const response = await client.request({
    command: "server_info",
  });
  client.disconnect();
  return response;
}
