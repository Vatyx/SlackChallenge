var express = require('express');
var request = require('request');
var html = require('html');

app = express();

//listening on this port because of heroku
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));	//where static files will be
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');	//using Jade

//...........
//Routing
//...........

//Base route
app.get('/', function(req, res)
{
	console.log("In base");

	res.render('index.jade');	//return base file
});

//Query route
//Query for specific url that user inputs.
//If successful then return html and object containing tags and their count
//If not then send a 500
app.get('/query', function(req, res)
{
	console.log("In query");
	
	var url = req.query.url;	//get URL
	//make sure URL is in the correct format (add http:// if it isnt't here)
	if (!url.match(/^[a-zA-Z]+:\/\//))
	{
	    url = 'http://' + url;
	}

	//payload to be sent
	var payload = {};
	//make the request
	request(url, function (error, response, body) {
		//if request recieved a response
	 	if(response!=undefined)
	 	{
	 		res.status(200);

	 		payload = computeTagsCount(body); //get the count of all the tags
	 		body = html.prettyPrint(body, {indent_size: 4});	//make the response html pretty
	 		res.json({"body": body, "count": payload});	//send 
	 	}
	 	//request failed
	 	else
	 	{
	 		res.status(500).send();
	 	}
	});
})

//Given a string, object containing the html tags present and the
//count of each of them will be returned
function computeTagsCount(source)
{	
	var tagsCount = {}; //object to be returned

	//regex for finding a html tag
	//an HTML tag has to start with <, and then only alphanumeric characters can appear.
	//the < character is matched but not captured
	var alpha = /(?:<)(\w+)/g;	

	//match the tag
	var mine = alpha.exec(source);
	//keep executing until no more tags are found
	while(mine != null)
	{
		//if the tag doesn't exist in the object, add it
		if(tagsCount[mine[1]] === undefined)
		{
			tagsCount[mine[1]] = 1;
		}
		//otherwise increment it
		else
		{
			tagsCount[mine[1]]++;
		}
		//find the next tag
		var mine = alpha.exec(source);
	}

	return tagsCount;
}

//listen to the port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});