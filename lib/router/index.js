const btoa = require("btoa");
const fetch = require("node-fetch");
const url = require("url")
const redirect = encodeURIComponent(process.env.redirectURL+"callback");
const express = require("express"),
  router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID,
 CLIENT_SECRET = process.env.CLIENT_SECRET;

router.get("/", function(req, res) {
  res.render("index");
});

router.get("/home", (req, res) => {
  if(!req.session.username) res.render('index');
  res.render("home", {
    username: req.session.username
  });
});

router.get("/login", (req, res) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`
  );
});

router.get("/callback", async (req, res) => {
  if (req.query.access_token) console.log(req.query.access_token);
  let code = req.query.code;
  if (!code) throw new Error("NoCodeProvided");
  console.log(code);
  const creds = new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");
  fetch(
    `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&scope=identify`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`
      }
    }
  )
    .then(res => res.json())
    .then(response => {
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${response.access_token}`
        }
      })
        .then(res => res.json())
        .then(response => {
          console.log(response);
          req.session.username = response.username;
          res.redirect("./home");
        });
    })
    .catch(console.error);
});

module.exports = router;
