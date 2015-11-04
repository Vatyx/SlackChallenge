console.log("hi there");

var source = "";
var tagsCount = {};

$("#field").keyup(function(event){
    if(event.keyCode === 13){
        $("#submit").click();
    }
});

function getSource()
{
	$.ajax({url: "/query", data: {url: $("#field").val()}, success: function(data, status)
	{
		source = data.body;
		$('#codehere').text(source);
		tagsCount = data.count;
	}, 
	error: function()
	{
		console.log("Oh shucks an error");
	}});
}

function computeTags()
{	
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
}