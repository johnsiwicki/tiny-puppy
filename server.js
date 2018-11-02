var express = require('express');
var app = express();
var fs = require('fs-extra')
var path = require('path');
var bodyParser = require('body-parser');

 
app.set('port', (process.env.PORT || 5000));

//allow downloads in the root
app.use(express.static(__dirname));

//Something so we can post data
app.use(bodyParser.urlencoded({
    extended: false
}));


//Send traffic to the form
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

//Once you fill out the form start processing our data
app.post('/', function(req, res){
    var myVar = req.body.url;
    var circle = require('./index.js')(myVar);

    setImmediate(() => {
      res.sendFile(__dirname + '/index.html');
    });
   
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

 


< div class = "row" > < div class = "columns" > < p > < a href = "https://www.prohome1.com/siding/before-after/32592-before-and-after-of-garage-in-chicago-il.html"
tabindex = "0" > Before and After of Garage in Chicago, IL < /a></p > < /div>        </div >