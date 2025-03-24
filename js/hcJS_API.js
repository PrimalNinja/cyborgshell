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

	// utils
	
	function isFunction(fn_a)
	{
		var getType = {};
		return fn_a && getType.toString.call(fn_a) === '[object Function]';
	}

	function processArray(arr_a, cb_a)
	{
		if (arr_a !== null)
		{
			var intRowNum = 1;
			var intI = 0;
			var blnAbort = false;
			while ((!blnAbort) && (intI < arr_a.length))
			{
				if (arr_a[intI] !== undefined)
				{
					if (isFunction(cb_a))
					{
						blnAbort = cb_a(arr_a[intI], intRowNum, intI);
					}
				}
				intRowNum++;
				intI++;
			}
		}
	}

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
						m_objThis.print(strIndent + ' ' + "Object", false, true);
					}
				} 
				else 
				{
					m_objThis.print(strIndent + ' ' + strValue, false, true);
				}
			}
		}
	};

	// screen functions
	
	this.cls = function()
	{
		globals.console.clearOutput();
	};
	
	this.input = function(cb_a)
	{
		globals.console.input(cb_a);
	};
	
	this.print = function(str_a, blnForceLTR_a, blnReverseRTL_a)
	{
		globals.console.appendOutput(str_a, blnForceLTR_a, blnReverseRTL_a);
	};
	
	// flow
	this.stop = function()
	{
		globals.console.stop();
	}
	
	// language functions
	
	this.language = function(cb_a)
	{
		globals.console.handleServerCommands('language', 'nofiles', function(objResponse_a)
		{
			if (isFunction(cb_a))
			{
				cb_a(objResponse_a);
			}
		});
	};
	
	this.languages = function(cb_a)
	{
		globals.console.handleServerCommands('languages', 'nofiles', function(objResponse_a)
		{
			if (isFunction(cb_a))
			{
				cb_a(objResponse_a);
			}
		});
	};
	
	// file functions

	this.loadFile = function(strFilename_a, cb_a)
	{
		globals.console.loadFile(strFilename_a, function(objResponse_a)
		{
			if (isFunction(cb_a))
			{
				cb_a(objResponse_a);
			}
		});
	};
	
	this.saveFile = function(strFilename_a, objData_a, cb_a)
	{
		globals.console.saveFile(strFilename_a, objData_a, function(objResponse_a)
		{
			if (isFunction(cb_a))
			{
				cb_a(objResponse_a);
			}
		});
	};
	
	// data functions

	this.createDatabase = function()
	{
		if (globals.Indexes === undefined) 
		{
			globals.Indexes = {};
		}

		if (globals.Cursors === undefined) 
		{
			globals.Cursors = {};
		}


		if (globals.TableData === undefined) 
		{
			globals.TableData = {};
		}
	};

	this.appendTable = function(strTableName_a, arrJSON_a) 
	{
		if (!globals.TableData[strTableName_a]) 
		{
			globals.TableData[strTableName_a] = [];
		}
		globals.TableData[strTableName_a] = globals.TableData[strTableName_a].concat(arrJSON_a);
	};

	this.createIndex = function(strTableName_a, strFieldName_a, blnAscending_a) 
	{
		var objIndex = {};
		var strIndexName = strTableName_a + '__' + strFieldName_a;
		var arrJSON = globals.TableData[strTableName_a];

		if (arrJSON === undefined) 
		{
			m_objThis.print("Table " + strTableName_a + " not found.");
		} 
		else 
		{
			arrJSON.forEach(function(objRecord_a, intIndex_a) 
			{
				var strValue = objRecord_a[strFieldName_a];
				var strEscapedValue = m_objThis.escapeValue(strValue);

				if (!objIndex[strEscapedValue]) 
				{
					objIndex[strEscapedValue] = [intIndex_a];
				} 
				else 
				{
					objIndex[strEscapedValue].push(intIndex_a);
				}
			});

			// Sort the object properties
			var sortedObjIndex = {};
			if (blnAscending_a)
			{
				Object.keys(objIndex).sort().forEach(function(strKey_a) 
				{
					sortedObjIndex[strKey_a] = objIndex[strKey_a];
				});
			}
			else
			{
				Object.keys(objIndex).sort().reverse().forEach(function(strKey_a) 
				{
					sortedObjIndex[strKey_a] = objIndex[strKey_a];
				});
			}

			globals.Indexes[strIndexName] = { ascending: blnAscending_a, index: sortedObjIndex };
			globals.Cursors[strIndexName] = { cursor: -1, dataIndex: -1, indexed: true, value: "" };
		}
	};
	
	this.dropIndex = function(strTableName_a, strFieldName_a)
	{
		var strIndexName = strTableName_a + '__' + strFieldName_a;
		if (globals.Indexes[strIndexName]) 
		{
			delete globals.Indexes[strIndexName];
		}
	};

	this.escapeValue = function(strValue_a) 
	{
	  return strValue_a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	this.findData = function(strTableName_a, strFieldName_a, strValue_a) 
	{
		var blnAscending = true;
		var intIndex;
		var objCursor;
		var objResult;
		var strIndexName = strTableName_a + '__' + strFieldName_a;
		var arrJSON = globals.TableData[strTableName_a];
		var strValue = strValue_a;

		if (strValue === undefined) { strValue = ""; }

		if (arrJSON === undefined) 
		{
			m_objThis.print("Table " + strTableName_a + " not found.");
		}
		else
		{
			if (globals.Indexes[strIndexName]) 
			{
				if (strValue.length > 0) 
				{
					var strEscapedValue = this.escapeValue(strValue);
					//blnAscending = globals.Indexes[strIndexName].ascending;
					intIndex = globals.Indexes[strIndexName].index[strEscapedValue];
					if (intIndex !== undefined) 
					{
						objCursor = { cursor: 0, dataIndex: intIndex[0], indexed: true, value: strValue };
					} 
					else 
					{
						objCursor = { cursor: -1, dataIndex: -1, indexed: true, value: strValue };
					}
				} 
				else 
				{
					if (arrJSON.length > 0) 
					{
						blnAscending = globals.Indexes[strIndexName].ascending;
						var arrSortedKeys = [];
						if (blnAscending)
						{
							arrSortedKeys = Object.keys(globals.Indexes[strIndexName].index).sort();
						}
						else
						{
							arrSortedKeys = Object.keys(globals.Indexes[strIndexName].index).sort().reverse();
						}
						var intKey = arrSortedKeys[0];
						intIndex = globals.Indexes[strIndexName].index[intKey];
						objCursor = { cursor: 0, dataIndex: intIndex[0], indexed: true, value: "" };
					}
					else
					{
						objCursor = { cursor: -1, dataIndex: -1, indexed: false, value: strValue };
					}
				}
			} 
			else 
			{
				if (strValue.length > 0) 
				{
					intIndex = arrJSON.findIndex(function(objRecord_a) 
					{
						return objRecord_a[strFieldName_a] === strValue;
					});
					
					objCursor = { cursor: intIndex, dataIndex: intIndex, indexed: false, value: strValue };
				} 
				else 
				{
					if (arrJSON.length > 0) 
					{
						objCursor = { cursor: 0, dataIndex: 0, indexed: false, value: strValue };
					} 
					else 
					{
						objCursor = { cursor: -1, dataIndex: -1, indexed: false, value: strValue };
					}
				}
			}

			globals.Cursors[strIndexName] = objCursor;
			if (objCursor.dataIndex !== -1) 
			{
				objResult = globals.TableData[strTableName_a][objCursor.dataIndex];
			}
		}

		return objResult;
	};

	this.nextData = function(strTableName_a, strFieldName_a) 
	{ 
		var objResult;
		var strIndexName = strTableName_a + '__' + strFieldName_a;
		var arrJSON = globals.TableData[strTableName_a];
		var objCursor = globals.Cursors[strIndexName];

		if (arrJSON === undefined) 
		{
			m_objThis.print("Table " + strTableName_a + " not found.");
		}
		else if (objCursor === undefined) 
		{
			m_objThis.print("Cursor for " + strTableName_a + " not found.");
		}
		else
		{
			if (globals.Indexes[strIndexName]) 
			{
				var arrIndices = [];
				var intDataIndex = -1;
				var intNextIndex;
				var strValue = objCursor.value;
				if (strValue.length > 0)
				{
					var strEscapedValue = this.escapeValue(strValue);
					var intCurrentIndex = objCursor.cursor;
					arrIndices = globals.Indexes[strIndexName].index[strEscapedValue];
					intDataIndex = objCursor.dataIndex;

					if (arrIndices !== undefined) 
					{
						intNextIndex = arrIndices.indexOf(intDataIndex) + 1;
						if (intNextIndex >= arrIndices.length) 
						{
							objCursor = { cursor: -1, dataIndex: -1, indexed: true, value: strValue };
						} 
						else 
						{
							objCursor = { cursor: intCurrentIndex, dataIndex: arrIndices[intNextIndex], indexed: true, value: strValue };
						}
					} 
					else 
					{
						objCursor = { cursor: -1, dataIndex: -1, indexed: true, value: strValue };
					}
				}
				else
				{
					var objKeys = Object.keys(globals.Indexes[strIndexName].index);
					var intKeyIndex = 0;
					var intI = 0;
					intDataIndex = -1;
					intNextIndex = objCursor.cursor + 1;

					while ((intI < intNextIndex) && (intDataIndex < 0))
					{
						while ((intKeyIndex < objKeys.length) && (intDataIndex < 0))
						{
							var objKey = objKeys[intKeyIndex];
							arrIndices = globals.Indexes[strIndexName].index[objKey];
							for (var intJ = 0; intJ < arrIndices.length; intJ++) 
							{
								if (intI === intNextIndex) 
								{
									intDataIndex = arrIndices[intJ];
									break;
								} 
								else 
								{
									intI++;
								}
							}
							intKeyIndex++;
						}
					}
  
					if (intI < intNextIndex) 
					{
						objCursor = { cursor: -1, dataIndex: -1, indexed: true, value: "" };
					} 
					else 
					{
						objCursor = { cursor: intNextIndex, dataIndex: intDataIndex, indexed: true, value: "" };
					}
				}
			} 
			else 
			{
				var intIndex = arrJSON.findIndex(function(objRecord_a, intIndex_a) 
				{
					var intResult;
					if (objCursor.value.length > 0) 
					{
						intResult = intIndex_a > objCursor.cursor && objRecord_a[strFieldName_a] === objCursor.value;
					} 
					else 
					{
						intResult = intIndex_a > objCursor.cursor;
					}
					return intResult;
				});
				objCursor = { cursor: intIndex, dataIndex: intIndex, indexed: false, value: objCursor.value };
			}

			globals.Cursors[strIndexName] = objCursor;
			if (objCursor.dataIndex !== -1) 
			{
				objResult = globals.TableData[strTableName_a][objCursor.dataIndex];
			}
		}
		
		return objResult;
	};

	this.truncateTable = function(strTableName_a)
	{
		globals.TableData[strTableName_a] = [];
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