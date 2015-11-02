console.log("hi there");

$.get('/query', {url: "http://www.example.com"}, function(data) { 
		console.log(data.body); 
});