var source = "";
var tagsCount = {};

$("#field").keyup(function(event){
    if(event.keyCode === 13){
    	console.log("I'm in here");
        $("#submit").click();
    }
});

function getSource()
{
	$('.header').addClass('moveup');
	$('.box').addClass('open');
	$.ajax({url: "/query", data: {url: $("#field").val()}, success: function(data, status)
	{
		source = data.body;
		console.log(source);
		$('#codehere').text(source);
		tagsCount = data.count;
		addButtons();
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

function addButtons()
{
	$buttonContainer = $('#buttonContainer');
	$buttonContainer.empty();

	var key;
	for(key in tagsCount)
	{
		$buttonContainer.append('<div class="tagButton" onclick="highlight(\'' + key.toString() + '\')"><div class="tagButtonText">' + key + '</div> <div class="tagButtonText">' + tagsCount[key] + ' times</div></div>');
	}
	$buttonContainer.append("<div class='tagButton empty'></div>")
}

function highlight(tag)
{
	$("#codehere").unhighlight();
	$("#codehere").highlight(["<" + tag + ">", "<" + tag, "</" + tag + ">"]);
}