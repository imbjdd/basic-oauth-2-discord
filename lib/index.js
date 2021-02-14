const express = require("express");
const app = express();
const router = require("./index.js");
const session = require("express-session");

if (!process.env.NODE_ENV) {
  const dotenv = require('dotenv');
  dotenv.config();
}

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.secretSession
  })
);
app.set("view engine", "ejs");
app.use(router);

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log("App is listening on port " + listener.address().port);
});
