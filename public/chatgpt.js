var m_strSessionID = '';	// for a forced sessionid

function chatgpt(strPrompt_a) 
{
	var m_PROVIDER = 'ai';	// lowercase for provider settings
	
	var m_DEFAULTTIMEOUT = 120;	// in seconds
	var m_MAXSESSIONSIZE = 256; // megabytes
	var m_MAXPROMPTSIZE = 100000; // characters

	var m_DEBUGPROMPT = false;

	function startChatGPTInteractive(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a)
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
				
				invokeChatGPT(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a, strPrompt, function() 
				{
					input();
				});
			}
		}
		
		again();
	}

	function invokeChatGPT(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a, strPrompt_a, cb_a)
	{
		// defaults
		var strFlavour = strFlavour_a;
		if (!strFlavour || strFlavour.length === 0) { strFlavour = "chatgpt"; }

		var strMaxTokens = strMaxTokens_a;
		if (!strMaxTokens || strMaxTokens.length === 0) { strMaxTokens = "2000"; }

		var strTemperature = strTemperature_a;
		if (!strTemperature || strTemperature.length === 0) { strTemperature = "0.7"; }

		var strProxy = strProxy_a;
		if (!strProxy || strProxy.length === 0) { strProxy = ""; }
		
		var strEndpoint = strEndpoint_a;
		
		if (strProxy.length > 0)
		{
			strEndpoint = strProxy + strEndpoint;
		}
		
		// Initialize session storage
		if (!api.globals) 
		{
			api.globals = {};
		}
		
		if (!api.globals.chatgpt) 
		{
			api.globals.chatgpt = {};
		}
		
		if (!api.globals.chatgpt.sessions) 
		{
			api.globals.chatgpt.sessionsize = 0;
			api.globals.chatgpt.sessions = {};
		}
		
		function addToSession(strSessionID_a, strText_a) 
		{
			if (!api.globals.chatgpt.sessions[strSessionID_a]) 
			{
				api.globals.chatgpt.sessions[strSessionID_a] = [];
			}
			
			var arrSession = api.globals.chatgpt.sessions[strSessionID_a];
			var intTextSize = strText_a.length * 2; // 2 bytes per character (UTF-16)
			var intMaxSizeBytes = m_MAXSESSIONSIZE * 1024 * 1024; // Convert MB to bytes
			
			// Add new text
			arrSession.push(strText_a);
			api.globals.chatgpt.sessionsize += intTextSize;
			
			// Remove oldest entries if we exceed the total size limit
			while (api.globals.chatgpt.sessionsize > intMaxSizeBytes) 
			{
				var blnRemovedAny = false;
				
				// Find the session with the oldest entry and remove it
				var strOldestSessionID = null;
				var intOldestIndex = -1;
				
				for (var strSessionKey in api.globals.chatgpt.sessions) 
				{
					var arrCurrentSession = api.globals.chatgpt.sessions[strSessionKey];
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
				if (strOldestSessionID && api.globals.chatgpt.sessions[strOldestSessionID].length > 0) 
				{
					var strRemovedText = api.globals.chatgpt.sessions[strOldestSessionID].shift();
					var intRemovedSize = strRemovedText.length * 2;
					api.globals.chatgpt.sessionsize -= intRemovedSize;
					blnRemovedAny = true;
					
					// Clean up empty sessions
					if (api.globals.chatgpt.sessions[strOldestSessionID].length === 0) 
					{
						delete api.globals.chatgpt.sessions[strOldestSessionID];
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
			
			if (api.globals.chatgpt.sessions[strSessionID_a]) 
			{
				var arrSession = api.globals.chatgpt.sessions[strSessionID_a];
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
		var intJ;
		
		// Handle session commands
		if (strCommand === 'clear') 
		{
			if (arrWords.length > 1) 
			{
				// Clear specific session
				strSessionID = arrWords[1];
				if (api.globals.chatgpt.sessions[strSessionID]) 
				{
					for (intJ = 0; intJ < api.globals.chatgpt.sessions[strSessionID].length; intJ++) 
					{
						api.globals.chatgpt.sessionsize -= api.globals.chatgpt.sessions[strSessionID][intJ].length * 2;
					}
					api.globals.chatgpt.sessions[strSessionID] = [];
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
				for (objSession in api.globals.chatgpt.sessions) 
				{
					if (api.globals.chatgpt.sessions.hasOwnProperty(objSession)) 
					{
						for (intJ = 0; intJ < api.globals.chatgpt.sessions[objSession].length; intJ++) 
						{
							api.globals.chatgpt.sessionsize -= api.globals.chatgpt.sessions[objSession][intJ].length * 2;
						}
						api.globals.chatgpt.sessions[objSession] = [];
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
				if (api.globals.chatgpt.sessions[strSessionID]) 
				{
					var objSessionData = {
						session: api.globals.chatgpt.sessions[strSessionID],
						size: api.globals.chatgpt.sessions[strSessionID].reduce(function(intTotal_a, objEntry_a) 
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
					sessions: api.globals.chatgpt.sessions,
					totalSize: api.globals.chatgpt.sessionsize
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
								if (api.globals.chatgpt.sessions[strSessionID]) 
								{
									var intOldSize = api.globals.chatgpt.sessions[strSessionID].reduce(function(intTotal_a, objEntry_a) 
									{
										return intTotal_a + (objEntry_a.length * 2);
									}, 0);
									api.globals.chatgpt.sessionsize -= intOldSize;
								}
								
								// Load new session
								api.globals.chatgpt.sessions[strSessionID] = objData.session;
								api.globals.chatgpt.sessionsize += objData.size;
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
								api.globals.chatgpt.sessions = objData.sessions;
								api.globals.chatgpt.sessionsize = objData.totalSize;
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

		if (strCommand === 'sessions')
		{
			var arrSessionList = [];
			for (objSession in api.globals.chatgpt.sessions) 
			{
				if (api.globals.chatgpt.sessions.hasOwnProperty(objSession) && api.globals.chatgpt.sessions[objSession].length > 0) 
				{
					// Calculate session size
					var intSessionSize = api.globals.chatgpt.sessions[objSession].reduce(function(intTotal_a, objEntry_a) 
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
					
					arrSessionList.push(objSession + ' (' + api.globals.chatgpt.sessions[objSession].length + ' entries, ' + strSize + ')');
				}
			}
			
			if (arrSessionList.length > 0)
			{
				api.print('Active sessions: ' + arrSessionList.join(', '));
				
				// Show total usage
				var strTotalSize = '';
				if (api.globals.chatgpt.sessionsize < 1024) 
				{
					strTotalSize = api.globals.chatgpt.sessionsize + ' bytes';
				}
				else if (api.globals.chatgpt.sessionsize < 1024 * 1024) 
				{
					strTotalSize = Math.round(api.globals.chatgpt.sessionsize / 1024) + ' KB';
				}
				else 
				{
					strTotalSize = Math.round(api.globals.chatgpt.sessionsize / (1024 * 1024)) + ' MB';
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
					model: strModel_a,
					max_tokens: parseInt(strMaxTokens, 10),
					temperature: parseFloat(strTemperature),
					system: strSystemMessage || '',
					messages: arrUserMessages
				};
				
				objHeaders = {
					'x-api-key': strAPIKey_a,
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
				
				strEndpoint = strEndpoint + '?key=' + strAPIKey_a;

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
					model: strModel_a,
					max_tokens: parseInt(strMaxTokens, 10),
					temperature: parseFloat(strTemperature),
					messages: arrMessages
				};
				
				objHeaders = {
					'Content-Type': 'application/json'
				};

				if (strAPIKey_a !== null && strAPIKey_a.length > 0) 
				{
					objHeaders['Authorization'] = 'Bearer ' + strAPIKey_a;
				}	
				
				objFlavour = {
					url: strEndpoint,
					method: 'POST',
					headers: objHeaders,
					data: JSON.stringify(objPayload),
					timeout: (m_DEFAULTTIMEOUT * 1000)
				};
			}
			
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
						cbInternal_a('No response from ' + strProvider_a, null);
					}
				}
				else if (strFlavour.toLowerCase() === 'gemini')
				{
console.log('1');					
console.log(objResponse_a.candidates && objResponse_a.candidates.length > 0);
console.log(objResponse_a.candidates[0].content);
console.log(objResponse_a.candidates[0].content.parts);
console.log(objResponse_a.candidates[0].content.parts.length > 0);
						
					// Gemini response handling
					if (objResponse_a.candidates && objResponse_a.candidates.length > 0 && 
						objResponse_a.candidates[0].content && 
						objResponse_a.candidates[0].content.parts && 
						objResponse_a.candidates[0].content.parts.length > 0)
					{
console.log('2');					
						strResponse = objResponse_a.candidates[0].content.parts[0].text;
						cbInternal_a(null, strResponse);
					}
					else
					{
console.log('3');					
						cbInternal_a('No response from ' + strProvider_a, null);
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
						cbInternal_a('No response from ' + strProvider_a, null);
					}
				}
			}).fail(function(objXHR_a, strStatus_a, strError_a) 
			{
				var strErrorMessage = strProvider_a + ' API error: ';
				
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
	
    api.loadLocalData(m_PROVIDER + '-provider', function(strProvider_a) 
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
									if ((strProvider_a !== null && strProvider_a.length > 0) &&
										(strEndpoint_a !== null && strEndpoint_a.length > 0) &&
										(strModel_a !== null && strModel_a.length > 0))
									{
										if (strPrompt_a.length > 0)
										{
											invokeChatGPT(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a, strPrompt_a);
										}
										else
										{
											startChatGPTInteractive(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a);
										}
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

chatgpt(api.commandline.slice(2).join(' '));
