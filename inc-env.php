<?php

//?commandline=grant&p1=67c48dfb112f78-85899685
define("ENABLEGET", "FALSE");	// useful for debugging
define("RELEASEDIRSUFFIX", "");	// e.g. the JS folder should be renamed with this suffix to prevent cashing issues when deploying updates
define("MINIFIED", "FALSE");	// can be TRUE or FALSE, to use the minified versions vs the unminified

// environment constants
define("APPNAME", "Open Home Computer JS");
define("VERSION", "v1.0 RC7");
define("BUILD", "Build 20250308");
define("AUTHOR", "By PrimalNinja 2025");
define("PASSWORDMINIMUMLENGTH", 8);

define("JSONVERSION", 1);		// the current user file JSON version

define("SYSTEM_DIRNAME", "system");		// system files go in here
define("LANGUAGE_DIRNAME", "languages");// langauge files go in here
define("HELP_DIRNAME", "help");			// help files go in here
define("USERS_DIRNAME", "users");		// this is where user data is stored
define("PUBLIC_DIRNAME", "public");		// this is the public home dir
define("HOME_DIRNAME", "home");			// user home dirs are below here

define("HOME_SPACENAME", "home");		// this is the name of the public space
define("PUBLIC_SPACENAME", "public");	// this is the name of the public space

$g_strMinifiedSuffix = "";
if (MINIFIED == "TRUE")
{
	$g_strMinifiedSuffix = ".min";
}

//$strDataRoot = '/home/blah/hcjs';	// server deploy
$strDataRoot = __DIR__;					// dev 

error_reporting(0);
error_reporting(E_ALL);	// enable for debug

$g_arrValidLanguages = ["arabic", "chinese", "chineset", "czech", "dutch", "english", "french", "german", "greek", 
						"hebrew", "hindi", "italian", "japanese", "javanese", "klingon", "korean", "persian", "polish", 
						"portuguese", "romanian", "russian", "spanish", "swahili", "swedish", "tagalog", "thai", 
						"turkish", "vietnamese"];
$g_arrRTLLanguages = ["arabic", "hebrew", "persian"];

// ensure directories exist

$g_strServerSystemDir = $strDataRoot . '/' . SYSTEM_DIRNAME . '/';
$g_strServerLanguageDir = $strDataRoot . '/' . LANGUAGE_DIRNAME . '/';
$g_strServerHelpDir = $strDataRoot . '/' . HELP_DIRNAME . '/';
$g_strServerUsersDir = $strDataRoot . '/' . USERS_DIRNAME . '/';
$g_strServerPublicDir = $strDataRoot . '/' . PUBLIC_DIRNAME . '/';
$g_strServerHomeDir = $strDataRoot . '/' . HOME_DIRNAME . '/';

// Ensure the system directory exists
if (!is_dir($g_strServerSystemDir)) 
{
    mkdir($g_strServerSystemDir);
}

// Ensure the language directory exists
if (!is_dir($g_strServerLanguageDir)) 
{
    mkdir($g_strServerLanguageDir);
}

// Ensure the help directory exists
if (!is_dir($g_strServerHelpDir)) 
{
    mkdir($g_strServerHelpDir);
}

// Ensure the users directory exists
if (!is_dir($g_strServerUsersDir)) 
{
    mkdir($g_strServerUsersDir);
}

// Ensure the public directory exists
if (!is_dir($g_strServerPublicDir)) 
{
    mkdir($g_strServerPublicDir);
}

// Ensure the home directory exists
if (!is_dir($g_strServerHomeDir)) 
{
    mkdir($g_strServerHomeDir);
}

?>
