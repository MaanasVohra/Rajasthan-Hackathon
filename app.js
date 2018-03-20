var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
// connection to database;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "xxxx",
    database: "rajasthan_hackathon"
});

// setting up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

con.connect(function (err) {
    if (err) {
        console.log("Error connecting to database");
    } else {
        console.log("Connected to database!");
    }
});

// ROUTES

// landing page
app.get("/", function (req, res) {
    res.render('landing');
});

// maps page
app.get("/maps", function (req, res) {
    var sqlStatement = "select * from markers;";
    con.query(sqlStatement, function (err, result, fields) {
        if (err) {
            console.log("Error querying!");
        } else {
            res.render("maps", { result: result });
        }
    });
    // res.sendFile(__dirname + "/maps1.html");
});

// sign up / login -> user page 
app.get("/signuploginuser", function (req, res) {
    res.render("signuploginuser");
});

// sign up / login -> guide page 
app.get("/signuploginguide", function (req, res) {
    res.render("signuploginguide");
});

// profile page -> user
app.get("/profileUser", function (req, res) {
    res.render("profileUser1");
});

// profile page -> guide
app.get("/profileGuide", function (req, res) {
    res.render("profileGuide");
});

// POST REQUESTS

// post request for sign up -> user
app.post("/signuploginuser", function (req, res) {
    // parsing body parameters
    var username = "'" + req.body.username + "'";
    var password = "'" + req.body.password + "'";
    var fullname = "'" + req.body.fullname + "'";
    var email = "'" + req.body.email + "'";
    var city = "'" + req.body.city + "'";
    var state = "'" + req.body.state + "'";
    var country = "'" + req.body.country + "'";

    var sqlStatement = "insert into member values (" + username + ", " + password + ");";

    con.query(sqlStatement, function (err, result) {
        if (err) {
            console.log("Duplicate Entry");
        } else {
            console.log("Entry successfully inserted into member");
            var sqlStatement = "insert into user values (" + username + ", " + password + ", " + fullname + ", " + email + ", " + city + ", " + state + ", " + country + ");";
            con.query(sqlStatement, function (err, result) {
                if (err) {
                    console.log("error inserting into user");
                } else {
                    console.log("Successful insertion into user");
                }
            });
        }
        res.redirect("/signuploginuser");
    });
});

// post request for login -> user;
app.post("/profileUser", function (req, res) {
    // parsing body parameters
    var username = req.body.username;
    var password = req.body.password;

    var sqlStatement = "select username, password from user where username = ?";
    con.query(sqlStatement, [username], function (err, result, values) {
        if (err) {
            console.log("Error querying");
        } else {
            if (result.length == 0) {
                console.log("No such username exists");
                res.redirect("/signuploginuser");
            } else {
                if (result[0].password == password) {
                    console.log("Correct login!");
                    res.redirect("/profileUser");
                } else {
                    console.log(result[0].password + " " + password);
                    console.log("Wrong password");
                    res.redirect("/signuploginuser");
                }
            }
        }
    });
});

// post request for sign up -> guide
app.post("/signuploginguide", function (req, res) {
    // parsing body parameters
    var username = "'" + req.body.username + "'";
    var password = "'" + req.body.password + "'";
    var full_name = "'" + req.body.fullname + "'";
    var email = "'" + req.body.email + "'";
    var mobile_no = "'" + req.body.mobile_no + "'";
    var bhamasha_no = "'" + req.body.bhamasha_no + "'";
    var city = "'" + req.body.city + "'";
    var state = "'" + req.body.state + "'";
    var zip = "'" + req.body.zip + "'";

    var sqlStatement = "insert into member values (" + username + ", " + password + ");";

    con.query(sqlStatement, function (err, result) {
        if (err) {
            console.log("Duplicate Entry");
        } else {
            console.log("Successfull insertion into member from guide");
            var sqlStatement = "insert into guide values (" + username + ", " + password + ", " + full_name + ", " + email + ", " + mobile_no + ", " + bhamasha_no + ", " + city + ", " + state + ", " + zip + ");";
            con.query(sqlStatement, function (err, result) {
                if (err) {
                    console.log("Error inserting into guide");
                } else {
                    console.log("Successful insertion into guide");
                }
            });
        }
        res.redirect("/signuploginguide");
    });
});

// post request for guide
app.post("/profileGuide", function (req, res) {
    // parsing body parameters;
    var username = req.body.username;
    var password = req.body.password;

    var sqlStatement = "select username, password from guide where username = ?";
    con.query(sqlStatement, [username], function (err, result, values) {
        if(err) {
            console.log("Error querying");
        } else {
            if(result.length == 0){
                console.log("no such result exists");
                res.redirect("/signuploginguide");
            } else {
                if(result[0].password == password) {
                    console.log("Successful login!");
                    res.redirect("/profileGuide");
                } else {
                    console.log("Wrong password");
                    res.redirect("/signuploginguide");
                }
            }
        }
    })
});

app.listen(3000, function () {
    console.log("Server initiated!");
});