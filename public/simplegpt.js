function chatgpt(strPrompt_a)
{
	var m_PROVIDER = 'ai';	// lowercase for provider settings

	var m_DEFAULTTIMEOUT = 120;	// in seconds

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

	function invokeChatGPT(strPrompt_a)
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
			invokeChatGPT(strPrompt_a);
		});
	});
}

chatgpt(api.commandline.slice(2).join(' '));
