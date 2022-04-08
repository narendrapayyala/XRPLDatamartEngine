const ConfigSchema = require("../db/models").configs;

const serverConfig = async (req, res, next) => {
  let config = await ConfigSchema.findOne();
  // console.log(config);
  req.server_config = JSON.parse(JSON.stringify(config));
  process.env.XRPL_WS_CLIENT_ADDRESS = JSON.parse(JSON.stringify(config)).url;
  next();
};

module.exports = {
  serverConfig,
};
