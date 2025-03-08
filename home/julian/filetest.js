api.language(function(objLanguage_a)
{
	api.print('saving:', false, true);
	api.print(objLanguage_a.message);
	api.saveFile('language.txt', objLanguage_a.content, function(objSave_a)
	{
		if (objSave_a.error.length === 0)
		{
			api.print('saved', false, true);
			api.loadFile('language.txt', function(objLoad_a)
			{
				if (objLoad_a.error.length === 0)
				{
					api.print('language is: ' + objLoad_a.content, false, true);
				}
				else
				{
					api.print(objLoad_a.error, false, true);
				}
			});
		}
		else
		{
			api.print(objSave_a.error, false, true);
		}
	});
});