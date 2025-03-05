$(document).ready(function() 
{

	var objHCJS = new hcJS('#ge-command', '#ge-output', true);
	objHCJS.reset();

	$(window).resize(function() 
	{
		$('body').height($(window).height()-50);
		objHCJS.onResize();
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