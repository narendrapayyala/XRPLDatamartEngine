const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");

router.get("/list", async function (req, res, next) {
  try {
    return res.status(200).send({ status: true, entities });
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

let entities = [
  {
    name: "Server Info",
    connector: "server",
    method: "server_info",
    route: "server-info",
  },
  {
    name: "account Info",
    connector: "account",
    method: "account_info",
    route: "account-info",
  },
];
