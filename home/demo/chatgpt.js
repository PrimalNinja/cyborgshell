var m_strSessionID = '';	// for a forced sessionid

function chatgpt(strPrompt_a)
{
	var m_PROVIDER = 'ai';	// lowercase for provider settings

	var m_DEFAULTTIMEOUT = 120;	// in seconds
	var m_MAXSESSIONSIZE = 256; // megabytes
	var m_MAXPROMPTSIZE = 100000; // characters

	var m_LOCALSTORAGEPREFIX = "cyborgshell-";
	var m_LOCALSTORAGECONFIG = "config-";

	var m_DEBUGPROMPT = false;
	
	var m_strProvider = '';
	var m_strAPIKey = '';
	var m_strEndpoint = '';
	var m_strFlavour = '';
	var m_strModel = '';
	var m_strMaxTokens = '';
	var m_strTemperature = '';
	var m_strProxy = '';
	var m_strJSONBearer = '';
	
	function loadProviderSettings(strProvider_a, cb_a)
	{
		// Load provider-specific configs
		api.loadLocalData(strProvider_a + '-apikey', function(strAPIKey_a)
		{
			api.loadLocalData(strProvider_a + '-endpoint', function(strEndpoint_a)
			{
				api.loadLocalData(strProvider_a + '-flavour', function(strFlavour_a)
				{
					api.loadLocalData(strProvider_a + '-model', function(strModel_a)
					{
						api.loadLocalData(strProvider_a + '-maxtokens', function(strMaxTokens_a)
						{
							api.loadLocalData(strProvider_a + '-temperature', function(strTemperature_a)
							{
								api.loadLocalData(strProvider_a + '-proxy', function(strProxy_a)
								{
									api.loadLocalData(strProvider_a + '-jsonbearer', function(strJSONBearer_a)
									{
										if ((strProvider_a !== null && strProvider_a.length > 0) &&
										(strEndpoint_a !== null && strEndpoint_a.length > 0) &&
										(strModel_a !== null && strModel_a.length > 0))
										{
											m_strProvider = strProvider_a;
											m_strAPIKey = strAPIKey_a;
											m_strEndpoint = strEndpoint_a;
											m_strFlavour = strFlavour_a;
											m_strModel = strModel_a;
											m_strMaxTokens = strMaxTokens_a;
											m_strTemperature = strTemperature_a;
											m_strProxy = strProxy_a;
											m_strJSONBearer = strJSONBearer_a;

											cb_a();
										}
										else
										{
											api.errorOutput("The provider '" + m_PROVIDER + "' is not configured.");
										}
									});
								});
							});
						});
					});
				});
			});
		});
	}

	function startChatGPTInteractive()
	{
		var blnAgain = true;
		var strPrompt = "Hello";

		function input()
		{
			api.print(' ');
			api.input("", function(strInput_a)
			{
				api.print(strInput_a);
				strPrompt = strInput_a.trim();

				if (strPrompt.toLowerCase() === "x")
				{
					blnAgain = false;
					api.stop();
				}
				else
				{
					setTimeout(again, 0);
				}
			});
		}

		function again()
		{
			if (blnAgain)
			{
				if (m_DEBUGPROMPT && strPrompt.length > 0)
				{
					api.print('PROMPT: ' + strPrompt);
					api.print(' ');
				}

				invokeChatGPT(strPrompt, function()
				{
					input();
				});
			}
		}

		again();
	}

	function invokeChatGPT(strPrompt_a, cb_a)
	{
		// defaults
		var strFlavour = m_strFlavour;
		if (!strFlavour || strFlavour.length === 0) { strFlavour = "chatgpt"; }

		var strMaxTokens = m_strMaxTokens;
		if (!strMaxTokens || strMaxTokens.length === 0) { strMaxTokens = "2000"; }

		var strTemperature = m_strTemperature;
		if (!strTemperature || strTemperature.length === 0) { strTemperature = "0.7"; }

		var strProxy = m_strProxy;
		if (!strProxy || strProxy.length === 0) { strProxy = ""; }

		var strEndpoint = m_strEndpoint;

		if (strProxy.length > 0)
		{
			strEndpoint = strProxy + strEndpoint;
		}

		// Initialize session storage
		if (!globals)
		{
			globals = {};
		}

		if (!globals.chatgpt)
		{
			globals.chatgpt = {};
		}

		if (!globals.chatgpt.sessions)
		{
			globals.chatgpt.sessionsize = 0;
			globals.chatgpt.sessions = {};
		}

		function addToSession(strSessionID_a, strText_a)
		{
			if (!globals.chatgpt.sessions[strSessionID_a])
			{
				globals.chatgpt.sessions[strSessionID_a] = [];
			}

			var arrSession = globals.chatgpt.sessions[strSessionID_a];
			var intTextSize = strText_a.length * 2; // 2 bytes per character (UTF-16)
			var intMaxSizeBytes = m_MAXSESSIONSIZE * 1024 * 1024; // Convert MB to bytes

			// Add new text
			arrSession.push(strText_a);
			globals.chatgpt.sessionsize += intTextSize;

			// Remove oldest entries if we exceed the total size limit
			while (globals.chatgpt.sessionsize > intMaxSizeBytes)
			{
				var blnRemovedAny = false;

				// Find the session with the oldest entry and remove it
				var strOldestSessionID = null;
				var intOldestIndex = -1;

				for (var strSessionKey in globals.chatgpt.sessions)
				{
					var arrCurrentSession = globals.chatgpt.sessions[strSessionKey];
					if (arrCurrentSession.length > 0)
					{
						if (strOldestSessionID === null || intOldestIndex === -1)
						{
							strOldestSessionID = strSessionKey;
							intOldestIndex = 0;
						}
					}
				}

				// Remove the oldest entry
				if (strOldestSessionID && globals.chatgpt.sessions[strOldestSessionID].length > 0)
				{
					var strRemovedText = globals.chatgpt.sessions[strOldestSessionID].shift();
					var intRemovedSize = strRemovedText.length * 2;
					globals.chatgpt.sessionsize -= intRemovedSize;
					blnRemovedAny = true;

					// Clean up empty sessions
					if (globals.chatgpt.sessions[strOldestSessionID].length === 0)
					{
						delete globals.chatgpt.sessions[strOldestSessionID];
					}
				}

				if (!blnRemovedAny)
				{
					break;
				}
			}
		}

		function getSessionContext(strSessionID_a, intMaxSize_a)
		{
			var strResult = '';

			if (globals.chatgpt.sessions[strSessionID_a])
			{
				var arrSession = globals.chatgpt.sessions[strSessionID_a];
				var strContext = '';

				for (var intI = arrSession.length - 1; intI >= 0; intI--)
				{
					var strEntry = arrSession[intI];
					if (strContext.length + strEntry.length > intMaxSize_a)
					{
						break;
					}
					strContext = strEntry + '\n' + strContext;
				}

				strResult = strContext.trim();
			}

			return strResult;
		}

		// Parse command for session management
		var arrWords = strPrompt_a.trim().split(' ');
		var strCommand = arrWords[0].toLowerCase();
		var strSessionID = '';
		var objSession;
		var intI;
		var intJ;

		// Handle session commands
		if (strCommand === 'clear')
		{
			if (arrWords.length > 1)
			{
				// Clear specific session
				strSessionID = arrWords[1];
				if (globals.chatgpt.sessions[strSessionID])
				{
					for (intJ = 0; intJ < globals.chatgpt.sessions[strSessionID].length; intJ++)
					{
						globals.chatgpt.sessionsize -= globals.chatgpt.sessions[strSessionID][intJ].length * 2;
					}
					globals.chatgpt.sessions[strSessionID] = [];
					api.print('Session "' + strSessionID + '" cleared.');
				}
				else
				{
					api.print('Session "' + strSessionID + '" not found.');
				}
			}
			else
			{
				// Clear all sessions
				for (objSession in globals.chatgpt.sessions)
				{
					if (globals.chatgpt.sessions.hasOwnProperty(objSession))
					{
						for (intJ = 0; intJ < globals.chatgpt.sessions[objSession].length; intJ++)
						{
							globals.chatgpt.sessionsize -= globals.chatgpt.sessions[objSession][intJ].length * 2;
						}
						globals.chatgpt.sessions[objSession] = [];
					}
				}
				api.print('All sessions cleared.');
			}

			if ($.isFunction(cb_a))
			{
				cb_a();
			}
			return;
		}

		if (strCommand === 'save')
		{
			if (arrWords.length > 1)
			{
				// Save specific session
				strSessionID = arrWords[1];
				if (globals.chatgpt.sessions[strSessionID])
				{
					var objSessionData = {
						session: globals.chatgpt.sessions[strSessionID],
						size: globals.chatgpt.sessions[strSessionID].reduce(function(intTotal_a, objEntry_a)
						{
							return intTotal_a + (objEntry_a.length * 2);
						}, 0)
					};

					api.saveFile('chatgpt-session-' + strSessionID + '.json', JSON.stringify(objSessionData), function(objResponse_a)
					{
						if (objResponse_a.error.length === 0)
						{
							api.print('Session "' + strSessionID + '" saved.');
						}
						else
						{
							api.print('Failed to save session "' + strSessionID + '": ' + objResponse_a.error);
						}

						if ($.isFunction(cb_a))
						{
							cb_a();
						}
					});
				}
				else
				{
					api.print('Session "' + strSessionID + '" not found.');
				}
			}
			else
			{
				// Save all sessions
				var objAllSessions = {
					sessions: globals.chatgpt.sessions,
					totalSize: globals.chatgpt.sessionsize
				};

				api.saveFile('chatgpt-all-sessions.json', JSON.stringify(objAllSessions), function(objResponse_a)
				{
					if (objResponse_a.error.length === 0)
					{
						api.print('All sessions saved.');
					}
					else
					{
						api.print('Failed to save sessions: ' + objResponse_a.error);
					}

					if ($.isFunction(cb_a))
					{
						cb_a();
					}
				});
			}
			return;
		}

		if (strCommand === 'load')
		{
			if (arrWords.length > 1)
			{
				// Load specific session
				strSessionID = arrWords[1];
				api.loadFile('chatgpt-session-' + strSessionID + '.json', function(objResponse_a)
				{
					if (objResponse_a.error.length === 0 && objResponse_a.content)
					{
						try
						{
							var objData = JSON.parse(objResponse_a.content);
							if (objData && objData.session)
							{
								// Remove current session size if it exists
								if (globals.chatgpt.sessions[strSessionID])
								{
									var intOldSize = globals.chatgpt.sessions[strSessionID].reduce(function(intTotal_a, objEntry_a)
									{
										return intTotal_a + (objEntry_a.length * 2);
									}, 0);
									globals.chatgpt.sessionsize -= intOldSize;
								}

								// Load new session
								globals.chatgpt.sessions[strSessionID] = objData.session;
								globals.chatgpt.sessionsize += objData.size;
								api.print('Session "' + strSessionID + '" loaded.');
							}
							else
							{
								api.print('Session "' + strSessionID + '" file is corrupted.');
							}
						}
						catch (objException_a)
						{
							api.print('Session "' + strSessionID + '" file is corrupted: ' + objException_a.message);
						}
					}
					else
					{
						api.print('Session "' + strSessionID + '" not found.');
					}

					if ($.isFunction(cb_a))
					{
						cb_a();
					}
				});
			}
			else
			{
				// Load all sessions (replace current sessions)
				api.loadFile('chatgpt-all-sessions.json', function(objResponse_a)
				{
					if (objResponse_a.error.length === 0 && objResponse_a.content)
					{
						try
						{
							var objData = JSON.parse(objResponse_a.content);
							if (objData && objData.sessions)
							{
								globals.chatgpt.sessions = objData.sessions;
								globals.chatgpt.sessionsize = objData.totalSize;
								api.print('All sessions loaded.');
							}
							else
							{
								api.print('Session file is corrupted.');
							}
						}
						catch (objException_a)
						{
							api.print('Session file is corrupted: ' + objException_a.message);
						}
					}
					else
					{
						api.print('No saved sessions found.');
					}

					if ($.isFunction(cb_a))
					{
						cb_a();
					}
				});
			}
			return;
		}

		if (strCommand === 'train')
		{
			var strTrainingSources;
			if (arrWords.length >= 2)
			{
				// Train specific session with file content or other sessions
				// Handle case where session ID is omitted (use 'default')
				if (arrWords.length === 2)
				{
					strSessionID = 'default';
					strTrainingSources = arrWords[1];
				}
				else
				{
					// Session ID provided - strip colon if present
					strSessionID = arrWords[1];
					if (strSessionID.endsWith(':'))
					{
						strSessionID = strSessionID.substring(0, strSessionID.length - 1);
					}
					strTrainingSources = arrWords[2];
				}
				
				// Parse training sources: files (.ext) and sessions (:)
				var arrSources = strTrainingSources.split(',');
				var intTodo = 0;
				var intDone = 0;
				var arrMessages = [];
				
				// Count valid sources
				for (intI = 0; intI < arrSources.length; intI++)
				{
					if (arrSources[intI].trim().length > 0)
					{
						intTodo++;
					}
				}
				
				function checkComplete()
				{
					intDone++;
					if (intDone === intTodo)
					{
						// All sources processed
						if (arrMessages.length > 0)
						{
							api.print(arrMessages.join('\n'));
						}
						
						if ($.isFunction(cb_a))
						{
							cb_a();
						}
					}
				}
				
				if (intTodo === 0)
				{
					api.print('No valid training sources specified');
					if ($.isFunction(cb_a))
					{
						cb_a();
					}
				}
				else
				{
					for (intI = 0; intI < arrSources.length; intI++)
					{
						var strSource = arrSources[intI].trim();
						
						if (strSource.length === 0)
						{
							continue;
						}
						
						if (strSource.endsWith(':'))
						{
							// Session reference - copy from another session
							var strSourceSession = strSource.substring(0, strSource.length - 1);
							
							if (globals.chatgpt.sessions[strSourceSession])
							{
								// Initialize target session if it doesn't exist
								if (!globals.chatgpt.sessions[strSessionID])
								{
									globals.chatgpt.sessions[strSessionID] = [];
								}
								
								// Append all entries from source session
								for (intJ = 0; intJ < globals.chatgpt.sessions[strSourceSession].length; intJ++)
								{
									addToSession(strSessionID, globals.chatgpt.sessions[strSourceSession][intJ]);
								}
								arrMessages.push('Session "' + strSessionID + '" trained with session "' + strSourceSession + '"');
								checkComplete();
							}
							else
							{
								api.print('Source session "' + strSourceSession + '" not found');
								checkComplete();
							}
						}
						else
						{
							// File reference - load and train
							(function(strFile) {
								api.loadFile(strFile, function(objResponse_a)
								{
									if (objResponse_a.error.length === 0 && objResponse_a.content)
									{
										// Initialize session if it doesn't exist
										if (!globals.chatgpt.sessions[strSessionID])
										{
											globals.chatgpt.sessions[strSessionID] = [];
										}
										
										// Add file content to session
										addToSession(strSessionID, objResponse_a.content);
										arrMessages.push('Session "' + strSessionID + '" trained with ' + strFile);
									}
									else
									{
										api.print('Failed to load training file "' + strFile + '": ' + 
											(objResponse_a.error || 'File not found'));
									}
									checkComplete();
								});
							})(strSource);
						}
					}
				}
			}
			else
			{
				api.print('Usage: chatgpt train <sessionid> <filename>');
				if ($.isFunction(cb_a))
				{
					cb_a();
				}
			}
			return;
		}
		
		var strConfigKey = '';
		var strFilename = '';
		var strKey = '';
		var strServiceName = '';

		if (strCommand === 'service')
		{
			if (arrWords.length > 1)
			{
				// Switch to specified service
				var strNewService = arrWords[1];
				
				api.print('Switching to service: ' + strNewService);
				
				// Load the service (which loads its provider settings)
				loadProviderSettings(strNewService, function()
				{
					// m_* variables already updated by loadProviderSettings
					api.print('Service switched to: ' + strNewService);
					api.print('Provider: ' + m_strProvider);
					api.print('Endpoint: ' + m_strEndpoint);
					api.print('Model: ' + m_strModel);
					api.print('Flavour: ' + (m_strFlavour || 'chatgpt'));
					
					if ($.isFunction(cb_a))
					{
						cb_a();
					}
				});
			}
			else
			{
				// Show current service - need to determine which service is active
				// by checking which service points to the current provider
				var strCurrentService = '';
				
				// Find which service is currently using this provider
				for (intI = 0; intI < localStorage.length; intI++)
				{
					strKey = localStorage.key(intI);
					if (typeof strKey === 'string' && strKey.length > 0 && strKey.startsWith(m_LOCALSTORAGEPREFIX))
					{
						strFilename = strKey.substring(m_LOCALSTORAGEPREFIX.length);
						if (strFilename.startsWith(m_LOCALSTORAGECONFIG))
						{
							strConfigKey = strFilename.substring(m_LOCALSTORAGECONFIG.length);
							
							// Check if this ends with '-provider'
							if (strConfigKey.endsWith('-provider'))
							{
								strServiceName = strConfigKey.substring(0, strConfigKey.length - 9);
								var strData = localStorage.getItem(strKey);
								try
								{
									var strProviderValue = JSON.parse(strData);
									if (strProviderValue === m_strProvider)
									{
										strCurrentService = strServiceName;
										break;
									}
								}
								catch (e)
								{
									// Handle non-JSON values
									if (strData === m_strProvider)
									{
										strCurrentService = strServiceName;
										break;
									}
								}
							}
						}
					}
				}
				
				api.print('Current service: ' + (strCurrentService || 'unknown'));
				api.print('Provider: ' + m_strProvider);
				api.print('Endpoint: ' + m_strEndpoint);
				api.print('Model: ' + m_strModel);
				api.print('Flavour: ' + (m_strFlavour || 'chatgpt'));
				api.print('Max Tokens: ' + (m_strMaxTokens || '2000'));
				api.print('Temperature: ' + (m_strTemperature || '0.7'));
				api.print('Proxy: ' + (m_strProxy || 'none'));
				api.print('JSON Bearer: ' + (m_strJSONBearer || 'N'));
				
				if ($.isFunction(cb_a))
				{
					cb_a();
				}
			}
			return;
		}

		if (strCommand === 'services')
		{
			api.print('Loading configured services...');
			
			var objServices = {}; // Use object as a set for uniqueness
			
			// Scan localStorage for all config-<service>-endpoint entries
			// Format: cyborgshell-config-<service>-endpoint
			for (intI = 0; intI < localStorage.length; intI++)
			{
				strKey = localStorage.key(intI);
				if (typeof strKey === 'string' && strKey.length > 0 && strKey.startsWith(m_LOCALSTORAGEPREFIX))
				{
					strFilename = strKey.substring(m_LOCALSTORAGEPREFIX.length);
					if (strFilename.startsWith(m_LOCALSTORAGECONFIG))
					{
						strConfigKey = strFilename.substring(m_LOCALSTORAGECONFIG.length);
						
						// Check if this ends with '-endpoint'
						// strConfigKey format: <service>-endpoint
						if (strConfigKey.endsWith('-endpoint'))
						{
							// Extract the service name (everything before '-endpoint')
							strServiceName = strConfigKey.substring(0, strConfigKey.length - 9); // 9 = '-endpoint'.length
							objServices[strServiceName] = true; // Add to set
						}
					}
				}
			}
			
			// Convert object keys to array
			var arrServices = [];
			for (var strService in objServices)
			{
				if (objServices.hasOwnProperty(strService))
				{
					arrServices.push(strService);
				}
			}
			
			if (arrServices.length > 0)
			{
				arrServices.sort();
				api.print('Configured services: ' + arrServices.join(', '));
			}
			else
			{
				api.print('No services configured. Use csconfig to add services.');
			}
			
			if ($.isFunction(cb_a))
			{
				cb_a();
			}
			return;
		}

		if (strCommand === 'sessions')
		{
			var arrSessionList = [];
			for (objSession in globals.chatgpt.sessions)
			{
				if (globals.chatgpt.sessions.hasOwnProperty(objSession) && globals.chatgpt.sessions[objSession].length > 0)
				{
					// Calculate session size
					var intSessionSize = globals.chatgpt.sessions[objSession].reduce(function(intTotal_a, objEntry_a)
					{
						return intTotal_a + (objEntry_a.length * 2); // 2 bytes per character (UTF-16)
					}, 0);

					// Format size as KB or MB
					var strSize = '';
					if (intSessionSize < 1024)
					{
						strSize = intSessionSize + ' bytes';
					}
					else if (intSessionSize < 1024 * 1024)
					{
						strSize = Math.round(intSessionSize / 1024) + ' KB';
					}
					else
					{
						strSize = Math.round(intSessionSize / (1024 * 1024)) + ' MB';
					}

					arrSessionList.push(objSession + ' (' + globals.chatgpt.sessions[objSession].length + ' entries, ' + strSize + ')');
				}
			}

			if (arrSessionList.length > 0)
			{
				api.print('Active sessions: ' + arrSessionList.join(', '));

				// Show total usage
				var strTotalSize = '';
				if (globals.chatgpt.sessionsize < 1024)
				{
					strTotalSize = globals.chatgpt.sessionsize + ' bytes';
				}
				else if (globals.chatgpt.sessionsize < 1024 * 1024)
				{
					strTotalSize = Math.round(globals.chatgpt.sessionsize / 1024) + ' KB';
				}
				else
				{
					strTotalSize = Math.round(globals.chatgpt.sessionsize / (1024 * 1024)) + ' MB';
				}

				api.print('Total memory usage: ' + strTotalSize + ' of 256 MB');
			}
			else
			{
				api.print('No active sessions.');
			}

			if ($.isFunction(cb_a))
			{
				cb_a();
			}
			return;
		}

		// Parse session ID from command
		strSessionID = 'default';
		if (m_strSessionID.length > 0)
		{
			strSessionID = m_strSessionID;
		}
		var strActualPrompt = strPrompt_a;

		//if (strCommand.startsWith('[') && strCommand.endsWith(']'))
		//{
		//strSessionID = strCommand.substring(1, strCommand.length - 1);
		//strActualPrompt = arrWords.slice(1).join(' ');
		//}
		if (strCommand.endsWith(':'))
		{
			strSessionID = strCommand.substring(0, strCommand.length - 1);
			strActualPrompt = arrWords.slice(1).join(' ');
		}

		function callChatGPT(strPrompt_a, strSessionContext_a, cbInternal_a)
		{
			var arrMessages = [];

			if (strSessionContext_a && strSessionContext_a.length > 0)
			{
				arrMessages.push({
					role: 'system',
					content: 'Context:\n' + strSessionContext_a
				});
			}

			arrMessages.push({
				role: 'user',
				content: strPrompt_a
			});

			var objFlavour;
			var objHeaders;
			var objPayload;
			if (strFlavour.toLowerCase() === 'claude')
			{
				var strSystemMessage = null;
				var arrUserMessages = [];

				for (var intI = 0; intI < arrMessages.length; intI++)
				{
					if (arrMessages[intI].role === 'system')
					{
						strSystemMessage = arrMessages[intI].content;
					}
					else
					{
						arrUserMessages.push(arrMessages[intI]);
					}
				}

				objPayload = {
					model: m_strModel,
					max_tokens: parseInt(strMaxTokens, 10),
					temperature: parseFloat(strTemperature),
					system: strSystemMessage || '',
					messages: arrUserMessages
				};

				if (toBoolean(m_strJSONBearer))
				{
					objPayload.bearer = m_strAPIKey;		// <-- avoid CORS problems
				}

				objHeaders = {
					'x-api-key': m_strAPIKey,
					'Content-Type': 'application/json',
					'anthropic-version': '2023-06-01',
					'anthropic-dangerous-direct-browser-access': 'true'
				};

				objFlavour = {
					url: strEndpoint,
					method: 'POST',
					headers: objHeaders,
					data: JSON.stringify(objPayload),
					timeout: (m_DEFAULTTIMEOUT * 1000)
				};
			}
			else if (strFlavour.toLowerCase() === 'gemini')
			{
				var strFullPrompt = strPrompt_a;
				if (strSessionContext_a && strSessionContext_a.length > 0) {
					strFullPrompt = 'Context:\n' + strSessionContext_a + '\n\nUser: ' + strPrompt_a;
				}

				objPayload = {
					"contents": [
						{
							"role": "user",
							"parts": [
								{
									"text": strFullPrompt  // ← FIX: Use full prompt with context
								}
							]
						}
					],
					"generationConfig":
					{
						"maxOutputTokens": parseInt(strMaxTokens, 10),
						"temperature": parseFloat(strTemperature)
					}
				};

				// Correct header syntax
				objHeaders = {
					'Content-Type': 'application/json'
				};

				strEndpoint = strEndpoint + '?key=' + m_strAPIKey;

				objFlavour = {
					url: strEndpoint,
					method: 'POST',
					headers: objHeaders,
					data: JSON.stringify(objPayload),
					timeout: (m_DEFAULTTIMEOUT * 1000),
					dataType: 'json'
				};
			}
			else
			{
				objPayload = {
					model: m_strModel,
					max_tokens: parseInt(strMaxTokens, 10),
					temperature: parseFloat(strTemperature),
					messages: arrMessages
				};

				if (toBoolean(m_strJSONBearer))
				{
					objPayload.bearer = m_strAPIKey;		// <-- avoid CORS problems
				}

				objHeaders = {
					'Content-Type': 'application/json'
				};

				if (m_strAPIKey !== null && m_strAPIKey.length > 0)
				{
					objHeaders['Authorization'] = 'Bearer ' + m_strAPIKey;
				}

				objFlavour = {
					url: strEndpoint,
					method: 'POST',
					headers: objHeaders,
					data: JSON.stringify(objPayload),
					timeout: (m_DEFAULTTIMEOUT * 1000)
				};
			}

			console.log(objFlavour);

			var strResponse;
			$.ajax(objFlavour).done(function(objResponse_a)
			{
				console.log(objResponse_a);
				console.log(typeof objResponse_a);
				if (strFlavour.toLowerCase() === 'claude')
				{
					if (objResponse_a.content && objResponse_a.content.length > 0)
					{
						strResponse = objResponse_a.content[0].text;
						cbInternal_a(null, strResponse);
					}
					else
					{
						cbInternal_a('No response from ' + m_strProvider, null);
					}
				}
else if (strFlavour.toLowerCase() === 'gemini')
{
    console.log('Gemini response:', objResponse_a);
    
    // Gemini 2.5+ response handling
    // New format: candidates[0].content.parts[0].text
    // OR: candidates[0].text (direct text property)
    if (objResponse_a.candidates && objResponse_a.candidates.length > 0)
    {
        var objCandidate = objResponse_a.candidates[0];
        
        // Try new format: content.parts[0].text
        if (objCandidate.content && 
            objCandidate.content.parts && 
            objCandidate.content.parts.length > 0 &&
            objCandidate.content.parts[0].text)
        {
            strResponse = objCandidate.content.parts[0].text;
            cbInternal_a(null, strResponse);
        }
        // Try alternate format: direct text property
        else if (objCandidate.text)
        {
            strResponse = objCandidate.text;
            cbInternal_a(null, strResponse);
        }
        // Try message property
        else if (objCandidate.message && objCandidate.message.content)
        {
            strResponse = objCandidate.message.content;
            cbInternal_a(null, strResponse);
        }
        else
        {
            console.error('Gemini unexpected format:', objCandidate);
            cbInternal_a('No response from ' + m_strProvider + ' - unexpected format', null);
        }
    }
    else
    {
        cbInternal_a('No response from ' + m_strProvider, null);
    }
}
				else
				{
					if (objResponse_a.choices && objResponse_a.choices.length > 0)
					{
						strResponse = objResponse_a.choices[0].message.content;
						cbInternal_a(null, strResponse);
					}
					else
					{
						cbInternal_a('No response from ' + m_strProvider, null);
					}
				}
			}).fail(function(objXHR_a, strStatus_a, strError_a)
			{
				var strErrorMessage = m_strProvider + ' API error: ';

				if (objXHR_a.responseJSON && objXHR_a.responseJSON.error)
				{
					strErrorMessage += objXHR_a.responseJSON.error.message;
				}
				else if (strStatus_a === 'timeout')
				{
					strErrorMessage += 'Request timed out';
				}
				else
				{
					strErrorMessage += strStatus_a + ' - ' + strError_a;
				}

				cbInternal_a(strErrorMessage, null);
			});
		}

		if (strActualPrompt && strActualPrompt.trim().length > 0)
		{
			// Calculate available space for session context
			var intPromptSize = strActualPrompt.length;
			var intAvailableSpace = m_MAXPROMPTSIZE - intPromptSize;

			// Get session context if available
			var strSessionContext = '';
			if (strSessionID && strSessionID !== 'null' && intAvailableSpace > 0)
			{
				strSessionContext = getSessionContext(strSessionID, intAvailableSpace);
			}
			console.log('session:' + strSessionID);

			callChatGPT(strActualPrompt, strSessionContext, function(strError_a, strResponse_a)
			{
				if (strError_a)
				{
					api.print('Error: ' + strError_a);
				}
				else
				{
					api.print(strResponse_a);

					// Add the prompt and response to the session for future context
					if (strSessionID && strSessionID !== 'null')
					{
						addToSession(strSessionID, 'USER: ' + strActualPrompt);
						addToSession(strSessionID, 'ASSISTANT: ' + strResponse_a);
					}
				}

				if ($.isFunction(cb_a))
				{
					cb_a();
				}
			});
		}
		else
		{
			api.print('Usage: chatgpt [<sessionid>:] <prompt>');
			api.print('       chatgpt clear <sessionid>');
			api.print('       chatgpt sessions');
			api.print('       chatgpt save <sessionid>');
			api.print('       chatgpt load <sessionid>');
			api.print('       chatgpt services');
			api.print('       chatgpt service <services>');
			api.print('       chatgpt train [<sessionid>:] <filenames-sessions>');
			api.print(' ');
			api.print('Examples:');
			api.print('  chatgpt remember the number 5');
			api.print('  chatgpt what number did I tell you to remember?');
			api.print('  chatgpt math: solve 2+2');
			api.print('  chatgpt math: what is the square root of that?');
			api.print('  chatgpt clear math');
			api.print('  chatgpt sessions');
			api.print('  chatgpt save');
			api.print('  chatgpt save math');
			api.print('  chatgpt load');
			api.print('  chatgpt load math');
			api.print('  chatgpt train combinatorics: combinatorics.txt');
			api.print('  chatgpt train statistics: statistics.txt');
			api.print('  chatgpt train math: combinatorics:,statistics:');
			api.print(' ');
			api.print('Interactive Mode:');
			api.print("  If you are in interactive mode, you can ommit 'chatgpt ' from the commands above.");
			api.print("  Type 'x' to exit");

			if ($.isFunction(cb_a))
			{
				cb_a();
			}
		}
	}

	function toBoolean(str_a)
	{
		var strResult = str_a;
		if (strResult === undefined || strResult === null) { strResult = 'N'; }

		strResult = strResult.toUpperCase();

		return (strResult === 'Y' || strResult === 'YES' || strResult === 'T' || strResult === 'TRUE' ||
		strResult === '1' || strResult === 'ON' || strResult === 'ENABLE' || strResult === 'ENABLED');
	}

	api.loadLocalData(m_PROVIDER + '-provider', function(strProvider_a)
	{
		api.print('Provider: ' + strProvider_a);
		loadProviderSettings(strProvider_a, function()
		{
			if (strPrompt_a.length > 0)
			{
				invokeChatGPT(strPrompt_a);
			}
			else
			{
				startChatGPTInteractive();
			}
		});
	});
}

chatgpt(api.commandline.slice(2).join(' '));