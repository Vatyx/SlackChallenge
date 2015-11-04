var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');

app.get('/', function(req, res)
{
	console.log("In base");
	res.render('test.jade');
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
	 		//console.log(body);
	 		res.status(200);
	 		payload = computeTagsCount(body);
	 		res.json({"body": body, "count": payload});
	 	}
	 	else
	 	{
	 		res.status(500).send();
	 	}
	});
	console.log("got here");
})

function computeTagsCount(source)
{	
	var tagsCount = {};
	var foundTag = false;
	var currentTag = "";

	var alpha = /(?:<)(\w+)/g;

	var mine = alpha.exec(source);
	while(mine != null)
	{
		console.log(mine[1]);
		if(tagsCount[mine[1]] === undefined)
		{
			tagsCount[mine[1]] = 1;
		}
		else
		{
			tagsCount[mine[1]]++;
		}
		var mine = alpha.exec(source);
	}

	return tagsCount;
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});