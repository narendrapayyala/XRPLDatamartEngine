var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(require("./controllers/middlewares").serverConfig);

app.use("/", indexRouter);
app.use("/user", require("./routes/users"));
app.use("/entity", require("./controllers/entity"));
app.use("/server", require("./controllers/connectors/server"));
app.use("/account", require("./controllers/connectors/account"));
app.use("/nftaccount", require("./controllers/connectors/nfts_account"));
app.use("/nftoffers", require("./controllers/connectors/nfts_offers"));
app.use("/config", require("./controllers/config"));
// app.use("/xrpl", require("./routes/xrpl"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
