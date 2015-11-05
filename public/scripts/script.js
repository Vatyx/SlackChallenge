var source = "";	//html source code
var tagsCount = {};	//object with tags and their counts

//if enter is pressed while focused on the input field, click the button
$("#field").keyup(function(event){
    if(event.keyCode === 13){
        $("#submit").click();
    }
});

//make the query for the url the user inputed and populate the DOM
//with the source code and buttons to highlight the code
function getSource()
{
	//make the query
	$.ajax({url: "/query", data: {url: $("#field").val()}, success: function(data, status)
	{
		//successful request

		//if the containers haven't been initally opened, open them
		if(!$('.box').hasClass('open'))
		{
			source = data.body;			//get the source code
			$('#precode').text(source);	//insert the source code
			tagsCount = data.count;		//get the tagsCount object
			addButtons();				//insert buttons into the container
			//scroll down for the user
			$('body,html').animate({scrollTop: $('#buttonContainer').position().top +50}, 500);

			//show the containers
			$('.header').addClass('moveup');
			$('.box').addClass('open');
		}
		else
		{	
			//move the containers off the screen
			$('.box').addClass('animated bounceOutRight');
			//get everything after 500 milliseconds
			setTimeout(function()
			{	
				source = data.body;
				$('#precode').text(source);
				tagsCount = data.count;
				addButtons();
				
				//bring the containers back
				$('.box').removeClass('animated bounceOutRight');
				$('.box').addClass('animated bounceInLeft');
				//scroll down for the user
				$('body,html').animate({scrollTop: $('#buttonContainer').position().top +50}, 500);
			}, 700);
		}
	},
	//unsucessful request
	error: function()
	{
		console.log("Oh shucks an error");

		//display the tooltip for 1600 milliseconds
		$('.tooltip').addClass('open');
		setTimeout(function()
		{
			$('.tooltip').removeClass('open');
		}, 1600);
	}});
}

//add buttons to the #buttonContainer element
function addButtons()
{
	//get the DOM element
	$buttonContainer = $('#buttonContainer');
	$buttonContainer.empty(); //get rid of any buttons that were there

	//iterate through the tagsCount object
	var key;
	for(key in tagsCount)
	{	
		//make sure times is grammatically
		var amount = "times";
		if(tagsCount[key] == 1)
		{

			amount = "time";
		}

		//add the button to the container
		$buttonContainer.append('<div class="tagButton" onclick="highlight(\'' + key.toString() + '\')"><div class="tagButtonText">' + key + '</div> <div class="tagButtonText">' + tagsCount[key] + ' ' + amount + '</div></div>');
	}
	//add a filler div to make the alignment correct (hacky, I know)
	$buttonContainer.append("<div class='tagButton empty'></div>")
}

//given a tag name, highlight the correct tags
function highlight(tag)
{
	//get rid of all previous highlights
	$("#codehere").unhighlight();
	//highlight every varation of the tag
	$("#codehere").highlight(["<" + tag + ">", "<" + tag, "</" + tag + ">"]);
}