<?php

// user file utils

function canAliasSpace($strSpaceKey_a)
{
	return (($strSpaceKey_a == HOME_SPACENAME) || ($strSpaceKey_a == DEMO_SPACENAME) || ($strSpaceKey_a == PUBLIC_SPACENAME));
}

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
	
	$strUserKey = $g_strUserKey;
	
	if (strlen($strUserKey) == 0)
	{
		$strUserKey = PUBLIC_USERKEY;
	}
	
	$strFilename = $strUserKey.'.json';

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

function hasBlockedWords($str_a)
{
	global $g_strServerSystemDir;
	
	$strBlockedWordsFile = $g_strServerSystemDir . "blockedwords.txt";
	return matchesPatternFile($strBlockedWordsFile, $str_a);
}

function isRTLLanguage()
{
	global $g_arrRTLLanguages;
	global $g_strCurrentLanguage;
	
	$blnResult = false;
	
	if (in_array($g_strCurrentLanguage, $g_arrRTLLanguages))
	{
		$blnResult = true;
	}
	
	return $blnResult;
}

function matchesPatternFile($strFilename_a, $str_a)
{
	$blnResult = false;
	$arrPatterns = [];
	
	if (file_exists($strFilename_a)) 
	{
		$arrPatterns = explode("\n", file_get_contents($strFilename_a));
	}
	
	foreach ($arrPatterns as $strPattern)
	{
		if ((trim($strPattern) !== '') && (preg_match('/' . $strPattern . '/i', $str_a)))
		{
			$blnResult = true;
			break;
		}
	}
	
	return $blnResult;
}

function saveCurrentUserFile($arrJSON_a)
{
	global $g_strUserKey;
	
	if (strlen($g_strUserKey) > 0)
	{
		saveUserFile($g_strUserKey.'.json', $arrJSON_a);
	}
}

function saveUserFile($strUserKey_a, $arrJSON_a)
{
	global $g_strServerUsersDir;
	
	if (strlen($strUserKey_a) > 0)
	{
		$strUserFile = $g_strServerUsersDir . basename($strUserKey_a); // Prevent directory traversal
		
		$strJSON = json_encode($arrJSON_a);
		
		$strJSON = beautifyJSON($strJSON);
		if (strlen($strJSON) == 0)
		{
			throw new Exception(ERR_SYSTEMJSON);
		}
		
		file_put_contents($strUserFile, $strJSON);
	}
}

// security utils

function inDemoAreaNoWriteAccess()
{
	global $g_strCurrentDir;
	global $g_strCurrentSpace;
	
	return ((($g_strCurrentSpace == DEMO_SPACENAME) || ($g_strCurrentDir == DEMO_DIRNAME)) && !validLogin());
}


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
	
	$g_strCurrentLanguage = "english";
	
	$_SESSION['server_userkey'] = $g_strUserKey;
	$_SESSION['server_username'] = $g_strUsername;

	$_SESSION['server_userspace'] = $g_strUserSpace;
	$_SESSION['server_userdir'] = $g_strUserDir;

	$_SESSION['server_currentspace'] = $g_strCurrentSpace;
	$_SESSION['server_currentdir'] = $g_strCurrentDir;
	
	$_SESSION['server_currentlanguage'] = $g_strCurrentLanguage;
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
	
	$blnResult = false;
	
	if (strlen($strUserKey_a) > 0)
	{
		$strFilename = $strUserKey_a.'.json';
		$strUserFile = $g_strServerUsersDir . basename($strFilename); // Prevent directory traversal
		$blnResult = file_exists($strUserFile);
	}
	
	return $blnResult;
}

// other utils

function arrayFindByKey($arrData_a, $strArrayKey_a, $strSearchKey_a)
{
	$intResult = -1;
	
    foreach ($arrData_a as $intIndex => $objItem)
    {
        if (isset($objItem[$strArrayKey_a]) && $objItem[$strArrayKey_a] == $strSearchKey_a)
        {
            $intResult = $intIndex;
			break;
        }
    }
    return $intResult;
}

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

function getResponseJSON($strMessage_a, $strError_a, $arrActions_a, $strContent_a)
{
	if (in_array(ACTION_INVALIDATE, $arrActions_a))
	{
		invalidateServer();
	}
	
	$strMessage = $strMessage_a;
	$strError = $strError_a;
	$strMessage = str_replace("<", "&#x2329;", $strMessage);
	$strMessage = str_replace(">", "&#x232A;", $strMessage);
	$strError = str_replace("<", "&#x2329;", $strError);
	$strError = str_replace(">", "&#x232A;", $strError);
	
	$blnIsRTLLanguage = isRTLLanguage();
	
	$arrResponse = array(
		"message" => $strMessage,
		"error" => $strError,
		"actions" => $arrActions_a,
		"content" => $strContent_a,
		"rtllanguage" => $blnIsRTLLanguage
	);

	return json_encode($arrResponse);
}

function getGuid()
{
    return str_replace('.', '-', uniqid('', true));
}

function rtlReverse($str_a)
{
	$strResult = $str_a;
	if (isRTLLanguage())
	{
		$strResult = strrev($strResult);
	}
	return $strResult;
}

?>
