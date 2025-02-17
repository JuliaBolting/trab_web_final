// O objetivo desse arquivo é configurar o express
const Crypto = require("crypto");
const HbsConfigureCustomHelpers = require("../hbs_config/HbsConfigureCustomHelpers");
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const config = require("config");
const webRoutes = require("../routes/web");
const apiRoutes = require("../routes/api");
const app = express();

app.set("port", process.env.PORT || config.get("server.port"));
app.set("view engine", "hbs");

HbsConfigureCustomHelpers.run();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(express.json());

app.use(session({
    secret: Crypto.randomBytes(32).toString('hex'), 
    resave: false,
    saveUninitialized: true
}));

app.use(apiRoutes);
app.use(webRoutes);

module.exports = app;