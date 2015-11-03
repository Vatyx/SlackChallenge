var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');

app.get('/', function(req, res)
{
	console.log("In base");
	res.render('index.jade');
});

app.get('/query', function(req, res)
{
	console.log("In query");
	var url = req.query.url;
	console.log(url); 
	var payload = "";
	request(url, function (error, response, body) {
	 	if(response!=undefined)
	 	{
	 		console.log(body);
	 		res.status(200);
	 		//body = "<!DOCTYPE html><div>hi</div>";
	 		res.json({"body": body});
	 	}
	 	else
	 	{
	 		res.status(500).send();
	 	}
	});
	console.log("got here");
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});