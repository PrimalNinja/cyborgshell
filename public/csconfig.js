var m_arrConfigKeys = ["flavour", "apikey", "endpoint", "model", "parallel", "maxtokens", "temperature", "proxy"];
var m_objConfigVals = {};
var m_intConfigKeyIndex = 0;
var m_objLang = {};

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
	api.print(m_objLang.options);
	api.print(" ");
	api.print("1. " + m_objLang.configureAutorun);
	api.print("2. " + m_objLang.configureHandler);
	api.print("3. " + m_objLang.configureProvider);
	api.print("4. " + m_objLang.viewServiceDetails);
	api.print("5. " + m_objLang.addUpdateServiceDetails);
	api.print("6. " + m_objLang.deleteServiceDetails);
	api.print(" ");
	api.print("B. " + m_objLang.backupConfiguration);
	api.print("D. " + m_objLang.deployConfiguration);
	api.print(" ");
	api.print(m_objLang.enterChoice);

	api.input("", function(strChoice)
	{
		switch(strChoice.trim())
		{
			case '1':
			configureAutorun();
			break;

			case '2':
			configureHandler();
			break;

			case '3':
			configureProvider();
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

			case 'B':
			case 'b':
			backupConfiguration();
			break;

			case 'D':
			case 'd':
			deployConfiguration();
			break;

			default:
			api.print(m_objLang.exiting);
			api.end();
			break;
		}
	});
}

function listLocalFiles()
{
	var arrFiles = [];
	var strPattern = '';

	// Get all localStorage keys that start with our prefix (duplicated from cyborgshell)
	var m_LOCALSTORAGEPREFIX = "cyborgshell-";
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

function configureAutorun()
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
		api.print(m_objLang.programNamePrompt);
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

function configureHandler()
{
	api.print(m_objLang.handlerDescription);
	api.print(" ");

	api.print(m_objLang.handlerNamePrompt);
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

				api.print(m_objLang.handlerPrompt);
				api.input(strHandler_a, function(strHandler_a)
				{
					var strHandler = strHandler_a.trim();
					if (strHandler.length === 0)
					{
						api.print(m_objLang.handlerRequired);
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

function configureProvider()
{
	api.print(m_objLang.providerDescription);
	api.print(" ");

	api.print(m_objLang.providerNamePrompt);
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

				api.print(m_objLang.serviceNamePrompt);
				api.input(strServiceName_a, function(strServiceName_a)
				{
					var strServiceName = strServiceName_a.trim();
					if (strServiceName.length === 0)
					{
						api.print(m_objLang.serviceNameRequired);
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
	api.print(m_objLang.viewServicePrompt);
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

function deleteServiceDetails()
{
	api.print(m_objLang.deleteServicePrompt);
	api.input("", function(strServiceName_a)
	{
		var strServiceName = (strServiceName_a || "").trim();
		if (!strServiceName)
		{
			showMenu();
		}
		else
		{
			api.print(m_objLang.aboutToDelete.replace("%%SERVICENAME%%", strServiceName));
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
					api.print(m_objLang.abortedNoChanges);
				}

				api.input("", function()
				{
					showMenu();
				});
			});
		}
	});
}

function addUpdateServiceDetails()
{
	api.print(m_objLang.serviceDetailsDescription);
	api.print(" ");

	api.print(m_objLang.enterServiceName);
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
			api.print(m_objLang.isThisCorrect);
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
					api.print(m_objLang.abortedNoChangesSaved);
				}
				api.print(" ");
				showMenu();
			});
		}
	}

	function backupConfiguration()
	{
		var m_LOCALSTORAGEPREFIX = "cyborgshell-";
		var m_LOCALSTORAGECONFIG = "config-";

		api.print(m_objLang.backupDescription);
		api.print(m_objLang.backupWarning);
		api.print("");
		api.print(m_objLang.aboutToBackup);
		api.input("", function(strConfirm_a)
		{
			if (strConfirm_a.trim().toLowerCase() === "y")
			{
				api.print(m_objLang.backingUp);
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

				//var strConfigJson = JSON.stringify(objConfig, null, 2);
				var strConfigJson = JSON.stringify(
					Object.keys(objConfig).sort().reduce(function(result, key) 
					{
						result[key] = objConfig[key];
						return result;
					}, {}), null, 2);

				api.saveFile("csconfig.json", strConfigJson, function(objResponse_a)
				{
					if (objResponse_a.error.length === 0)
					{
						api.print(m_objLang.backupComplete);
					}
					else
					{
						api.print(m_objLang.backupError.replace("%%ERROR%%", objResponse_a.error));
					}

					api.input("", function()
					{
						showMenu();
					});
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

	function deployConfiguration()
	{
		api.print(m_objLang.deployDescription);
		api.print("");
		api.print(m_objLang.aboutToDeploy);
		api.input("", function(strConfirm_a)
		{
			if (strConfirm_a.trim().toLowerCase() === "y")
			{
				api.print(m_objLang.loadingConfig);
				api.print(" ");

				api.loadFile("csconfig.json", function(objResponse_a)
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

							api.print(m_objLang.deployComplete.replace("%%COUNT%%", intConfigCount));
						}
						catch (objException_a)
						{
							api.print(m_objLang.deployParseError.replace("%%ERROR%%", objException_a.message));
						}
					}
					else
					{
						api.print(m_objLang.deployLoadError.replace("%%ERROR%%", objResponse_a.error));
					}

					api.input("", function()
					{
						showMenu();
					});
				});
			}
			else
			{
				api.print(m_objLang.deployAborted);

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