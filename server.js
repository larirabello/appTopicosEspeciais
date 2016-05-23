var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use("/public", express.static('public'));
app.set("view engine", 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'app'
});


app.get('/', function(req, res) {
  //connection.connect();
  var foodlist;
  var topN;

  connection.query('SELECT * FROM food order by rand() limit 2', function(err, rows, fields) {
    if (err) throw err;
    foodlist = rows;
  });

  connection.query('SELECT * FROM food order by votes desc limit 4', function(err, rows, fields) {
    if (err) throw err;
    topN = rows;
    res.render('pages/index', {
      foodlist: foodlist,
      topN: topN
    });
  });

  //connection.end();
});



app.post("/vote", function(req,res) {

  connection.query('UPDATE FOOD SET VOTES = VOTES+1 WHERE ID=?', [req.body.id], function(err, rows, fields) {
      if (err) console.log(err);
  });
  res.redirect("/");
});


app.listen(3000, '0.0.0.0', ()=> {
  console.log('Server listening on port 3000.');
});
