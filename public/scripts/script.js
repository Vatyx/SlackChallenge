console.log("hi there");

$("#field").keyup(function(event){
    if(event.keyCode === 13){
        $("#submit").click();
    }
});

function getSource()
{
	$.ajax({url: "/query", data: {url: "afsd"}, success: function(data, status)
	{
		console.log(data.body);


	}, 
	error: function()
	{
		console.log("Oh shucks an error");
	}});
}