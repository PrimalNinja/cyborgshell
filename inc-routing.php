<?php

if ($blnContinue)
{
	try
	{
		$strCommand = explode(' ', trim($g_strCommandLine))[0];

		// general commands
		switch ($strCommand) 
		{
			case 'startup':
				cmdStartup();
				exit;
		}
		
		// file commands
		switch ($strCommand) 
		{
			case 'beautify':
				cmdBeautify($g_strF1);
				exit;

			case 'cat':
			case 'dir':
			case 'files':
			case 'ls':
				cmdDir($g_strP1);
				exit;

			case 'copy':
			case 'cp':
				cmdCopy($g_strF1, $g_strF2);
				exit;

			case 'del':
			case 'delete':
			case 'era':
				cmdDelete($g_strF1);
				exit;

			case 'help':
				cmdHelp($g_strF1);
				exit;

			case 'load':
				cmdLoad($g_strF1);
				exit;

			case 'mv':
			case 'ren':
			case 'rename':
				cmdRename($g_strF1, $g_strF2);
				exit;

			case 'save':
				cmdSave($g_strF1, $strContent);
				exit;

			case 'cd':
			case 'chdir':
			case 'cs':
			case 'space':
				cmdSpace($g_strF1, $g_strP1);
				exit;

			case 'spaces':
				cmdSpaces();
				exit;

		}
		
		// account commands
		switch ($strCommand) 
		{
			case 'about':
				cmdAbout($g_strP1, $g_strP2, $g_strP3, $g_strR);
				exit;

			case 'admins':
				cmdAdmins($g_strP1);
				exit;

			case 'alias':
				cmdAlias($g_strP1);
				exit;

			case 'chpwd':
			case 'password':
				cmdChPwd($g_strP1, $g_strP2);
				exit;

			case 'device':
				cmdDevice($g_strP1, $g_strP2);
				exit;
			
			case 'devices':
				cmdDevices();
				exit;
			
			case 'login':
				cmdLogin($g_strP1, $g_strP2);
				exit;

			case 'logout':
				cmdLogout();
				exit;

			case 'offline':
				cmdOffline();
				exit;

			case 'online':
				cmdOnline();
				exit;

			case 'register':
				cmdRegister($g_strP1, $g_strP2, $g_strP3);
				exit;

			case 'username':
				cmdUsername($g_strP1);
				exit;

			case 'users':
				cmdUsers($g_strP1);
				exit;

		}

		// sharing commands
		switch ($strCommand) 
		{
			case 'grant':
				cmdGrant($g_strP1);
				exit;

			case 'keys':
				cmdKeys();
				exit;

			case 'newkey':
				cmdNewKey($g_strP1);
				exit;

			case 'revoke':
				cmdRevoke($g_strP1);
				exit;

			case 'shares':
				cmdShares();
				exit;

			case 'validatecookie':
				cmdValidateCookie($g_strP1);
				exit;

		}

		if (strlen($strCommand) > 0)
		{
			$strError = str_replace("%%COMMAND%%", $strCommand, ERR_COMMANDNOTDEFINED);
			echo getResponseJSON("", $strError, "", "");
			exit;
		}
	}
	catch (Exception $e)
	{
		echo getResponseJSON("", ERR_SYSTEMGENERAL, "", "");
		exit;
	}
}

?>
