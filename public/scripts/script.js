console.log("hi there");

$("#field").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit").click();
    }
});

function getSource()
{
	$.get('/query', {url: "asdf"}, function(data) { 
			console.log(data.body);
			//$(".html").text(data.body);
	});
}