<?php

// session variables
$g_strUserKey = "";
$g_strUsername = "";

$g_strCurrentSpace = PUBLIC_SPACENAME;
$g_strCurrentDir = $g_strServerPublicDir;

$g_strUserSpace = "";
$g_strUserDir = "";

$g_strCurrentLanguage = "";

if (isset($_SESSION['server_userkey']))
{
	$g_strUserKey = $_SESSION['server_userkey'];
}

if (isset($_SESSION['server_username']))
{
	$g_strUsername = $_SESSION['server_username'];
}

if (isset($_SESSION['server_currentspace']))
{
	$g_strCurrentSpace = $_SESSION['server_currentspace'];
}

if (isset($_SESSION['server_currentdir']))
{
	$g_strCurrentDir = $_SESSION['server_currentdir'];
}

if (isset($_SESSION['server_userspace']))
{
	$g_strUserSpace = $_SESSION['server_userspace'];
}

if (isset($_SESSION['server_userdir']))
{
	$g_strUserDir = $_SESSION['server_userdir'];
}

if (isset($_SESSION['server_currentdevicekey']))
{
	$g_strCurrentDeviceKey = $_SESSION['server_currentdevicekey'];
}

if (isset($_SESSION['server_currentlanguage']))
{
	$g_strCurrentLanguage = $_SESSION['server_currentlanguage'];
}

if (strlen($g_strCurrentLanguage) == 0)
{
	$g_strCurrentLanguage = "english";
}

$g_strEnvStartupFile = __DIR__ . '/startup.txt';
$g_strEnvHelpIndexFile = $g_strServerHelpDir . $g_strCurrentLanguage . '/index.txt';

// parameters
$g_strIPAddress = "";
$g_strUserAgent = "";
$g_strCommandLine = "";
$g_strF1 = "";
$g_strF2 = "";
$g_strP1 = "";
$g_strP2 = "";
$g_strP3 = "";
$g_strR = "";
$strContent = "";
$blnContinue = false;

if (ISSET($_SERVER['HTTP_USER_AGENT'])) { $g_strUserAgent = $_SERVER['HTTP_USER_AGENT']; }
if (ISSET($_SERVER['REMOTE_ADDR'])) { $g_strIPAddress = $_SERVER['REMOTE_ADDR']; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
	if (ISSET($_POST['commandline'])) { $g_strCommandLine = $_POST['commandline'] . ''; }
	if (ISSET($_POST['f1'])) { $g_strF1 = sanitizeFilename($_POST['f1'] . ''); }
	if (ISSET($_POST['f2'])) { $g_strF2 = sanitizeFilename($_POST['f2'] . ''); }
	if (ISSET($_POST['p1'])) { $g_strP1 = sanitizeParameter($_POST['p1'] . ''); }
	if (ISSET($_POST['p2'])) { $g_strP2 = sanitizeParameter($_POST['p2'] . ''); }
	if (ISSET($_POST['p3'])) { $g_strP3 = sanitizeParameter($_POST['p3'] . ''); }
	if (ISSET($_POST['r'])) { $g_strR = sanitizeParameter($_POST['r'] . ''); }
	if (ISSET($_POST['content'])) { $strContent = $_POST['content']; }
	$blnContinue = true;
}

if (ENABLEGET == 'TRUE')
{
	if ($_SERVER['REQUEST_METHOD'] === 'GET') 
	{
		if (ISSET($_GET['commandline'])) { $g_strCommandLine = $_GET['commandline'] . ''; }
		if (ISSET($_GET['f1'])) { $g_strF1 = sanitizeFilename($_GET['f1'] . ''); }
		if (ISSET($_GET['f2'])) { $g_strF2 = sanitizeFilename($_GET['f2'] . ''); }
		if (ISSET($_GET['p1'])) { $g_strP1 = sanitizeParameter($_GET['p1'] . ''); }
		if (ISSET($_GET['p2'])) { $g_strP2 = sanitizeParameter($_GET['p2'] . ''); }
		if (ISSET($_GET['p3'])) { $g_strP3 = sanitizeParameter($_GET['p3'] . ''); }
		if (ISSET($_GET['r'])) { $g_strR = sanitizeParameter($_GET['r'] . ''); }
		if (ISSET($_GET['content'])) { $strContent = $_GET['content']; }
		$blnContinue = true;
	}
}

?>
