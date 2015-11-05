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
		if(!$('.box').hasClass('open'))
		{
			source = data.body;
			$('#codehere').text(source);
			tagsCount = data.count;
			addButtons();
			$('body,html').animate({scrollTop: $('#buttonContainer').position().top +50}, 500);

			$('.header').addClass('moveup');
			$('.box').addClass('open');
		}
		else
		{
			$('.box').addClass('animated bounceOutRight');
			setTimeout(function()
			{	
				source = data.body;
				$('#codehere').text(source);
				tagsCount = data.count;
				addButtons();
				
				$('body,html').animate({scrollTop: $('#buttonContainer').position().top +50}, 500);
				$('.box').removeClass('animated bounceOutRight');
				$('.box').addClass('animated bounceInLeft');
			}, 1000);
		}
	}, 
	error: function()
	{
		console.log("Oh shucks an error");
		// $('#field').get(0).type = "textwrong";
		// setTimeout(function() { $('#field').get(0).type = "text"; },1000);
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
		var amount = "times";
		if(tagsCount[key] == 1)
		{

			amount = "time";
		}

		$buttonContainer.append('<div class="tagButton" onclick="highlight(\'' + key.toString() + '\')"><div class="tagButtonText">' + key + '</div> <div class="tagButtonText">' + tagsCount[key] + ' ' + amount + '</div></div>');
	}
	$buttonContainer.append("<div class='tagButton empty'></div>")
}

function highlight(tag)
{
	$("#codehere").unhighlight();
	$("#codehere").highlight(["<" + tag + ">", "<" + tag, "</" + tag + ">"]);
}