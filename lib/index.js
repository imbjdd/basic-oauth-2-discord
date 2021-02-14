const express = require("express")
const app = express()

if (!process.env.NODE_ENV) {
  const dotenv = require('dotenv')
  dotenv.config()
}

const session = require("express-session")

app.use(express.static("public"))
app.use(
  session({
    secret: process.env.secretSession,
    resave: true,
    saveUninitialized: true
  })
)

const router = require("./index.js")
app.set("view engine", "ejs")
app.use(router)


const listener = app.listen(process.env.PORT || 3000, function() {
  console.log(process.env.redirectURL + listener.address().port);
})
