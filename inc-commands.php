<?php

// general commands

function cmdLanguage($strLanguage_a)
{
	global $arrValidLanguages;
	global $g_strCurrentLanguage;

	if ((strlen($strLanguage_a) > 0) && (in_array($strLanguage_a, $arrValidLanguages)))
	{
		$g_strCurrentLanguage = $strLanguage_a;
		$_SESSION['server_currentlanguage'] = $g_strCurrentLanguage;
		echo getResponseJSON($g_strCurrentLanguage, "", "", "");
	}
	else
	{
		echo getResponseJSON($g_strCurrentLanguage, "", "", "");
	}
}

function cmdLanguages()
{
	global $arrValidLanguages;

	$strMessage = implode(', ', $arrValidLanguages);
	echo getResponseJSON($strMessage, "", "", "");
}

function cmdStartup()
{
	global $g_strEnvStartupFile;
	
	if (file_exists($g_strEnvStartupFile)) 
	{
		$strMessage = file_get_contents($g_strEnvStartupFile);
		echo getResponseJSON($strMessage, "", "", "");
	} 
	else 
	{
		echo getResponseJSON("", "", "", ""); // ok for no output here
	}
}

// file commands

function cmdBeautify($strFilename_a)
{
	global $g_strCurrentDir;

	if (strlen($strFilename_a) == 0)
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFile = $g_strCurrentDir . basename($strFilename_a); // Prevent directory traversal

		if (!file_exists($strFile)) 
		{
			echo getResponseJSON("", ERR_FILENOTEXISTS, "", "");
		}
		else
		{
			$strContent = file_get_contents($strFile);

			$strContent = beautifyJSON($strContent);
			
			if (strlen($strContent) == 0)
			{
				echo getResponseJSON("", ERR_JSONINVALID, "", "");
			}
			else
			{
				file_put_contents($strFile, $strContent);
				echo getResponseJSON(MSG_FILEBEAUTIFIED, "", "", "");
			}
		} 
	}
}

function cmdDir($strPattern_a)
{
	global $g_strCurrentDir;
	global $g_strCurrentSpace;
	
	$arrFileList = array();
	$strFileList = "";
	
	$arrFiles = scandir($g_strCurrentDir);
	$arrFiles = array_diff($arrFiles, array('..', '.'));

	//get the longest filename length
	$intLongest = 0;

	foreach ($arrFiles as $strFilename) 
	{
		$blnDisplay = false;
		
		if (strlen($strPattern_a) == 0)
		{
			$blnDisplay = true;
		}
		else
		{
			if (fnmatch(strtoupper($strPattern_a), strtoupper($strFilename)))
			{
				$blnDisplay = true;
			}
		}
			
		if ($blnDisplay)
		{
			$intFilenameLength = strlen($strFilename);
			if ($intFilenameLength > $intLongest)
			{
				$intLongest = $intFilenameLength;
			}
			
			$strFilesize = filesize($g_strCurrentDir . '/' . $strFilename);

			$arrFileList[] = array( 
					"filename" => $strFilename,
					"filesize" => $strFilesize);
		}
	}
	
	// get the filenames padded out to the longest filename length before adding the filesize
	foreach ($arrFileList as $objFile) 
	{
		if (strlen($strFileList) > 0)
		{
			$strFileList .= "\n";
		}
		
		$strFilename = str_pad($objFile["filename"], $intLongest, ' ', STR_PAD_RIGHT);
		$strFilesize = $objFile["filesize"];
		
		$strFileList .= $strFilename . ' ' . $strFilesize . ' bytes';
	}
	
	if (strlen($strFileList) == 0)
	{
		echo getResponseJSON(MSG_NOFILESFOUND, "", "", "");
	}
	else
	{
		$strMessage = MSG_DIRECTORYOF . $g_strCurrentSpace . ":\n\n" . $strFileList . "\n";
		echo getResponseJSON($strMessage, "", "", "");
	}
}

function cmdCopy($strFilenameFrom_a, $strFilenameTo_a)
{
	global $g_strCurrentDir;

	if ((strlen($strFilenameFrom_a) == 0) || (strlen($strFilenameTo_a) == 0))
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFileFrom = $g_strCurrentDir . basename($strFilenameFrom_a); // Prevent directory traversal
		$strFileTo = $g_strCurrentDir . basename($strFilenameTo_a); // Prevent directory traversal

		if (!file_exists($strFileFrom)) 
		{
			echo getResponseJSON("", ERR_FILENOTEXISTS_SOURCE, "", "");
		}
		else
		{
			if (file_exists($strFileTo)) 
			{
				echo getResponseJSON("", ERR_FILEEXISTS_DESTINATION, "", "");
			}
			else
			{
				copy($strFileFrom, $strFileTo);
				echo getResponseJSON(MSG_FILECOPIED, "", "", "");
			}
		}
	}
}

function cmdDelete($strFilename_a)
{
	global $g_strCurrentDir;

	if (strlen($strFilename_a) == 0)
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFile = $g_strCurrentDir . basename($strFilename_a); // Prevent directory traversal

		if (!file_exists($strFile)) 
		{
			echo getResponseJSON("", ERR_FILENOTEXISTS, "", "");
		}
		else
		{
			if (file_exists($strFile)) 
			{
				unlink($strFile);
			}
			
			echo getResponseJSON(MSG_FILEDELETED, "", "", "");
		}
	}
}

function cmdHelp($strTopic_a)
{
	global $g_strCurrentLanguage;
	global $g_strServerHelpDir;
	global $g_strEnvHelpIndexFile;
	
	$strHelpFile = "";
	if (strlen($strTopic_a) == 0)
	{
		$strHelpFile = $g_strEnvHelpIndexFile;
	}
	else
	{
		$strHelpFile = $g_strServerHelpDir . $g_strCurrentLanguage . '/' . $strTopic_a . ".txt";
	}
	
	if (file_exists($strHelpFile)) 
	{
		$strMessage = file_get_contents($strHelpFile);
		echo getResponseJSON($strMessage, "", "", "");
	} 
	else 
	{
		echo getResponseJSON("", ERR_FILENOTEXISTS_HELP, "", "");
	}
}

function cmdLoad($strFilename_a)
{
	global $g_strCurrentDir;

	if (strlen($strFilename_a) == 0)
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFile = $g_strCurrentDir . basename($strFilename_a); // Prevent directory traversal

		if (file_exists($strFile)) 
		{
			$strContent = file_get_contents($strFile);
			echo getResponseJSON("", "", "", $strContent);
		} 
		else 
		{
			if (!file_exists($strFile.".js")) 
			{
				echo getResponseJSON("", ERR_FILENOTEXISTS, "", "");
			}
			else
			{
				$strContent = file_get_contents($strFile.".js");
				echo getResponseJSON("", "", "", $strContent);
			} 
		}
	}
}

function cmdRename($strOldName_a, $strNewName_a)
{
	global $g_strCurrentDir;

	if ((strlen($strOldName_a) == 0) || (strlen($strNewName_a) == 0))
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFileOld = $g_strCurrentDir . basename($strOldName_a); // Prevent directory traversal
		$strFileNew = $g_strCurrentDir . basename($strNewName_a); // Prevent directory traversal

		if (!file_exists($strFileOld)) 
		{
			echo getResponseJSON("", ERR_FILENOTEXISTS_SOURCE, "", "");
		}
		else
		{
			if (file_exists($strFileNew)) 
			{
				echo getResponseJSON("", ERR_FILEEXISTS_DESTINATION, "", "");
			}
			else
			{
				rename($strFileOld, $strFileNew);
				echo getResponseJSON(MSG_FILERENAMED, "", "", "");
			}
		}
	}
}

function cmdSave($strFilename_a, $strContent_a)
{
	global $g_strCurrentDir;

	if (strlen($strFilename_a) == 0)
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFile = $g_strCurrentDir . basename($strFilename_a); // Prevent directory traversal

		if (file_exists($strFile)) 
		{
			unlink($strFile);
		}
		
		file_put_contents($strFile, $strContent_a);
		echo getResponseJSON(MSG_FILESAVED, "", "", "");
	}
}

function cmdSpace($strSpaceKey_a, $strAlias_a)
{
	global $g_strServerHomeDir;
	global $g_strServerPublicDir;
	global $g_strCurrentSpace;
	global $g_strCurrentDir;

	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			if (strlen($strSpaceKey_a) == 0)
			{
				echo getResponseJSON($g_strCurrentSpace, "", "", "");
			}
			else if ((strlen($strSpaceKey_a) > 0) && (strlen($strAlias_a) > 0))
			{
				// change alias
				$arrJSON = getCurrentUserFile();
				
				$blnFound = false;
				foreach ($arrJSON["spaces"] as &$objSpace)
				{
					$blnActive = $objSpace["isactive"];
					$strKey = $objSpace["key"];
					$strAlias = $objSpace["alias"];
					if (($blnActive) && (strlen($strAlias) > 0))
					{
						if (($strKey == $strSpaceKey_a) || ($strAlias == $strSpaceKey_a))
						{
							$objSpace["alias"] = $strAlias_a;
							$blnFound = true;
							break;
						}
					}
				}

				if (!$blnFound)
				{
					echo getResponseJSON("", ERR_SPACEKEYINVALID, "", "");
				}
				else
				{
					saveCurrentUserFile($arrJSON);

					$strMessage = str_replace("%%ALIAS%%", $strAlias_a, MSG_ALIASISNOW);
					echo getResponseJSON($strMessage, "", "", "");
				}
			}
			else if ($strSpaceKey_a == HOME_SPACENAME)
			{
				// change to home space
				$g_strCurrentSpace = $_SESSION['server_userspace'];
				$g_strCurrentDir = $_SESSION['server_userdir'];

				$_SESSION['server_currentspace'] = $g_strCurrentSpace;
				$_SESSION['server_currentdir'] = $g_strCurrentDir;

				$strMessage = str_replace("%%SPACENAME%%", HOME_SPACENAME, MSG_SPACENAMEISNOW);
				echo getResponseJSON($strMessage, "", "", "");
			}
			else if ($strSpaceKey_a == PUBLIC_SPACENAME)
			{
				// change to public space
				$g_strCurrentSpace = PUBLIC_SPACENAME;
				$g_strCurrentDir = $g_strServerPublicDir;

				$_SESSION['server_currentspace'] = $g_strCurrentSpace;
				$_SESSION['server_currentdir'] = $g_strCurrentDir;

				$strMessage = str_replace("%%SPACENAME%%", PUBLIC_SPACENAME, MSG_SPACENAMEISNOW);
				echo getResponseJSON($strMessage, "", "", "");
			}
			else
			{
				// change to named space
				$arrJSON = getCurrentUserFile();

				$strFoundSpaceAlias = "";
				$strFoundSpacekey = "";
				
				$blnFound = false;
				foreach ($arrJSON["spaces"] as $objSpace)
				{
					$blnActive = $objSpace["isactive"];
					$strKey = $objSpace["key"];
					$strAlias = $objSpace["alias"];
					if (($blnActive) && (strlen($strAlias) > 0))
					{
						if (($strKey == $strSpaceKey_a) || ($strAlias == $strSpaceKey_a))
						{
							$strFoundSpacekey = $strKey;
							$strFoundSpaceAlias = $strAlias;
							$blnFound = true;
							break;
						}
					}
				}

				if (!$blnFound)
				{
					echo getResponseJSON("", ERR_SPACEKEYINVALID, "", "");
				}
				else
				{
					$g_strCurrentSpace = $strFoundSpaceAlias;
					$g_strCurrentDir = $g_strServerHomeDir . $strFoundSpacekey . '/';

					$_SESSION['server_currentspace'] = $g_strCurrentSpace;
					$_SESSION['server_currentdir'] = $g_strCurrentDir;

					$strMessage = str_replace("%%SPACENAME%%", $strFoundSpaceAlias, MSG_SPACENAMEISNOW);
					echo getResponseJSON($strMessage, "", "", "");
				}
			}
		}
	}
}

function cmdSpaces()
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();

			$strMessage = "";
			if (count($arrJSON["spaces"]) == 0)
			{
				$strMessage = MSG_SPACESNONE;
			}
			else
			{
				//get the longest key length
				$intLongest = 0;
				foreach ($arrJSON["spaces"] as $objSpace) 
				{
					$blnActive = $objSpace["isactive"];
					if ($blnActive)
					{
						$intKeyLength = strlen($objSpace["key"]);
						if ($intKeyLength > $intLongest)
						{
							$intLongest = $intKeyLength;
						}
					}
				}

				foreach ($arrJSON["spaces"] as $objSpace) 
				{
					$blnActive = $objSpace["isactive"];
					if ($blnActive)
					{
						$strSpaceKey = str_pad($objSpace["key"], $intLongest, ' ', STR_PAD_RIGHT);
						
						if (strlen($strMessage) > 0)
						{
							$strMessage .= "\n";
						}
						$strMessage .= $strSpaceKey . " " . $objSpace["alias"];
					}
				}
				$strMessage = MSG_SPACES . "\n" . $strMessage;
			}
			
			echo getResponseJSON($strMessage, "", "", "");
		}
	}
}

// account commands

function cmdAbout($strP1_a, $strP2_a, $strP3_a, $strR_a)
{
	$arrAbout = array($strP1_a, $strP2_a, $strP3_a, $strR_a);
	$strAbout = trim(implode(" ", $arrAbout));
	
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();
			
			if (strlen($strAbout) == 0)
			{
				$strAbout = $arrJSON["about"];
				echo getResponseJSON($strAbout, "", "", "");
			}
			else
			{
				$arrJSON["about"] = $strAbout;
				
				saveCurrentUserFile($arrJSON);
				
				echo getResponseJSON(MSG_ABOUTUPDATED, "", "", "");
			}
		}
	}
}

function cmdAdmins($strPattern_a)
{
	global $g_strServerUsersDir;
	
	$arrUserList = array();
	$strUserList = "";
	
	$arrFiles = scandir($g_strServerUsersDir);
	$arrFiles = array_diff($arrFiles, array('..', '.'));

	$intLongest = 0;

	//find the file based on a property value
	foreach ($arrFiles as $strSearchFilename) 
	{
		$strUserFile = $g_strServerUsersDir . basename($strSearchFilename); // Prevent directory traversal
		
		$strJSON = file_get_contents($strUserFile);
		$arrJSON = json_decode($strJSON, true);

		$blnActive = $arrJSON["isactive"];
		$blnSysAdmin = $arrJSON["issysadmin"];

		$strAlias = $arrJSON["alias"];
		$strAbout = $arrJSON["about"];
		$blnAdmin = $arrJSON["isadmin"];
		$blnOnline = $arrJSON["isonline"];
		
		$blnDisplay = false;
		if (($blnActive) && $blnAdmin)
		{
			if (strlen($strPattern_a) == 0)
			{
				$blnDisplay = true;
			}
			else
			{
				if (fnmatch(strtoupper($strPattern_a), strtoupper($strAlias)))
				{
					$blnDisplay = true;
				}
			}
		}
		
		if ($blnDisplay)
		{
			$intAliasLength = strlen($strAlias);
			if ($intAliasLength > $intLongest)
			{
				$intLongest = $intAliasLength;
			}

			$arrUserList[] = array( 
					"alias" => $strAlias, 
					"about" => $strAbout, 
					"isadmin" => $blnAdmin, 
					"isonline" => $blnOnline);
		}
	}
	
	foreach ($arrUserList as $objUser) 
	{
		if (strlen($strUserList) > 0)
		{
			$strUserList .= "\n";
		}
		
		$strAlias = str_pad($objUser["alias"], $intLongest, ' ', STR_PAD_RIGHT);
		
		$strAdmin = "     ";
		if ($objUser["isadmin"])
		{
			$strAdmin = "admin";
		}
		
		$strOnline = "offline";
		if ($objUser["isonline"])
		{
			$strOnline = "online ";
		}
		
		$strAbout = $objUser["about"];
		
		$strUserList .= $strAlias . " " . $strOnline . " " . $strAbout;
	}
	
	if (strlen($strUserList) == 0)
	{
		echo getResponseJSON(MSG_NOUSERSFOUND, "", "", "");
	}
	else
	{
		$strMessage = MSG_LISTOFADMINS . "\n\n" . $strUserList . "\n";
		echo getResponseJSON($strMessage, "", "", "");
	}
}

function cmdAlias($strAlias_a)
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();

			if (strlen($strAlias_a) == 0)
			{
				$strMessage = $arrJSON["alias"];
				echo getResponseJSON($strMessage, "", "", "");
			}
			else
			{
				$arrJSON["alias"] = $strAlias_a;

				saveCurrentUserFile($arrJSON);
				
				$strMessage = str_replace("%%ALIAS%%", $strAlias_a, MSG_ALIASISNOW);
				echo getResponseJSON($strMessage, "", "", "");
			}
		}
	}
}

function cmdChPwd($strOldPassword_a, $strNewPassword_a)
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			if ((strlen($strOldPassword_a) == 0) || (strlen($strNewPassword_a) == 0))
			{
				echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
			}
			else
			{
				$arrJSON = getCurrentUserFile();
				
				if (!password_verify($strOldPassword_a, $arrJSON["password"]))
				{
					echo getResponseJSON("", ERR_PASSWORDINVALIDPREVIOUS, "", "");
				}
				else
				{
					if (strlen($strNewPassword_a) < PASSWORDMINIMUMLENGTH)
					{
						echo getResponseJSON("", ERR_PASSWORDINVALIDNEW, "", "");
					}
					else
					{
						$arrJSON["password"] = password_hash($strNewPassword_a, PASSWORD_DEFAULT);
						
						saveCurrentUserFile($arrJSON);
						
						echo getResponseJSON(MSG_PASSWORDCHANGED, "", "", "");
					}
				}
			}
		}
	}
}

function cmdDevice($strDeviceKey_a, $strAlias_a)
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			if ((strlen($strDeviceKey_a) == 0) || (strlen($strAlias_a) == 0))
			{
				echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
			}
			else
			{
				$arrJSON = getCurrentUserFile();
				
				$blnFound = false;
				foreach ($arrJSON["devicekeys"] as &$objDeviceKey)
				{
					$strKey = $objDeviceKey["key"];
					if ($strKey == $strDeviceKey_a)
					{
						$objDeviceKey["alias"] = $strAlias_a;
						$blnFound = true;
						break;
					}
				}
				
				if (!$blnFound)
				{
					echo getResponseJSON("", ERR_DEVICEKEYINVALID, "", "");
				}
				else
				{
					saveCurrentUserFile($arrJSON);

					$strMessage = str_replace("%%ALIAS%%", $strAlias_a, MSG_ALIASISNOW);
					echo getResponseJSON($strMessage, "", "", "");
				}
			}
		}
	}
}

function cmdDevices()
{
	global $g_strCurrentDeviceKey;
	
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();

			$strDeviceKeys = "";
			if (count($arrJSON["devicekeys"]) == 0)
			{
				$strDeviceKeys = MSG_DEVICEKEYSNONE;
			}
			else
			{
				// device keys
				// get the longest key length
				$intLongest = 0;
				foreach ($arrJSON["devicekeys"] as $objDeviceKey) 
				{
					$blnActive = $objDeviceKey["key"];
					$intKeyLength = strlen($objDeviceKey["key"]);
					if ($blnActive)
					{
						if ($intKeyLength > $intLongest)
						{
							$intLongest = $intKeyLength;
						}
					}
				}

				foreach ($arrJSON["devicekeys"] as $objDeviceKey) 
				{
					$blnActive = $objDeviceKey["key"];
					if ($blnActive)
					{
						$strDeviceKey = str_pad($objDeviceKey["key"], $intLongest, ' ', STR_PAD_RIGHT);
		
						$strCurrent = " ";
						if ($objDeviceKey["key"] == $g_strCurrentDeviceKey) { $strCurrent = "*"; }

						$strDeviceKeys .= "\n";
						$strDeviceKeys .= $strCurrent . " " . $strDeviceKey . " " . $objDeviceKey["alias"] . "\n";
						$strDeviceKeys .= "  Last access: " . $objDeviceKey["datetime"] . "\n";
						$strDeviceKeys .= "  " . getBrowser($objDeviceKey["agent"]) . "\n";
						$strDeviceKeys .= "  " . $objDeviceKey["ipaddress"] . "\n";
					}
				}
				$strDeviceKeys = MSG_DEVICEKEYS . $strDeviceKeys;
			}

			$strMessage = $strDeviceKeys . "\n\n* " . MSG_CURRENTDEVICE;
			echo getResponseJSON($strMessage, "", "", "");
		}
	}
}

function cmdLogin($strUsername_a, $strPassword_a)
{
	global $g_strUserAgent;
	global $g_strIPAddress;
	
	if ((strlen($strUsername_a) == 0) || (strlen($strPassword_a) == 0))
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strFoundUserFilename = findUserFileByUsername($strUsername_a);
		if (strlen($strFoundUserFilename) == 0)
		{
			echo getResponseJSON("", ERR_LOGININVALID, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getUserFile($strFoundUserFilename);
			
			if (!password_verify($strPassword_a, $arrJSON["password"]))
			{
				echo getResponseJSON("", ERR_LOGININVALID, ACTION_INVALIDATE, "");
			}
			else
			{
				$strDateTime = date("Y-m-d H:i:s");
				
				$strDeviceKey = getGUID();
				$arrJSON["devicekeys"][] = array( 
					"key" => $strDeviceKey, 
					"datetime" => $strDateTime,
					"alias" => $strDeviceKey,
					"agent" => $g_strUserAgent,
					"ipaddress" => $g_strIPAddress,
					"isactive" => true);
					
				saveUserFile($strFoundUserFilename, $arrJSON);
				
				$arrResponse = array(
					"message" => "",
					"error" => "",
					"action" => "",
					"username" => $arrJSON["username"],
					"devicekey" => $strDeviceKey
				);

				$strJSONResponse = json_encode($arrResponse);
				echo $strJSONResponse;
			}
		}
	}
}

function cmdLogout()
{
	echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
}

function cmdOffline()
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();
			
			$arrJSON["isonline"] = false;
			
			saveCurrentUserFile($arrJSON);
			
			echo getResponseJSON(MSG_OFFLINE, "", "", "");
		}
	}
}

function cmdOnline()
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();
			
			$arrJSON["isonline"] = true;
			
			saveCurrentUserFile($arrJSON);
			
			echo getResponseJSON(MSG_ONLINE, "", "", "");
		}
	}
}

function cmdRegister($strUsername_a, $strPassword_a, $strAlias_a)
{
	global $g_strServerUsersDir;

	if ((strlen($strUsername_a) == 0) || (strlen($strPassword_a) == 0))
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		$strUsername = $strUsername_a;
		$strPassword = $strPassword_a;
		$strAlias = $strAlias_a;

		if (strlen($strUsername) == 0)	// login
		{
			$strUsername = getGUID();
		}
		
		if (strlen($strPassword) == 0)	// password
		{
			$strPassword = getGUID();
		}
		
		if (strlen($strAlias) == 0)	// alias
		{
			$strAlias = $strUsername;
		}
		
		$strFoundUserFilename = findUserFileByUsername($strUsername);
		if (strlen($strFoundUserFilename) > 0)
		{
			echo getResponseJSON("", ERR_USERNAMEUNAVAILABLE, "", "");
		}
		else
		{
			$strUserKey = getGUID();
	
			$strFilename = $strUserKey.'.json';
			$strUserFile = $g_strServerUsersDir . basename($strFilename); // Prevent directory traversal

			if (file_exists($strUserFile)) 
			{
				echo getResponseJSON("", ERR_REGISTRATION, "", "");
			}
			else
			{
				$strDateTime = date("Y-m-d H:i:s");
				$arrDefaultSpaces = array();
				$arrDefaultSpaces[] = array( "key" => HOME_SPACENAME, "alias" => "", "datetime" => $strDateTime, "isactive" => true );
				$arrDefaultSpaces[] = array( "key" => PUBLIC_SPACENAME, "alias" => "", "datetime" => $strDateTime, "isactive" => true );
				
				$arrJSON = array(
					"jsonversion" => JSONVERSION,
					"username" => $strUsername,
					"password" => password_hash($strPassword, PASSWORD_DEFAULT),
					"alias" => $strAlias,
					"emailaddress" => "",
					"about" => "",
					"datetime" => $strDateTime,
					"issysadmin" => false,
					"isadmin" => false,
					"isactive" => true,
					"isonline" => false,
					"userkey" => $strUserKey,
					"devicekeys" => array(),
					"sharekeys" => array(),
					"shares" => array(),
					"spaces" => $arrDefaultSpaces
				);

				createHomeDir($strUserKey);
				saveUserFile($strUserKey.'.json', $arrJSON);

				$strMessage = MSG_REGISTRATION;
				$strMessage = str_replace("%%USERNAME%%", $strUsername, $strMessage);
				$strMessage = str_replace("%%PASSWORD%%", $strPassword, $strMessage);
				$strMessage = str_replace("%%ALIAS%%", $strAlias, $strMessage);
				$strMessage = str_replace("%%USERKEY%%", $strUserKey, $strMessage);
				echo getResponseJSON($strMessage, "", "", "");
			}
		}
	}
}

function cmdUsername($strUsername_a)
{
	global $g_strUsername;
	
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			if (strlen($strUsername_a) == 0)
			{
				echo getResponseJSON($g_strUsername, "", "", "");
			}
			else
			{
				$strUsername = $strUsername_a;

				$strFoundUserFilename = findUserFileByUsername($strUsername);
				if (strlen($strFoundUserFilename) > 0)
				{
					echo getResponseJSON("", ERR_USERNAMEUNAVAILABLE, "", "");
				}
				else
				{
					$arrJSON = getCurrentUserFile();
					
					$arrJSON["username"] = $strUsername;
					
					saveCurrentUserFile($arrJSON);
					
					$g_strUsername = $strUsername;
					$_SESSION['server_username'] = $g_strUsername;

					$strMessage = str_replace("%%USERNAME%%", $strUsername_a, MSG_USERNAMEISNOW);
					echo getResponseJSON($strMessage, "", "", "");
				}
			}
		}
	}
}

function cmdUsers($strPattern_a)
{
	global $g_strServerUsersDir;
	
	$arrUserList = array();
	$strUserList = "";
	
	$arrFiles = scandir($g_strServerUsersDir);
	$arrFiles = array_diff($arrFiles, array('..', '.'));

	$intLongest = 0;

	//find the file based on a property value
	foreach ($arrFiles as $strSearchFilename) 
	{
		$strUserFile = $g_strServerUsersDir . basename($strSearchFilename); // Prevent directory traversal
		
		$strJSON = file_get_contents($strUserFile);
		$arrJSON = json_decode($strJSON, true);

		$blnActive = $arrJSON["isactive"];
		$blnSysAdmin = $arrJSON["issysadmin"];

		$strAlias = $arrJSON["alias"];
		$strAbout = $arrJSON["about"];
		$blnAdmin = $arrJSON["isadmin"];
		$blnOnline = $arrJSON["isonline"];
		
		$blnDisplay = false;
		if (($blnActive) && (!$blnSysAdmin))
		{
			if (strlen($strPattern_a) == 0)
			{
				$blnDisplay = true;
			}
			else
			{
				if (fnmatch(strtoupper($strPattern_a), strtoupper($strAlias)))
				{
					$blnDisplay = true;
				}
			}
		}
		
		if ($blnDisplay)
		{
			$intAliasLength = strlen($strAlias);
			if ($intAliasLength > $intLongest)
			{
				$intLongest = $intAliasLength;
			}

			$arrUserList[] = array( 
					"alias" => $strAlias, 
					"about" => $strAbout, 
					"isadmin" => $blnAdmin, 
					"isonline" => $blnOnline);
		}
	}
	
	foreach ($arrUserList as $objUser) 
	{
		if (strlen($strUserList) > 0)
		{
			$strUserList .= "\n";
		}
		
		$strAlias = str_pad($objUser["alias"], $intLongest, ' ', STR_PAD_RIGHT);
		
		$strAdmin = "     ";
		if ($objUser["isadmin"])
		{
			$strAdmin = "admin";
		}
		
		$strOnline = "offline";
		if ($objUser["isonline"])
		{
			$strOnline = "online ";
		}
		
		$strAbout = $objUser["about"];
		
		$strUserList .= $strAlias . " " . $strOnline . " " . $strAbout;
	}
	
	if (strlen($strUserList) == 0)
	{
		echo getResponseJSON(MSG_NOUSERSFOUND, "", "", "");
	}
	else
	{
		$strMessage = MSG_LISTOFUSERS . "\n\n" . $strUserList . "\n";
		echo getResponseJSON($strMessage, "", "", "");
	}
}

// sharing commands

// given a sharekey from someone we want to share with
// the system finds them by the sharekey and if found
// adds their sharekey and alias to our shares and
// adds our userkey and alias to their spaces
function cmdGrant($strShareKey_a)
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			// find the userfile that gave the sharekey (can only grant to active share keys)
			$strFoundUserFilename = findUserFileByShareKey($strShareKey_a, true);

			if (strlen($strFoundUserFilename) == 0) 
			{
				echo getResponseJSON("", ERR_SHAREKEYINVALID, "", "");
			}
			else
			{
				$arrJSONOurs = getCurrentUserFile();
				$arrJSONTheirs = getUserFile($strFoundUserFilename);
				
				$strUserKeyOurs = $arrJSONOurs["userkey"];
				$strAliasOurs = $arrJSONOurs["alias"];

				$strUserKeyTheirs = $arrJSONTheirs["userkey"];
				$strAliasTheirs = $arrJSONTheirs["alias"];
				
				// check our userkey is not already in their spaces
				$blnFoundSpace = false;
				foreach ($arrJSONTheirs["spaces"] as &$objSpace)
				{
					$strKey = $objSpace["key"];
					if ($strKey == $strUserKeyOurs)
					{
						$objSpace["isactive"] = true;
						$blnFoundSpace = true;
						break;
					}
				}
				
				// check their sharekey is not already in our shares
				$blnFoundShare = false;
				foreach ($arrJSONOurs["shares"] as &$objShare)
				{
					$strKey = $objShare["key"];
					if ($strKey == $strShareKey_a)
					{
						$objShare["isactive"] = true;
						$blnFoundShare = true;
						break;
					}
				}
				
				if ($blnFoundSpace && $blnFoundShare)
				{
					// fail
					//echo getResponseJSON("", ERR_GRANTEXISTS, "", "");

					if ($blnFoundSpace)
					{
						saveUserFile($strUserKeyTheirs.'.json', $arrJSONTheirs);
					}
					
					if ($blnFoundShare)
					{
						saveCurrentUserFile($arrJSONOurs);
					}
					
					$strMessage = str_replace("%%ALIAS%%", $strAliasTheirs, MSG_ALIASREINSTATED);
					echo getResponseJSON($strMessage, "", "", "");
				}
				else
				{
					$strDateTime = date("Y-m-d H:i:s");
					
					// add the space
					$arrJSONTheirs["spaces"][] = array( 
						"key" => $strUserKeyOurs, 
						"alias" => $strAliasOurs, 
						"datetime" => $strDateTime,
						"isactive" => true);
					
					saveUserFile($strUserKeyTheirs.'.json', $arrJSONTheirs);
					
					// add the share
					$arrJSONOurs["shares"][] = array( 
						"key" => $strShareKey_a, 
						"alias" => $strAliasTheirs, 
						"datetime" => $strDateTime,
						"isactive" => true);
					
					saveCurrentUserFile($arrJSONOurs);

					$strMessage = str_replace("%%ALIAS%%", $strAliasTheirs, MSG_ALIASGRANTED);
					echo getResponseJSON($strMessage, "", "", "");
				}
			}
		}
	}
}

function cmdKeys()
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();

			$strShareKeys = "";
			if (count($arrJSON["sharekeys"]) == 0)
			{
				$strShareKeys = MSG_SHAREKEYSNONE;
			}
			else
			{
				// share keys
				// get the longest key length
				$intLongest = 0;
				foreach ($arrJSON["sharekeys"] as $objShareKey) 
				{
					$intKeyLength = strlen($objShareKey["key"]);
					if ($intKeyLength > $intLongest)
					{
						$intLongest = $intKeyLength;
					}
				}

				foreach ($arrJSON["sharekeys"] as $objShareKey) 
				{

					$strShareKey = str_pad($objShareKey["key"], $intLongest, ' ', STR_PAD_RIGHT);
					
					$strActive = " ";
					if ($objShareKey["key"]) { $strActive = "*"; }

					if (strlen($strShareKeys) > 0)
					{
						$strShareKeys .= "\n";
						$strShareKeys .= "            " . $strActive . " " . $strShareKey . " " . $objShareKey["alias"];
					}
					else
					{
						$strShareKeys .= $strActive . " " . $strShareKey . " " . $objShareKey["alias"];
					}
				}
				$strShareKeys = "sharekeys:  " . $strShareKeys;
			}

			$strMessage = $strShareKeys . "\n\n* " . MSG_ACTIVEKEYS;
			echo getResponseJSON($strMessage, "", "", "");
		}
	}
}

function cmdNewKey($strAlias_a)
{
	if (strlen($strAlias_a) == 0)
	{
		echo getResponseJSON("", ERR_PARAMETERSMISSING, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();

			$strDateTime = date("Y-m-d H:i:s");
			
			$strNewKey = getGUID();
			$arrJSON["sharekeys"][] = array( 
				"key" => $strNewKey, 
				"alias" => $strAlias_a,
				"datetime" => $strDateTime,
				"isactive" => true);
			
			saveCurrentUserFile($arrJSON);
			
			$strMessage = str_replace("%%NEWKEY%%", $strNewKey, MSG_NEWKEYCREATED);
			$strMessage = str_replace("%%ALIAS%%", $strAlias_a, $strMessage);
			echo getResponseJSON($strMessage, "", "", "");
		}
	}
}

function cmdRevoke($strShareKey_a)
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			// find the userfile that gave the sharekey (can revoke from active or inactive share keys)
			$strFoundUserFilename = findUserFileByShareKey($strShareKey_a, false);

			if (strlen($strFoundUserFilename) == 0) 
			{
				echo getResponseJSON("", ERR_SHAREKEYINVALID, "", "");
			}
			else
			{
				$arrJSONOurs = getCurrentUserFile();
				$arrJSONTheirs = getUserFile($strFoundUserFilename);
				
				$strUserKeyOurs = $arrJSONOurs["userkey"];
				$strAliasOurs = $arrJSONOurs["alias"];

				$strUserKeyTheirs = $arrJSONTheirs["userkey"];
				$strAliasTheirs = $arrJSONTheirs["alias"];
				
				// check our userkey is not already in their spaces
				$blnFoundSpace = false;
				foreach ($arrJSONTheirs["spaces"] as &$objSpace)
				{
					$strKey = $objSpace["key"];
					if ($strKey == $strUserKeyOurs)
					{
						$objSpace["isactive"] = false;
						$blnFoundSpace = true;
						break;
					}
				}
				
				// check their sharekey is not already in our shares
				$blnFoundShare = false;
				foreach ($arrJSONOurs["shares"] as &$objShare)
				{
					$strKey = $objShare["key"];
					if ($strKey == $strShareKey_a)
					{
						$objShare["isactive"] = false;
						$blnFoundShare = true;
						break;
					}
				}
				
				if ($blnFoundSpace)
				{
					saveUserFile($strUserKeyTheirs.'.json', $arrJSONTheirs);
				}
				
				if ($blnFoundShare)
				{
					saveCurrentUserFile($arrJSONOurs);
				}
				
				$strMessage = str_replace("%%ALIAS%%", $strAliasTheirs, MSG_ALIASREVOKED);
				echo getResponseJSON($strMessage, "", "", "");
			}
		}
	}
}

function cmdShares()
{
	if (!validLogin())
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, "", "");
	}
	else
	{
		if (!validCurrentUser())
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getCurrentUserFile();

			$strMessage = "";
			if (count($arrJSON["shares"]) == 0)
			{
				$strMessage = MSG_SHARESNONE;
			}
			else
			{
				//get the longest key length
				$intLongest = 0;
				foreach ($arrJSON["shares"] as $objShare) 
				{
					$intKeyLength = strlen($objShare["key"]);
					if ($intKeyLength > $intLongest)
					{
						$intLongest = $intKeyLength;
					}
				}

				foreach ($arrJSON["shares"] as $objShare) 
				{

					$strShareKey = str_pad($objShare["key"], $intLongest, ' ', STR_PAD_RIGHT);
					$strActive = " ";
					if ($objShare["isactive"]) { $strActive = "*"; }
					
					if (strlen($strMessage) > 0)
					{
						$strMessage .= "\n";
					}
					$strMessage .= $strActive . " " . $strShareKey . " " . $objShare["alias"];
				}
				$strMessage = MSG_SHARES . "\n" . $strMessage . "\n\n* " . MSG_ACTIVESHARES;
			}
			
			echo getResponseJSON($strMessage, "", "", "");
		}
	}
}

function cmdValidateCookie($strDeviceKey_a)
{
	global $g_strCurrentDeviceKey;
	global $g_strServerHomeDir;
	global $g_strUserKey;
	global $g_strUsername;
	global $g_strUserSpace;
	global $g_strUserDir;
	
	if (strlen($strDeviceKey_a) == 0)
	{
		echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
	}
	else
	{
		// find the device cookie, can only validate against active devices
		$strFoundUserFilename = findUserFileByDeviceKey($strDeviceKey_a, true);
		if (strlen($strFoundUserFilename) == 0) 
		{
			echo getResponseJSON("", ERR_LOGINNOTCURRENT, ACTION_INVALIDATE, "");
		}
		else
		{
			$arrJSON = getUserFile($strFoundUserFilename);
		
			$g_strUserKey = $arrJSON["userkey"];
			$g_strUsername = $arrJSON["username"];
			
			// users default to their own home when logging in and having their cookie validated
			$g_strUserSpace = HOME_SPACENAME;
			$g_strUserDir = $g_strServerHomeDir . $g_strUserKey . '/';

			$g_strCurrentSpace = $g_strUserSpace;
			$g_strCurrentDir = $g_strUserDir;

			$_SESSION['server_userkey'] = $g_strUserKey;
			$_SESSION['server_username'] = $g_strUsername;
			
			$_SESSION['server_userspace'] = $g_strUserSpace;
			$_SESSION['server_userdir'] = $g_strUserDir;

			$_SESSION['server_currentspace'] = $g_strCurrentSpace;
			$_SESSION['server_currentdir'] = $g_strCurrentDir;

			$g_strCurrentDeviceKey = $strDeviceKey_a;
			$_SESSION['server_currentdevicekey'] = $g_strCurrentDeviceKey;

			$strMessage = str_replace("%%USERNAME%%", $g_strUsername, MSG_LOGGEDINAS);
			echo getResponseJSON($strMessage, "", "", "");
		}
	}
}

?>
