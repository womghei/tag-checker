
var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser')
const phantom = require('phantom');
app.use(bodyParser.urlencoded({extended: false, limit: '5000mb'}))
app.set('view engine','ejs');
app.use(express.static('public'));


app.get('/', (req,res) => {
  res.send('You reached index!');
});

app.get('/form', (req,res) => {
  res.render('form');
});

app.post("/get", function (req, res) {
  var result = req.body.resource;
  console.log(result);
  //res.render("result",{result:result});
  res.send("it works")
  // res.render('result', function(err, html) {
  //   res.status(200).send({ result:result });
  // });
  
});


app.get("/check", function (req, res) {
var destination = req.query.url;
(async function() {
  var resources = [];
  var html;
  var tealium = 'Tealium not found';
  var adobe = 'Adobe not found';
  var result = {resources:resources, html:html,tealium:tealium, adobe:adobe};
  const instance = await phantom.create(['--ignore-ssl-errors=yes','--ssl-protocol=any']);
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    if (requestData.url.includes("omtrdc.net/b/ss")){   
            result.tealium='Tealium found';
            result.adobe='Adobe found';
            console.info('Requesting', requestData.url);
            resources.push(requestData.url);
            var query = url.parse(requestData.url, true);
            console.log(query.query)
          }
  });
  const status = await page.open(destination);
  const content = await page.property('content');
  //console.log(content);
  result.html=content;
  //console.log(result.resources)
  await instance.exit();
  //res.render("result",{result:result})
  res.send(result); 
})();
});


// app.get("/check", function (req, res) {
// var destination = req.query.url;
// (async function() {
//   var resources = [];
//   var html;
//   var result = {resources:resources, html:html};
//   const instance = await phantom.create(['--ignore-ssl-errors=yes','--ssl-protocol=any']);
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//     if (requestData.url.includes("omtrdc.net/b/ss")){                                                                            
//             console.info('Requesting', requestData.url);
//             resources.push(requestData.url);
//             var query = url.parse(requestData.url, true);
//             console.log(query.query)
//           }
//   });
//   const status = await page.open(destination);
//   const content = await page.property('content');
//   //console.log(content);
//   result.html=content;
//   //console.log(result.resources)
//   await instance.exit();
//   res.render("result",{result:result})
//   //res.send(result); 
// })();
// });

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
