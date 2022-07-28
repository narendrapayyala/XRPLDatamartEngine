const express = require("express");
const router = express.Router();
const moment = require("moment");
const xrpl = require("xrpl");
const CsvParser = require("json2csv").Parser;
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2/promise");
const { filterFields } = require("../../helper");
const { entity_model, req_parameters } = require("./entity_model");
const ReportTemplates = require("../../../db/models").report_templates;

router.get("/", async function (req, res, next) {
  try {
    return res
      .status(200)
      .send({ status: true, message: "Success From NFT Offers connector" });
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
    requests = [],
    formatted_data = [],
    report_data = [];
  try {
    if (
      req.body.id &&
      req.body.uuid &&
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.nfts &&
      req.body.params.nfts instanceof Array &&
      req.body.params.nfts.length
    ) {
      template = await ReportTemplates.findOne({ where: { id: req.body.id } });
      req.body.params.nfts.forEach((nft_id) => {
        requests.push(
          getNftBuyOffers({
            nft_id,
            limit: 500,
            ...req.body.params,
            command: "nft_buy_offers",
          })
        );
        requests.push(
          getNftSellOffers({
            nft_id,
            limit: 500,
            ...req.body.params,
            command: "nft_sell_offers",
          })
        );
      });
      let response = await Promise.all(requests);
      response = response.sort((a, b) => a.type.localeCompare(b.type));
      // template = {
      //   fields:
      //     '[{"field":"NFT Id","field_normalized":"nft_id","method":"nfts_offers","type":"String","order":10},{"field":"Offer type","field_normalized":"offer_type","method":"nfts_offers","type":"String","order":9},{"field":"Flags","field_normalized":"offers.flags","method":"nfts_offers","type":"String","order":1},{"field":"Amount","field_normalized":"offers.amount","method":"nfts_offers","type":"String","order":1},{"field":"Currency","field_normalized":"offers.currency","method":"nfts_offers","type":"String","order":5},{"field":"Issuer","field_normalized":"offers.issuer","method":"nfts_offers","type":"String","order":5},{"field":"nft_offer_index","field_normalized":"offers.nft_offer_index","method":"nfts_offers","type":"Number","order":3},{"field":"owner","field_normalized":"offers.owner","method":"nfts_offers","type":"Number","order":2}]',
      // };
      template.fields = JSON.parse(template.fields).sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      response.forEach((resObj) => {
        if (resObj.response.result) {
          resObj.response.result.offers.forEach((offerObj) => {
            let temp = {
              offer_type: resObj.type,
              ...JSON.parse(JSON.stringify(resObj.response.result)),
              offers: offerObj,
            };
            temp.offers.amount = {
              value: "13.1",
              currency: "FOO",
              issuer: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            };
            if (typeof temp.offers.amount == "object") {
              let amountObj = temp.offers.amount;
              temp.offers.amount = amountObj.value;
              temp.offers.currency = amountObj.currency;
              temp.offers.issuer = amountObj.issuer;
            }
            formatted_data.push(temp);
          });
        }
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
      requests = await req.body.params.accounts.map((account) =>
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

router.post("/nft-info/buy-offers", async function (req, res, next) {
  let requests = [];
  try {
    if (
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.nfts &&
      req.body.params.nfts instanceof Array &&
      req.body.params.nfts.length
    ) {
      requests = await req.body.params.nfts.map((nft_id) =>
        getNftBuyOffers({
          nft_id,
          command: "nft_buy_offers",
          limit: 500,
          ...req.body.params,
        })
      );
      let response = await Promise.all(requests);
      return res.status(200).send({ status: true, response });
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

router.post("/nft-info/sell-offers", async function (req, res, next) {
  let requests = [];
  try {
    if (
      req.body.params instanceof Object &&
      req.body.params &&
      req.body.params.nfts &&
      req.body.params.nfts instanceof Array &&
      req.body.params.nfts.length
    ) {
      requests = await req.body.params.nfts.map((nft_id) =>
        getNftSellOffers({
          nft_id,
          command: "nft_sell_offers",
          limit: 500,
          ...req.body.params,
        })
      );
      let response = await Promise.all(requests);
      return res.status(200).send({ status: true, response });
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

async function getNftBuyOffers(params) {
  // const client = new xrpl.Client(process.env.XRPL_WS_NFT_CLIENT_ADDRESS);
  // const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
  // await client.connect();
  // const response = await client.request(params);
  // client.disconnect();
  // return { type: "buy_offer", response };

  const client = new xrpl.Client(process.env.XRPL_WS_NFT_CLIENT_ADDRESS);
  return client
    .connect()
    .then(() => {
      return client.request(params);
    })
    .then((response) => {
      client.disconnect();
      return { type: "buy_offer", response };
    })
    .catch((err) => {
      client.disconnect();
      return { type: "buy_offer", response: [] };
    });
}

async function getNftSellOffers(params) {
  // const client = new xrpl.Client(process.env.XRPL_WS_NFT_CLIENT_ADDRESS);
  // // const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
  // await client.connect();
  // const response = await client.request(params);
  // client.disconnect();
  // return { type: "sell_offer", response };

  const client = new xrpl.Client(process.env.XRPL_WS_NFT_CLIENT_ADDRESS);
  return client
    .connect()
    .then(() => {
      return client.request(params);
    })
    .then((response) => {
      client.disconnect();
      return { type: "sell_offer", response };
    })
    .catch((err) => {
      client.disconnect();
      return { type: "sell_offer", response: [] };
    });
}
