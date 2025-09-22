$(document).ready(function() 
{
	var objCS = new cyborgShell('#ge-clicontainer', '#ge-clicommand', '#ge-clioutput', true);
	objCS.reset();

	$(window).resize(function() 
	{
		objCS.onResize();
	});

	// Also trigger the event on page load
	$(window).trigger('resize');

	document.addEventListener('mouseup', function() 
	{
		var selection = window.getSelection();
		var text = selection.toString();
		if (text !== '') 
		{
			navigator.clipboard.writeText(text);
		}
	});
});