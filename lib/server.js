const express = require("express");
const app = express();
const router = require("./router/index.js");
const session = require("express-session");
const config = require("../config.json")
app.use(express.static("public"));
app.use(
  session({
    secret: config.secretSession
  })
);
app.set("view engine", "ejs");
app.use(router);

const listener = app.listen(process.env.PORT, function() {
  console.log("App is listening on port " + listener.address().port);
});
