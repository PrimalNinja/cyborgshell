var m_arrConfigKeys = ["flavour", "apikey", "endpoint", "model", "parallel", "maxtokens", "temperature", "proxy", "jsonbearer"];
var m_objConfigVals = {};
var m_intConfigKeyIndex = 0;
var m_objLang = {};

var m_LOCALSTORAGEPREFIX = "cyborgshell-";
var m_LOCALSTORAGECONFIG = "config-";
var m_KEY_APIKEYS = "zoscii-apikeys";

var m_FILE_APIKEYS = "csapikeys.zoc";
var m_FILE_CONFIG = "csconfig.json";

// Load language strings on startup
function loadLanguage(cb_a)
{
	api.loadFile("csconfig.klingon.json", function(objResponse_a)
	{
		if (objResponse_a.error.length === 0)
		{
			m_objLang = JSON.parse(objResponse_a.content);
			cb_a();
		}
		else
		{
			api.loadFile("csconfig.english.json", function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					m_objLang = JSON.parse(objResponse_a.content);
					cb_a();
				}
				else
				{
					api.print("Error: Could not load language files");
					api.end();
				}
			});
		}
	});
}

function showMenu()
{
	api.cls();
	api.print(m_objLang.title);
	api.print(" ");

	// List files (duplicated from cyborgshell logic)
	listLocalFiles();

	api.print(" ");
	api.print(m_objLang.mainOptions);
	api.print(" ");
	api.print("1. " + m_objLang.configAutorun);
	api.print("2. " + m_objLang.configHandler);
	api.print("3. " + m_objLang.configProvider);
	api.print("4. " + m_objLang.viewServiceDetails);
	api.print("5. " + m_objLang.addUpdateServiceDetails);
	api.print("6. " + m_objLang.deleteServiceDetails);
	api.print(" ");
	api.print("D. " + m_objLang.configDeploy);
	api.print("B. " + m_objLang.configBackup);
	api.print(" ");
	api.print("MORE. " + m_objLang.moreOptions);
	api.print(" ");
	api.print(m_objLang.mainChoices);

	api.input("", function(strChoice)
	{
		var strChoiceUpper = strChoice.trim().toUpperCase();
		switch(strChoiceUpper)
		{
			case '1':
			configAutorun();
			break;

			case '2':
			configHandler();
			break;

			case '3':
			configProvider();
			break;

			case '4':
			viewServiceDetails();
			break;

			case '5':
			addUpdateServiceDetails();
			break;

			case '6':
			deleteServiceDetails();
			break;
			
			case 'D':
			configDeploy();
			break;

			case 'B':
			configBackup();
			break;

			case 'MORE':
			showMoreOptions();
			break;

			default:
			api.print(m_objLang.exiting);
			api.end();
			break;
		}
	});
}

function showMoreOptions()
{
	api.cls();
	api.print(m_objLang.title);
	api.print(" ");

	// List files (duplicated from cyborgshell logic)
	listLocalFiles();

	api.print(" ");
	api.print(m_objLang.moreOptions);
	api.print(" ");
	api.print("CUL. " + m_objLang.configUpload);
	api.print("CDL. " + m_objLang.configDownload);
	api.print(" ");
	api.print("ADS. " + m_objLang.apikeyDeploy);
	api.print("ABS. " + m_objLang.apikeyBackup);
	api.print(" ");
	api.print("AUL. " + m_objLang.apikeyUpload);
	api.print("ADL. " + m_objLang.apikeyDownload);
	api.print(" ");
	api.print("ADEL. " + m_objLang.apikeyDelete);
	api.print("CLEAR. " + m_objLang.clearLocalStorage);
	api.print(" ");
	api.print("MAIN. " + m_objLang.mainOptions);
	api.print(" ");
	api.print(m_objLang.moreChoices);

	api.input("", function(strChoice)
	{
		var strChoiceUpper = strChoice.trim().toUpperCase();
		switch(strChoiceUpper)
		{
			case 'CUL':
			configUpload();
			break;
			
			case 'CDL':
			configDownload();
			break;

			case 'ADS':
			apikeysDeploy();
			break;

			case 'ABS':
			apikeysBackup();
			break;

			case 'AUL':
			apikeysUpload();
			break;
			
			case 'ADL':
			apikeysDownload();
			break;

			case 'ADEL':
			apikeysDelete();
			break;

			case 'CLEAR':
			clearLocalStorage();
			break;

			case 'MAIN':
			showMenu();
			break;

			default:
			api.print(m_objLang.exiting);
			api.end();
			break;
		}
	});
}

function askNextConfigWithDefaults()
{
	if (m_intConfigKeyIndex < m_arrConfigKeys.length)
	{
		var strKey = m_arrConfigKeys[m_intConfigKeyIndex];
		var strCurrentValue = m_objConfigVals[strKey] || "";

		api.print(m_objLang.enterKey.replace("%%KEY%%", strKey));
		api.input(strCurrentValue, function(strValue_a)
		{
			var strValue = strValue_a.trim();

			// Handle deletion
			if (strValue === '-')
			{
				api.deleteLocalData(m_objConfigVals.service + "-" + strKey, function()
				{
					api.print(m_objLang.keyDeleted.replace("%%KEY%%", strKey));
					m_objConfigVals[strKey] = "";
					m_intConfigKeyIndex++;
					askNextConfigWithDefaults();
				});
			}
			else
			{
				// If empty, keep the existing value
				if (strValue.length === 0)
				{
					strValue = strCurrentValue;
				}

				api.print(strValue);
				m_objConfigVals[strKey] = strValue;
				m_intConfigKeyIndex++;
				askNextConfigWithDefaults();
			}
		});
	}
	else
	{
		api.print(" ");
		api.print(m_objLang.youEntered);
		m_arrConfigKeys.forEach(function(strKey_a)
		{
			api.print(strKey_a + ": " + m_objConfigVals[strKey_a]);
		});
		api.print(m_objLang.configConfirm);
		api.input("", function(strConfirm_a)
		{
			if (strConfirm_a.trim().toLowerCase() === "y")
			{
				var strService = m_objConfigVals.service;
				m_arrConfigKeys.forEach(function(strKey_a)
				{
					if (m_objConfigVals[strKey_a] && m_objConfigVals[strKey_a].length > 0)
					{
						api.saveLocalData(strService + "-" + strKey_a, m_objConfigVals[strKey_a], function() {});
					}
				});
				api.print(m_objLang.configSaved.replace("%%SERVICE%%", strService));
			}
			else
			{
				api.print(m_objLang.configAborted);
			}
			api.print(" ");
			showMenu();
		});
	}
}

function listLocalFiles()
{
	var arrFiles = [];
	var strPattern = '';

	// Get all localStorage keys that start with our prefix (duplicated from cyborgshell)
	for (var intI = 0; intI < localStorage.length; intI++)
	{
		var strKey = localStorage.key(intI);
		if (typeof strKey === 'string' && strKey.length > 0 && strKey.startsWith(m_LOCALSTORAGEPREFIX))
		{
			var strFilename = strKey.substring(m_LOCALSTORAGEPREFIX.length);

			// Apply pattern filter if provided (empty for now)
			if (strPattern.length === 0 || strFilename.toUpperCase().indexOf(strPattern.toUpperCase()) >= 0)
			{
				arrFiles.push(strFilename);
			}
		}
	}

	if (arrFiles.length === 0)
	{
		api.print(m_objLang.noFilesFound);
	}
	else
	{
		arrFiles.sort(); // Sort alphabetically
		var strFileList = arrFiles.join(', ');
		api.print(m_objLang.localFiles);
		api.print(" ");
		api.print(strFileList);
	}
}

function configAutorun()
{
	api.print(m_objLang.forEachSetting);
	api.print("  - " + m_objLang.pressEnterKeep);
	api.print("  - " + m_objLang.typeDashDelete);
	api.print("  - " + m_objLang.typeNewUpdate);
	api.print(" ");

	api.print(m_objLang.autorunDescription);
	api.print(" ");

	api.loadLocalData("autorun", function(strProgramName_a)
	{
		api.print(m_objLang.autorunProgramName);
		api.input(strProgramName_a, function(strProgramName_a)
		{
			var strProgramName = strProgramName_a.trim();
			if (strProgramName.length === 0)
			{
				showMenu();
			}
			else if (strProgramName === '-')
			{
				api.deleteLocalData("autorun", function()
				{
					api.print(m_objLang.autorunDeleted);
					api.input("", function()
					{
						showMenu();
					});
				});
			}
			else
			{
				api.saveLocalData("autorun", strProgramName, function()
				{
					api.print(strProgramName);
					api.print(m_objLang.autorunSaved);
					api.input("", function()
					{
						showMenu();
					});
				});
			}
		});
	});
}

function configHandler()
{
	api.print(m_objLang.handlerDescription);
	api.print(" ");

	api.print(m_objLang.handlerName);
	api.input("", function(strHandlerName_a)
	{
		var strHandlerName = strHandlerName_a.trim();
		if (strHandlerName.length === 0)
		{
			showMenu();
		}
		else
		{
			api.loadLocalData(strHandlerName + "-handler", function(strHandler_a)
			{
				api.print(m_objLang.forEachSetting);
				api.print("  - " + m_objLang.pressEnterKeep);
				api.print("  - " + m_objLang.typeDashDelete);
				api.print("  - " + m_objLang.typeNewUpdate);
				api.print(" ");

				api.print(m_objLang.handlerServiceName);
				api.input(strHandler_a, function(strHandler_a)
				{
					var strHandler = strHandler_a.trim();
					if (strHandler.length === 0)
					{
						api.print(m_objLang.handlerServiceNameRequired);
						api.input("", function()
						{
							showMenu();
						});
					}
					else if (strHandler === '-')
					{
						api.deleteLocalData(strHandlerName + "-handler", function()
						{
							api.print(m_objLang.handlerDeleted);
							api.input("", function()
							{
								showMenu();
							});
						});
					}
					else
					{
						api.saveLocalData(strHandlerName + "-handler", strHandler, function()
						{
							api.print(strHandler);
							api.print(m_objLang.handlerSaved.replace("%%HANDLERNAME%%", strHandlerName).replace("%%HANDLER%%", strHandler));
							api.input("", function()
							{
								showMenu();
							});
						});
					}
				});
			});
		}
	});
}

function configProvider()
{
	api.print(m_objLang.providerDescription);
	api.print(" ");

	api.print(m_objLang.providerName);
	api.input("", function(strProviderName_a)
	{
		var strProviderName = strProviderName_a.trim();
		if (strProviderName.length === 0)
		{
			showMenu();
		}
		else
		{
			api.loadLocalData(strProviderName + "-provider", function(strServiceName_a)
			{
				api.print(m_objLang.forEachSetting);
				api.print("  - " + m_objLang.pressEnterKeep);
				api.print("  - " + m_objLang.typeDashDelete);
				api.print("  - " + m_objLang.typeNewUpdate);
				api.print(" ");

				api.print(m_objLang.providerServiceName);
				api.input(strServiceName_a, function(strServiceName_a)
				{
					var strServiceName = strServiceName_a.trim();
					if (strServiceName.length === 0)
					{
						api.print(m_objLang.providerServiceNameRequired);
						api.input("", function()
						{
							showMenu();
						});
					}
					else if (strServiceName === '-')
					{
						api.deleteLocalData(strProviderName + "-provider", function()
						{
							api.print(m_objLang.providerDeleted);
							api.input("", function()
							{
								showMenu();
							});
						});
					}
					else
					{
						api.saveLocalData(strProviderName + "-provider", strServiceName, function()
						{
							api.print(strServiceName);
							api.print(m_objLang.providerSaved.replace("%%PROVIDERNAME%%", strProviderName).replace("%%SERVICENAME%%", strServiceName));
							api.input("", function()
							{
								showMenu();
							});
						});
					}
				});
			});
		}
	});
}

function viewServiceDetails()
{
	api.print(m_objLang.serviceDetailsViewDescription);
	api.print(" ");

	api.print(m_objLang.serviceDetailsServiceName);
	api.input("", function(strServiceName_a)
	{
		var strServiceName = strServiceName_a.trim();
		if (strServiceName.length === 0)
		{
			showMenu();
		}
		else
		{
			api.print(" ");
			api.print(m_objLang.serviceDetailsFor.replace("%%SERVICENAME%%", strServiceName));
			api.print(" ");

			// Use unique local variables
			var intCurrentLoadCount = 0;
			var intCurrentTotalKeys = m_arrConfigKeys.length;

			m_arrConfigKeys.forEach(function(strKey_a)
			{
				api.loadLocalData(strServiceName + "-" + strKey_a, function(strValue_a)
				{
					if (strValue_a !== null && strValue_a.length > 0)
					{
						api.print(strKey_a + ": " + strValue_a);
					}
					else
					{
						api.print(strKey_a + ": " + m_objLang.notSet);
					}

					intCurrentLoadCount++;
					if (intCurrentLoadCount === intCurrentTotalKeys)
					{
						api.input("", function()
						{
							showMenu();
						});
					}
				});
			});
		}
	});
}

function addUpdateServiceDetails()
{
	api.print(m_objLang.serviceDetailsAddUpdateDescription);
	api.print(" ");

	api.print(m_objLang.serviceDetailsServiceName);
	api.input("", function(strServiceName_a)
	{
		var strServiceName = strServiceName_a.trim();
		if (strServiceName.length === 0)
		{
			showMenu();
		}
		else
		{
			api.print(m_objLang.forEachSetting);
			api.print("  - " + m_objLang.pressEnterKeep);
			api.print("  - " + m_objLang.typeDashDelete);
			api.print("  - " + m_objLang.typeNewUpdate);
			api.print(" ");

			// Load existing values first
			m_objConfigVals = { service: strServiceName };
			m_intConfigKeyIndex = 0;

			// Load all existing values before starting the input process
			var intLoadCount = 0;
			var intTotalToLoad = m_arrConfigKeys.length;

			for (var intI = 0; intI < m_arrConfigKeys.length; intI++)
			{
				(function(strKey_a)
				{
					api.loadLocalData(strServiceName + "-" + strKey_a, function(strValue_a)
					{
						m_objConfigVals[strKey_a] = strValue_a || "";
						intLoadCount++;

						if (intLoadCount === intTotalToLoad)
						{
							// All values loaded, now start asking for input
							askNextConfigWithDefaults();
						}
					});
				})(m_arrConfigKeys[intI]);
			}
		}
	});
}

function deleteServiceDetails()
{
	api.print(m_objLang.serviceDetailsDeleteDescription);
	api.print(" ");

	api.print(m_objLang.serviceDetailsServiceName);
	api.input("", function(strServiceName_a)
	{
		var strServiceName = (strServiceName_a || "").trim();
		if (!strServiceName)
		{
			showMenu();
		}
		else
		{
			api.print(m_objLang.serviceDetailsDeleteConfirm.replace("%%SERVICENAME%%", strServiceName));
			api.input("", function(strConfirm_a)
			{
				if (strConfirm_a.trim().toLowerCase() === "y")
				{
					m_arrConfigKeys.forEach(function(strKey_a)
					{
						api.deleteLocalData(strServiceName + "-" + strKey_a, "", function() {});
					});
					api.print(m_objLang.serviceDetailsDeleted);
				}
				else
				{
					api.print(m_objLang.configAborted);
				}

				api.input("", function()
				{
					showMenu();
				});
			});
		}
	});
}

function configDeploy()
{
	api.print(m_objLang.configDeployDescription);
	api.print("");
	
	api.print(m_objLang.configDeployConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.configDeployLoading);
			api.print(" ");

			api.loadFile(m_FILE_CONFIG, function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					try
					{
						var objConfig = JSON.parse(objResponse_a.content);
						var intConfigCount = 0;

						for (var strConfigKey in objConfig)
						{
							if (objConfig.hasOwnProperty(strConfigKey))
							{
								api.saveLocalData(strConfigKey, objConfig[strConfigKey], function() {});
								intConfigCount++;
							}
						}

						api.print(m_objLang.configDeployComplete.replace("%%COUNT%%", intConfigCount));
					}
					catch (objException_a)
					{
						api.print(m_objLang.configDeployParseError.replace("%%ERROR%%", objException_a.message));
					}
				}
				else
				{
					api.print(m_objLang.configDeployLoadError.replace("%%ERROR%%", objResponse_a.error));
				}

				api.input("", function()
				{
					showMenu();
				});
			});
		}
		else
		{
			api.print(m_objLang.configDeployAborted);

			api.input("", function()
			{				
				showMenu();
			});
		}
	});
}

function configBackup()
{
	api.print(m_objLang.configBackupDescription);
	api.print("");
	
	api.print(m_objLang.configBackupConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.configBackupSaving);
			api.print(" ");

			var objConfig = {};

			// Collect all config- prefixed items from localStorage
			for (var intI = 0; intI < localStorage.length; intI++)
			{
				var strKey = localStorage.key(intI);
				if (typeof strKey === 'string' && strKey.length > 0 && strKey.startsWith(m_LOCALSTORAGEPREFIX))
				{
					var strFilename = strKey.substring(m_LOCALSTORAGEPREFIX.length);
					if (strFilename.startsWith(m_LOCALSTORAGECONFIG))
					{
						var strConfigKey = strFilename.substring(m_LOCALSTORAGECONFIG.length);
						var strData = localStorage.getItem(strKey);
						try
						{
							objConfig[strConfigKey] = JSON.parse(strData);
						}
						catch (objException_a)
						{
							objConfig[strConfigKey] = strData;
						}
					}
				}
			}

			var strConfigJSON = JSON.stringify(
				Object.keys(objConfig).sort().reduce(function(result, key) 
				{
					result[key] = objConfig[key];
					return result;
				}, {}), null, 2);

			api.saveFile(m_FILE_CONFIG, strConfigJSON, function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					api.print(m_objLang.configBackupComplete);
				}
				else
				{
					api.print(m_objLang.configBackupError.replace("%%ERROR%%", objResponse_a.error));
				}

				api.input("", function()
				{
					showMenu();
				});
			});
		}
		else
		{
			api.print(m_objLang.configBackupAborted);

			api.input("", function()
			{
				showMenu();
			});
		}
	});
}

function configUpload()
{
	api.print(m_objLang.configUploadDescription);
	api.print("");

	api.print(m_objLang.configUploadConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			// Create file input element
			var objInput = document.createElement('input');
			objInput.type = 'file';
			objInput.accept = '.json,application/json';
			
			objInput.onchange = function(objEvent_a)
			{
				var objFile = objEvent_a.target.files[0];
				if (objFile)
				{
					var objReader = new FileReader();
					objReader.onload = function(objEvent_a)
					{
						try
						{
							var objConfig = JSON.parse(objEvent_a.target.result);
							var intConfigCount = 0;

							api.print(m_objLang.configDeployLoading);
							api.print(" ");

							for (var strConfigKey in objConfig)
							{
								if (objConfig.hasOwnProperty(strConfigKey))
								{
									api.saveLocalData(strConfigKey, objConfig[strConfigKey], function() {});
									intConfigCount++;
								}
							}

							api.print(m_objLang.configDeployComplete.replace("%%COUNT%%", intConfigCount));
						}
						catch (objException_a)
						{
							api.print(m_objLang.configDeployParseError.replace("%%ERROR%%", objException_a.message));
						}

						api.input("", function()
						{
							showMenu();
						});
					};

					objReader.onerror = function()
					{
						api.print(m_objLang.configUploadError);
						api.input("", function()
						{
							showMenu();
						});
					};

					objReader.readAsText(objFile);
				}
				else
				{
					api.print(m_objLang.configDeployAborted);
					api.input("", function()
					{
						showMenu();
					});
				}
			};

			// Trigger file browser
			objInput.click();
		}
		else
		{
			api.print(m_objLang.configDeployAborted);

			api.input("", function()
			{				
				showMenu();
			});
		}
	});
}

function configDownload()
{
	api.print(m_objLang.configDownloadDescription);
	api.print("");
	
	api.print(m_objLang.configDownloadConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.configDownloadPreparing);
			api.print(" ");

			var objConfig = {};

			// Collect all config- prefixed items from localStorage
			for (var intI = 0; intI < localStorage.length; intI++)
			{
				var strKey = localStorage.key(intI);
				if (typeof strKey === 'string' && strKey.length > 0 && strKey.startsWith(m_LOCALSTORAGEPREFIX))
				{
					var strFilename = strKey.substring(m_LOCALSTORAGEPREFIX.length);
					if (strFilename.startsWith(m_LOCALSTORAGECONFIG))
					{
						var strConfigKey = strFilename.substring(m_LOCALSTORAGECONFIG.length);
						var strData = localStorage.getItem(strKey);
						try
						{
							objConfig[strConfigKey] = JSON.parse(strData);
						}
						catch (objException_a)
						{
							objConfig[strConfigKey] = strData;
						}
					}
				}
			}

			var strConfigJSON = JSON.stringify(
				Object.keys(objConfig).sort().reduce(function(result, key) 
				{
					result[key] = objConfig[key];
					return result;
				}, {}), null, 2);

			// Create download
			var objBlob = new Blob([strConfigJSON], { type: 'application/json' });
			var objURL = URL.createObjectURL(objBlob);
			var objA = document.createElement('a');
			objA.href = objURL;
			objA.download = m_FILE_CONFIG;
			document.body.appendChild(objA);
			objA.click();
			document.body.removeChild(objA);
			URL.revokeObjectURL(objURL);

			api.print(m_objLang.configDownloadComplete);

			api.input("", function()
			{
				showMenu();
			});
		}
		else
		{
			api.print(m_objLang.backupAborted);

			api.input("", function()
			{
				showMenu();
			});
		}
	});
}

function apikeysDeploy()
{
	api.print(m_objLang.apikeyDeployDescription);
	api.print("");
		
	api.print(m_objLang.configDeployConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.apikeyDeployLoading);
			api.print(" ");

			api.loadFile(m_FILE_APIKEYS, function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					api.saveLocalData(m_KEY_APIKEYS, objResponse_a.content, function()
					{
						api.print(m_objLang.apikeyDeployComplete);
						api.input("", function() 
						{ 
							showMenu(); 
						});
					});
				}
				else
				{
					api.print(m_objLang.apikeyDeployLoadError.replace("%%ERROR%%", objResponse_a.error));
					api.input("", function() 
					{ 
						showMenu(); 
					});
				}
			});
		}
		else
		{
			api.print(m_objLang.configDeployAborted);

			api.input("", function()
			{				
				showMenu();
			});
		}
	});
}

function apikeysBackup()
{
	api.print(m_objLang.apikeyBackupDescription);
	api.print("");
	
	api.print(m_objLang.apikeyBackupConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.apikeyBackupSaving);
			api.print(" ");

			api.loadLocalData(m_KEY_APIKEYS, function(strAPIKeys_a)
			{
				api.print(m_objLang.apikeyBackupSaving);
				api.print(" ");

				api.saveFile(m_FILE_APIKEYS, strAPIKeys_a, function(objResponse_a)
				{
					if (objResponse_a.error.length === 0)
					{
						api.print(m_objLang.apikeyBackupComplete);
					}
					else
					{
						api.print(m_objLang.apikeyBackupError.replace("%%ERROR%%", objResponse_a.error));
					}

					api.input("", function() 
					{ 
						showMenu(); 
					});
				});
			});
		}
		else
		{
			api.print(m_objLang.configBackupAborted);

			api.input("", function()
			{
				showMenu();
			});
		}
	});
}

function apikeysUpload()
{
	api.print(m_objLang.apikeyUploadDescription);
	api.print("");

	api.print(m_objLang.apikeyUploadConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			// Create file input element
			var objInput = document.createElement('input');
			objInput.type = 'file';
			objInput.accept = '.zoc,.txt,text/plain';
			
			objInput.onchange = function(objEvent_a)
			{
				var objFile = objEvent_a.target.files[0];
				if (objFile)
				{
					var objReader = new FileReader();
					objReader.onload = function(objEvent_a)
					{
						try
						{
							var strKeyFile = objEvent_a.target.result;

							api.print(m_objLang.apikeyDeployLoading);
							api.print(" ");

							api.saveLocalData(m_KEY_APIKEYS, strKeyFile, function() {});

							api.print(m_objLang.apikeyUploadComplete);
						}
						catch (objException_a)
						{
							api.print(m_objLang.apikeyUploadError);
						}

						api.input("", function()
						{
							showMenu();
						});
					};

					objReader.onerror = function()
					{
						api.print(m_objLang.apikeyUploadError);
						api.input("", function()
						{
							showMenu();
						});
					};

					objReader.readAsText(objFile);
				}
				else
				{
					api.print(m_objLang.configDeployAborted);
					api.input("", function()
					{
						showMenu();
					});
				}
			};

			// Trigger file browser
			objInput.click();
		}
		else
		{
			api.print(m_objLang.configDeployAborted);

			api.input("", function()
			{				
				showMenu();
			});
		}
	});
}

function apikeysDownload()
{
	api.print(m_objLang.apikeyDownloadDescription);
	api.print("");
	
	api.print(m_objLang.apikeyDownloadConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.apikeyDownloadPreparing);
			api.print(" ");

			api.loadLocalData(m_KEY_APIKEYS, function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					// Create download
					var objBlob = new Blob([objResponse_a.content], { type: 'application/json' });
					var objURL = URL.createObjectURL(objBlob);
					var objA = document.createElement('a');
					objA.href = objURL;
					objA.download = m_FILE_CONFIG;
					document.body.appendChild(objA);
					objA.click();
					document.body.removeChild(objA);
					URL.revokeObjectURL(objURL);

					api.print(m_objLang.apikeyDownloadComplete);

					api.input("", function()
					{
						showMenu();
					});
				}
				else
				{
					api.print(m_objLang.apikeyDownloadError.replace("%%ERROR%%", objResponse_a.error));
					api.input("", function() 
					{ 
						showMenu(); 
					});
				}
			});
		}
		else
		{
			api.print(m_objLang.backupAborted);

			api.input("", function()
			{
				showMenu();
			});
		}
	});	
}

function apikeysDelete()
{
	api.print(m_objLang.apikeyDeleteDescription);
	api.print("");

	api.print(m_objLang.apikeyDeleteConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.deleteLocalData(m_KEY_APIKEYS, function()
			{
				api.print(m_objLang.apikeyDeleted);
				api.input("", function() 
				{ 
					showMenu(); 
				});
			});
		}
		else
		{
			api.print(m_objLang.configAborted);
			api.input("", function() 
			{ 
				showMenu(); 
			});
		}
	});
}

function clearLocalStorage()
{
	api.print(m_objLang.localStorageClearDescription);
	api.print("");

	api.print(m_objLang.localStorageClearConfirm);
	api.input("", function(strConfirm_a)
	{
		if (strConfirm_a.trim().toLowerCase() === "y")
		{
			api.print(m_objLang.localStorageClearLoading); // Assuming a loading string is available
			api.print(" ");

			var arrKeysToRemove = [];
			var strPrefix = m_LOCALSTORAGEPREFIX;

			// Step 1: Identify all keys belonging to this application
			for (var intI = 0; intI < localStorage.length; intI++)
			{
				var strKey = localStorage.key(intI);
				// Safety check to only remove keys starting with the app's prefix
				if (typeof strKey === 'string' && strKey.startsWith(strPrefix))
				{
					arrKeysToRemove.push(strKey);
				}
			}

			// Step 2: Remove the identified keys
			var intDeletedCount = 0;
			if (arrKeysToRemove.length > 0)
			{
				arrKeysToRemove.forEach(function(strKeyToRemove)
				{
					api.deleteLocalData(strKeyToRemove.substring(strPrefix.length), function() 
					{ 
					// Note: api.deleteLocalData assumes the key WITHOUT the prefix
					// We rely on it to finish the deletion asynchronously
                    }); 
					localStorage.removeItem(strKeyToRemove); // Also remove synchronously just in case
					intDeletedCount++;
				});
			}

			api.print(m_objLang.localStorageCleared.replace("%%COUNT%%", intDeletedCount)); // Assuming a string with count is available

			api.input("", function() 
			{ 
				showMenu(); 
			});
		}
		else
		{
			api.print(m_objLang.configAborted);
			api.input("", function() 
			{ 
				showMenu(); 
			});
		}
	});
}


// Start the program
loadLanguage(function()
{
	showMenu();
});