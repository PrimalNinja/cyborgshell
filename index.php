<?php

session_start();

require_once('inc-env.php');
require_once('inc-constants.php');
require_once('inc-utils.php');
require_once('inc-initialisation.php');

if ((strlen($g_strCurrentLanguage) > 0) && (in_array($g_strCurrentLanguage, $g_arrValidLanguages)))
{
	$strLanguageFile = $g_strServerLanguageDir . 'inc-' . $g_strCurrentLanguage . '.php';
	if (file_exists($strLanguageFile))
	{
		require_once($strLanguageFile);
	}
	else
	{
		die('missing language data');
	}
}
else
{
	die('missing language data');
}

require_once('inc-commands.php');
require_once('inc-routing.php');
require_once('inc-html.php');

?>
