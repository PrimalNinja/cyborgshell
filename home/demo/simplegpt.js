function chatgpt(strPrompt_a) 
{
	var m_PROVIDER = 'ai';	// lowercase for provider settings

	var m_DEFAULTTIMEOUT = 120;	// in seconds
	
	function invokeChatGPT(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a, strPrompt_a)
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
		
		function callChatGPT(strPrompt_a, cbInternal_a)
		{
			var arrMessages = [
				{
					role: 'user',
					content: strPrompt_a
				}
			];

			var objFlavour;
			var objHeaders;
			var objPayload;
			if (strFlavour.toLowerCase() === 'claude')
			{
				objPayload = {
					model: strModel_a,
					max_tokens: parseInt(strMaxTokens, 10),
					temperature: parseFloat(strTemperature),
					messages: arrMessages
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
				objPayload = {
					"contents": [
						{
							"role": "user",
							"parts": [
								{
									"text": strPrompt_a
								}
							]
						}
					],
					// Optional configuration can be added here
					"generationConfig": {
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

// if (strFlavour.toLowerCase() === 'claude') {
    // console.log('Claude request payload:', JSON.stringify(objPayload));
    // console.log('Claude headers:', objHeaders);
    // console.log('Claude endpoint:', strEndpoint);
// }
			
			var strResponse;
			$.ajax(objFlavour).done(function(objResponse_a) 
			{
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
					// Gemini response handling
					if (objResponse_a.candidates && objResponse_a.candidates.length > 0 && 
						objResponse_a.candidates[0].content && 
						objResponse_a.candidates[0].content.parts && 
						objResponse_a.candidates[0].content.parts.length > 0)
					{
						strResponse = objResponse_a.candidates[0].content.parts[0].text;
						cbInternal_a(null, strResponse);
					}
					else
					{
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
// if (strFlavour.toLowerCase() === 'claude') {
    // console.log('Claude error response:', objXHR_a.responseText);
    // console.log('Claude status code:', objXHR_a.status);
// }
			});
		}
		
		if (strPrompt_a && strPrompt_a.trim().length > 0)
		{
			callChatGPT(strPrompt_a.trim(), function(strError_a, strResponse_a)
			{
				if (strError_a)
				{
					api.print('Error: ' + strError_a);
				}
				else
				{
					api.print(strResponse_a);
				}
			});
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
										invokeChatGPT(strProvider_a, strAPIKey_a, strEndpoint_a, strFlavour_a, strModel_a, strMaxTokens_a, strTemperature_a, strProxy_a, strPrompt_a);
									} 
									else 
									{
										api.errorOutput(strProvider_a + ' is not configured.');
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
