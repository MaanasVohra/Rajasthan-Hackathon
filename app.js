var express = require("express");
var app = express();
var mysql = require("mysql");

// connection to database;

var con  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "xxxx",
    database: "rajasthan_hackathon"
});

con.connect(function(err){
    if(err) {
        console.log("Error connecting to database");
    } else {
        console.log("Connected to database!");
    }
});

app.get("/maps", function(req, res){
    var sqlStatement = "select * from markers;";
    con.query(sqlStatement, function(err, result, fields){
        if(err) {
            console.log("Error querying!");
        } else {
            res.render("maps.ejs", {result: result});
        }
    });
    // res.sendFile(__dirname + "/maps1.html");
});

app.listen(3000, function(){
    console.log("Server initiated!");
});