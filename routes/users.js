const express = require("express");
const router = express.Router();
const Users = require("../db/models").users;

/* GET users listing. */
router.get("/list", async function (req, res, next) {
  let users;
  try {
    users = await Users.findAll();
    return res.status(200).send({ status: true, users });
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

router.post("/token", async function (req, res, next) {
  try {
    let [user, isCreated] = await Users.findOrCreate({
      where: { email: req.body.email },
      defaults: req.body,
    });
    return res.status(200).send({ status: true, user });
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
