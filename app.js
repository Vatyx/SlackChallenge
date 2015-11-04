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
	for(var i = 0; i < source.length; i++)
	{
		if(source[i] === "<")
		{
			if(source[i+1] !== "/" && source[i+1] !== "!")
			{
				foundTag = true;
			}
			continue;
		}
		else if(foundTag)
		{
			if(source[i] === ">" || source[i] === " ")
			{
				foundTag = false;
				if(tagsCount[currentTag] === undefined)
				{
					tagsCount[currentTag] = 1;
				}
				else
				{
					tagsCount[currentTag]++;
				}
				currentTag = "";
			}
			else
			{
				currentTag = currentTag.concat(source[i]);
			}
		}
	}
	return tagsCount;
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});