const express = require('express');
const bodyParser = require('body-parser');
var Airtable = require('airtable');
var request = require('request');
const https = require("https");
const Browser = require('zombie');


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyipbfMrxJccaPgO'
});
var base = Airtable.base('appyRFXMOm5Ij4ULW');
var firebase = require("firebase");
var fs = require('fs');
var config = {
    apiKey: "AIzaSyDPx7OaGYa0D0pepi4NhkjtyhY_sxEjESg",
    authDomain: "test-f5a84.firebaseapp.com",
    databaseURL: "https://test-f5a84.firebaseio.com",
    projectId: "test-f5a84",
    storageBucket: "test-f5a84.appspot.com",
    messagingSenderId: "564153605467"
  };
  firebase.initializeApp(config);

var database = firebase.database();


const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");


app.use(express.static('public'));

// Set Static Folder
//app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  //console.log(req);
    res.render("index")
});

app.get('/log', (req, res) => {
    console.log(req.headers);
    res.send(req.headers);
});


app.get('/form', (req,res) => {
  res.render('form');
})

app.get('/get', (req,res) => {
console.log(req.query);
var url = req.query.url;
  if (url){
  request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  // <script src="https://tags.tiqcdn.com/utag/hsbc/hk-rbwm/prod/utag.sync.js">
  var string_1 = "//tags.tiqcdn.com/utag/hsbc";
  var string_2 = "/utag.sync.js";
  if (body.indexOf(string_1) !== -1 && body.indexOf(string_2) !== -1){
    res.render('get', {content: body, tealium: "Tealium is here"});
  }
    else {
    res.render('get', {content: body, tealium: "Tealium is NOT here"});
  }
        
});
    }
  else {
    res.send('Please add the page URL like this: https://skillful-submarine.glitch.me/get?url={full url}');
  }
});


app.get('/get2', (req,res) => {
console.log(req.query);
var url = req.query.url;
  if (url){
  request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  var string_1 = "//tags.tiqcdn.com/utag/hsbc";
  var string_2 = "/utag.sync.js";
  var tealium_exists = "Tealium is found on " + url; 
  var tealium_not_exists = "Tealium NOT found on " + url;
  if (body.indexOf(string_1) !== -1 && body.indexOf(string_2) !== -1){
    res.send({response: tealium_exists, body: body});
  }
    else {
    res.send({response: tealium_not_exists, body: ''});
  }
  //res.send(body)    
});
    }
  else {
    //res.send('Error');
  }
});

// app.get('/zombie', (req,res) =>{
  
//   const browser = new Browser

//   var url ="https://www.hsbc.com.hk/zh-hk/";
// browser.visit(url).then(function(){
//   var resources = browser.resources
//     console.log(resources); // array with downloaded resources
//     res.render('zombie',{resources:resources})
// });
// })





app.get('/1x1.gif', (req, res) => {
    var ip = req.headers["sx-forwarded-for"];
    var buf = new Buffer(35);
    buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(buf, 'binary');
    console.log(req.query);
    base('Table 1').create({
    "HitId": req.query.Fingerprint+' '+req.query.Time,
    "VisitId":new Date(),
    "Time": new Date(),
    "FirstVisitTime": req.query.FirstVisit,
    "LastVisitTime": req.query.LastVisit,
    "IP": req.query.IP,
    "Fingerprint": req.query.Fingerprint,
    "Country": req.query.Country,
    "URL": req.headers.referer,
    "Page": req.query.Page,
    "Device": req.headers["user-agent"],
    },  function(err, record) {
      if (err) {
        console.error(err); 
        return; 
      }
    //res.end(buf, 'binary');

});
    
})

app.get('/abc', (req, res) => {
  console.log(req.query)
    res.render("abc", {req:req.query.test+'&abc='+req.query.abc+'&def='+req.query.def})
});

app.get('/def', (req, res) => {
    res.render("def")
});

app.get('/thankyou', (req, res) => {
    res.render("thankyou")
});

app.post('/form', (req, res) => {
    console.log(req.body);
    var UID = Math.floor((Math.random() * Date.now()));
    function writeUserData(userId, name, email) {
        firebase.database().ref('users/' + userId).set({
          username: req.body.name,
          email: req.body.email
        });
      }
    writeUserData(UID, req.params.name, req.params.email)  
    res.redirect("thankyou")
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
