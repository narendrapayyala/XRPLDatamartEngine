const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");
const { sequelize, Sequelize } = require("../db/models");
const ReportTemplates = require("../db/models").report_templates;
const authUser = require("./middlewares").authUser;
router.use(authUser);

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

router.get("/report-templates/list", async function (req, res, next) {
  let templates,
    query = {};
  try {
    if (req.auth_user) {
      query = {
        where: {
          [Sequelize.Op.or]: [
            { access_type: "public" },
            { created_by: req.auth_user.id },
          ],
        },
      };
    } else {
      query = { where: { access_type: "public" } };
    }
    templates = await ReportTemplates.findAll(query);
    return res.status(200).send({ status: true, templates });
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
  {
    name: "NFTs Account",
    connector: "nftaccount",
    method: "account_nfts",
    route: "nft-info",
  },
  {
    name: "NFTs Offers",
    connector: "nftoffers",
    method: "nft_offers",
    route: "nft-info",
  },
];
