const express = require("express");
const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {  res.render('index');});

const listener = app.listen(process.env.PORT, function() {
  console.log("App is listening on port " + listener.address().port);
});
