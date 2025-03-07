function getGUID()
{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
	{
		var r = Math.random() * 16 | 0,
		v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function parentTabHandler(objOptions_a)
{
	var m_objThis = this;
	var m_objOptions = objOptions_a;
	var m_strHandlerID = getGUID();

	var m_arrTabs = [];
	m_arrTabs[0] =
	{
		"id" : "0",
		"caption" : 'Parent',
		"window" : m_objOptions.window,
		"opener" : null
	};
	var m_intNextTabID = 1;

	$(m_objOptions.window).bind('message', function (objEvent_a)
	{
		reAddTab(objEvent_a);
		reBroadcast(objEvent_a);

		if ($.isFunction(m_objOptions.cbOnBroadcast))
		{
			var objJSON = null;
			
	//console.log('before:parentTabHandler');
			try
			{
				objJSON = JSON.parse(objEvent_a.originalEvent.data);
			}
			catch (err)
			{
				// do nothing
			}
	//console.log('after1:parentTabHandler');

			if (objJSON !== null)
			{
				if (!(objJSON.queue == undefined))
				{
					m_objOptions.cbOnBroadcast(objJSON.queue, objJSON.message, objJSON.messagedata);
				}
			}
	//console.log('after2:parentTabHandler');
		}
	}
	);

	// ====================================================================================
	// HELPERS ============================================================================

	// re-add the source if they were removed (ie due to a parent tab refresh)
	function reAddTab(objEvent_a)
	{
		var strOrigin = objEvent_a.origin || objEvent_a.originalEvent.origin;
		var objSource = objEvent_a.source || objEvent_a.originalEvent.source;
		var objJSON = null;

//console.log('before:reAddTab');
		try
		{
			objJSON = JSON.parse(objEvent_a.originalEvent.data);
		}
		catch (err)
		{
			// do nothing
		}
//console.log('after1:reAddTab');

		if (objJSON !== null)
		{
			var blnReAdd = true;
			processArray(m_arrTabs, function (objTab_a)
			{
				//alert(objTab_a.id + ":" + objJSON.originid);
				if (objTab_a.id == objJSON.originid)
				{
					blnReAdd = false;
					return true;
				}
			}
			);

			if (blnReAdd)
			{
				//logDebug('parentTabHandler re-added: ' + objJSON.originid);
				var intTabID = m_intNextTabID;
				var objTab =
				{
					"id" : objJSON.originid,
					"caption" : objJSON.origindescription,
					"window" : null,
					"opener" : null
				};
				m_intNextTabID++;
				m_arrTabs[intTabID] = objTab;

				objTab.window = objSource;
			}
		}
//console.log('after2:reAddTab');
	}

	function reBroadcast(objEvent_a)
	{
		var objJSON = null;

//console.log('before:reBroadcast');
		try
		{
			objJSON = JSON.parse(objEvent_a.originalEvent.data);
		}
		catch (err)
		{
			// do nothing
		}
//console.log('after1:reBroadcast');

		if (objJSON !== null)
		{
			processArray(m_arrTabs, function (obj_a)
			{
				if ((obj_a.id !== "0") && (obj_a.id !== objJSON.originid))
				{
					var objJSONNew =
					{
						"tabid" : "0",
						"originid" : objJSON.originid,
						"origindescription" : objJSON.origindescription,
						"queue" : objJSON.queue,
						"message" : objJSON.message,
						"messagedata" : objJSON.messagedata
					};
					obj_a.window.postMessage(JSON.stringify(objJSONNew), '*');
				}
			}
			);
		}
//console.log('after2:reBroadcast');
	}

	// ====================================================================================
	// PUBLICS ============================================================================

	m_objThis.broadcast = function (strQueue_a, strMessage_a, objMessageData_a)
	{
		processArray(m_arrTabs, function (obj_a)
		{
			if (obj_a.id !== "0")
			{
				var objJSON =
				{
					"tabid" : "0",
					"originid" : "0",
					"origindescription" : m_arrTabs[0].caption,
					"queue" : strQueue_a,
					"message" : strMessage_a,
					"messagedata" : objMessageData_a
				};
				obj_a.window.postMessage(JSON.stringify(objJSON), '*');
			}
		}
		);
	};

	m_objThis.canCreateTab = function ()
	{
		return true;
	};

	m_objThis.createTab = function (strURL_a, strForm_a, strParameters_a)
	{
		var intTabID = m_intNextTabID;
		var strTabID = getGUID();

		var strForm = strForm_a;
		if (strForm === undefined)
		{
			strForm = '';
		}

		var strParameters = strParameters_a;
		if (strParameters === undefined)
		{
			strParameters = '';
		}

		var objTab =
		{
			"id" : strTabID,
			"caption" : 'Child (' + strTabID + ')',
			"window" : null,
			"opener" : null
		};
		m_intNextTabID++;
		m_arrTabs[intTabID] = objTab;

		objTab.window = window.open(strURL_a + '?tabid=' + objTab.id + strForm + strParameters, objTab.caption);
		return objTab.window;
	};

	m_objThis.getHandlerID = function ()
	{
		return m_strHandlerID;
	};

	m_objThis.getTabInfo = function (intTabID_a)
	{
		return m_arrTabs[intTabID_a];
	};

	m_objThis.getTabs = function ()
	{
		var arrResult = [];

		processArray(m_arrTabs, function (objTab_a)
		{
			arrResult.push(
			{
				"id" : objTab_a.id,
				"caption" : objTab_a.caption
			}
			);
		}
		);

		return arrResult;
	};

	m_objThis.ping = function ()
	{
		//logDebug('parent ping');
		m_objThis.broadcast('system', 'ping', 'ping');
	};
}

function hcJS_API(objGlobals_a)
{
	var m_objThis = this;
	var globals = objGlobals_a;

	// string functions
	
	this.getGuid = function()
	{
		return getGUID();
	};
	
	// debugging

	this.debugObject = function(obj_a, blnRecurse_a, strIndent_a) 
	{
		var blnRecurse = blnRecurse_a;
		var strIndent = strIndent_a;
		if (blnRecurse === undefined)
		{
			blnRecurse = true;
		}
		if (strIndent === undefined)
		{
			strIndent = '';
		}
		
		for (var strKey in obj_a) 
		{
			if (Object.prototype.hasOwnProperty.call(obj_a, strKey)) 
			{
				var strValue = obj_a[strKey];
				m_objThis.print(strIndent + strKey + ': ');
				if (typeof strValue === 'object' && strValue !== null) 
				{
					if (blnRecurse)
					{
						m_objThis.debugObject(strValue, blnRecurse, strIndent + ' ');
					}
					else
					{
						m_objThis.print(strIndent + ' ' + "Object");
					}
				} 
				else 
				{
					m_objThis.print(strIndent + ' ' + strValue);
				}
			}
		}
	};

	// screen functions
	
	this.cls = function()
	{
		globals.console.clearOutput();
	};
	
	this.print = function(str_a)
	{
		globals.console.appendOutput(str_a);
	};

	// tab functions
	this.getTabHandler = function(cb_a)
	{
		return new parentTabHandler({
			"cbOnBroadcast" : cb_a,
			"window" : window
		});
	};
}