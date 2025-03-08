var objTabHandler = api.getTabHandler();
var objTabWindow = null;

if (objTabHandler.canCreateTab())
{
	objTabWindow = objTabHandler.createTab("childtab.php", "", "");
	//objTabWindow.document.write('blah');
	objTabWindow.document.title = 'blah';
}
