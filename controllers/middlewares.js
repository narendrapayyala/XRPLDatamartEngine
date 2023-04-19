const ConfigSchema = require("../db/models").configs;
const Users = require("../db/models").users;
const FirebaseAdmin = require("./firebase-config");

const serverConfig = async (req, res, next) => {
  let config = await ConfigSchema.findOne();
  // console.log(config);
  req.server_config = JSON.parse(JSON.stringify(config));
  process.env.XRPL_WS_CLIENT_ADDRESS = JSON.parse(JSON.stringify(config)).url;
  next();
};

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["token"];
    if (!token) {
      res.status(401);
      throw { message: "Error! Access Denied" };
    }
    const decodeValue = await FirebaseAdmin.auth().verifyIdToken(token);
    if (decodeValue && decodeValue.email) {
      let user = await Users.findOne({
        where: { email: decodeValue.email },
        raw: true,
        attributes: { exclude: ["token"] },
      });
      if (!user) {
        res.status(401);
        throw { message: "Error! User not found" };
      }
      req.auth_user = user;
      let config = await ConfigSchema.findOne({
        where: { user_id: user.id },
        raw: true,
      });
      if (config) {
        req.server_config = config;
        process.env.XRPL_WS_CLIENT_ADDRESS = config.url;
      }
      next();
    }
  } catch (err) {
    if (err.message && err.message.includes("Firebase")) {
      err.message = "Invalid Token";
    }
    return res.status(401).send({
      status: false,
      auth: false,
      message: err.message ? err.message : "Internal Server Error.",
    });
  }
};

const authUser = async (req, res, next) => {
  try {
    let token = req.headers["token"];
    if (token) {
      let user = await Users.findOne({
        where: { token: token },
        raw: true,
        attributes: { exclude: ["token"] },
      });
      req.auth_user = user;
    }
    next();
  } catch (err) {
    return res.send({
      status: false,
      message: err.message ? err.message : "Internal Server Error.",
    });
  }
};

module.exports = {
  serverConfig,
  verifyToken,
  authUser,
};
