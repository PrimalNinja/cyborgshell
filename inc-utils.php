<?php

// user file utils

function createHomeDir($strUserKey_a)
{
	global $g_strServerHomeDir;
	
	mkdir($g_strServerHomeDir . $strUserKey_a);
}

function findUserFileByDeviceKey($strDeviceKey_a, $blnActive_a)
{
	return findUserFileByKeySetKey("devicekeys", $strDeviceKey_a, $blnActive_a);
}

function findUserFileByKeySetKey($strKeySet_a, $strKey_a, $blnActive_a)
{
	global $g_strServerUsersDir;
	
	$strResult = "";
	
	$arrFiles = scandir($g_strServerUsersDir);
	$arrFiles = array_diff($arrFiles, array('..', '.'));

	//find the file based on a property value
	foreach ($arrFiles as $strSearchFilename) 
	{
		$strUserFile = $g_strServerUsersDir . basename($strSearchFilename); // Prevent directory traversal
		
		$strJSON = file_get_contents($strUserFile);
		$arrJSON = json_decode($strJSON, true);

		foreach ($arrJSON[$strKeySet_a] as $objKey) 
		{
			$strKey = $objKey["key"];
			$blnActive = $objKey["isactive"];
			
			if ($blnActive_a)
			{
				if (($strKey == $strKey_a) && ($blnActive))
				{
					$strResult = $strSearchFilename;
					break 2;
				}
			}
			else
			{
				if ($strKey == $strKey_a)
				{
					$strResult = $strSearchFilename;
					break 2;
				}
			}
		}
	}
	
	return $strResult;
}

function findUserFileByShareKey($strShareKey_a, $blnActive_a)
{
	return findUserFileByKeySetKey("sharekeys", $strShareKey_a, $blnActive_a);
}

function findUserFileByUserKey($strUserKey_a)
{
	return findUserFileByPropertyValue("userkey", $strUserKey_a);
}

function findUserFileByUsername($strUsername_a)
{
	return findUserFileByPropertyValue("username", $strUsername_a);
}

function findUserFileByPropertyValue($strProperty_a, $strValue_a)
{
	global $g_strServerUsersDir;
	
	$strResult = "";
	
	$arrFiles = scandir($g_strServerUsersDir);
	$arrFiles = array_diff($arrFiles, array('..', '.'));

	//find the file based on a property value
	foreach ($arrFiles as $strSearchFilename) 
	{
		$strUserFile = $g_strServerUsersDir . basename($strSearchFilename); // Prevent directory traversal
		
		$strJSON = file_get_contents($strUserFile);
		$arrJSON = json_decode($strJSON, true);
		
		if ($arrJSON[$strProperty_a] == $strValue_a)
		{
			$strResult = $strSearchFilename;
			break;
		}
	}
	
	return $strResult;
}

function getCurrentUserFile()
{
	global $g_strUserKey;
	
	$strFilename = $g_strUserKey.'.json';

	return getUserFile($strFilename);
}

function getUserFile($strFilename_a)
{
	global $g_strServerUsersDir;
	
	$strUserFile = $g_strServerUsersDir . basename($strFilename_a); // Prevent directory traversal
	
	$strJSON = file_get_contents($strUserFile);
	$arrJSON = json_decode($strJSON, true);
	
	return $arrJSON;
}

function saveCurrentUserFile($arrJSON_a)
{
	global $g_strUserKey;
	
	saveUserFile($g_strUserKey.'.json', $arrJSON_a);
}

function saveUserFile($strUserKey_a, $arrJSON_a)
{
	global $g_strServerUsersDir;
	
	$strUserFile = $g_strServerUsersDir . basename($strUserKey_a); // Prevent directory traversal
	
	$strJSON = json_encode($arrJSON_a);
	
	$strJSON = beautifyJSON($strJSON);
	if (strlen($strJSON) == 0)
	{
		throw new Exception(ERR_SYSTEMJSON);
	}
	
	file_put_contents($strUserFile, $strJSON);
}

// security utils

function invalidateServer()
{
	global $g_strServerPublicDir;
	
	global $g_strUserKey;
	global $g_strUsername;
	
	global $g_strUserSpace;
	global $g_strUserDir;
	
	global $g_strCurrentSpace;
	global $g_strCurrentDir;
	
	$g_strUserKey = "";
	$g_strUsername = "";
	
	$g_strUserSpace = "";
	$g_strUserDir = "";

	$g_strCurrentSpace = PUBLIC_SPACENAME;
	$g_strCurrentDir = $g_strServerPublicDir;
	
	$_SESSION['server_userkey'] = $g_strUserKey;
	$_SESSION['server_username'] = $g_strUsername;

	$_SESSION['server_userspace'] = $g_strUserSpace;
	$_SESSION['server_userdir'] = $g_strUserDir;

	$_SESSION['server_currentspace'] = $g_strCurrentSpace;
	$_SESSION['server_currentdir'] = $g_strCurrentDir;
}

function sanitizeFilename($strFilename_a) 
{
	$strResult = $strFilename_a;
	
    // Remove any directory traversal characters
    $strResult = str_replace(array('../', './', '/'), '', $strResult);

    // Remove any special characters that are not allowed in filenames
    $strResult = preg_replace('/[<>:"\/\\|?*]/', '', $strResult);

    // Remove any leading or trailing whitespace
    $strResult = trim($strResult);

    return $strResult;
}

function sanitizeParameter($strParam_a)
{
	return $strParam_a;
}

function validLogin()
{
	global $g_strUserKey;
	
	return (strlen($g_strUserKey) > 0);
}

function validCurrentUser()
{
	global $g_strUserKey;

	return validUser($g_strUserKey);
}

function validUser($strUserKey_a)
{
	global $g_strServerUsersDir;
	
	$strFilename = $strUserKey_a.'.json';
	$strUserFile = $g_strServerUsersDir . basename($strFilename); // Prevent directory traversal
	
	return (file_exists($strUserFile));
}

// other utils

function beautifyJSON($strJSON_a)
{
	$strResult = $strJSON_a;
	
	if ($arrJSON = json_decode($strResult, true))
	{
		if ($strResult = json_encode($arrJSON, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))
		{
			$strResult = str_replace("    ", "\t", $strResult);
			$strResult = str_replace("\n", "\r\n", $strResult);
		}
	}
	
	return $strResult;
}

function getBrowser($strAgent_a)
{
	$strResult = "";
	
	//$arrBrowser = get_browser($strAgent_a);
	//$strResult = $arrBrowser["parent"] . " " . $arrBrowser["version"] . " " . $arrBrowser["platform"];
	
	$strResult = $strAgent_a;
	
	return $strResult;
}

function getResponseJSON($strMessage_a, $strError_a, $strAction_a, $strContent_a)
{
	if ($strAction_a == ACTION_INVALIDATE)
	{
		invalidateServer();
	}
	
	$arrResponse = array(
		"message" => $strMessage_a,
		"error" => $strError_a,
		"action" => $strAction_a,
		"content" => $strContent_a
	);

	return json_encode($arrResponse);
}

function getGuid()
{
    return str_replace('.', '-', uniqid('', true));
}

?>
