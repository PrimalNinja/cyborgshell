<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Tab</title>
		<script src="3p/jquery-3.7.1.min.js"></script>
	</head>
	<body>
		<script>
var m_CHILDTABPINGFREQUENCY = 10000;

this.createTimer = function (fnTimer_a, intFrequency_a, blnAutoStart_a)
{
	var strTimerID = 'timer_' + getGUID();
	var strHTML = '<div id="' + strTimerID + '" class="gb-hidden"></div>';
	m_objThis.element('#ge-timer-container').append(strHTML);

	var objTimer = null;
	
	try
	{
		objTimer = $.timer(onTimer, intFrequency_a, blnAutoStart_a);
		registerTimer(strTimerID, objTimer);
	}
	catch(err)
	{
		m_objThis.dialogAlert('Timer Error: ' + err, doNothing);
	}

	function onTimer()
	{
		if (($.isFunction(fnTimer_a)) && (intFrequency_a > 0))
		{
			objTimer.pause();
			fnTimer_a();
			objTimer.play();
		}
	}

	return strTimerID;
};

function getGUID()
{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
	{
		var r = Math.random() * 16 | 0,
		v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function childTabHandler(objOptions_a)
{
	var m_objThis = this;
	var m_objOptions = objOptions_a;
	var m_strHandlerID = getGUID();

	var m_objTab =
	{
		"id" : m_objOptions.id,
		"caption" : 'Child (' + m_objOptions.id + ')',
		"window" : m_objOptions.window,
		"opener" : m_objOptions.window.opener
	};

	$(m_objOptions.window).bind('message', function (objEvent_a)
	{
		if ($.isFunction(m_objOptions.cbOnBroadcast))
		{
			var objJSON = null;
			
	//console.log('before:childTabHandler');
			try
			{
				objJSON = JSON.parse(objEvent_a.originalEvent.data);
			}
			catch (err)
			{
				// do nothing
			}
	//console.log('after1:childTabHandler');

			if (objJSON !== null)
			{
				if (!(objJSON.queue == undefined))
				{
					m_objOptions.cbOnBroadcast(objJSON.queue, objJSON.message, objJSON.messagedata);
				}
			}
	//console.log('after2:childTabHandler');
		}
	}
	);

	// ====================================================================================
	// PUBLICS ============================================================================

	m_objThis.broadcast = function (strQueue_a, strMessage_a, objMessageData_a)
	{
		var objJSON =
		{
			"tabid" : m_objTab.id,
			"originid" : m_objTab.id,
			"origindescription" : m_objTab.caption,
			"queue" : strQueue_a,
			"message" : strMessage_a,
			"messagedata" : objMessageData_a
		};
		//alert('child broadcast:' + JSON.stringify(objJSON));
		m_objTab.opener.postMessage(JSON.stringify(objJSON), '*');
	};

	m_objThis.canCreateTab = function ()
	{
		return false;
	};

	m_objThis.getHandlerID = function ()
	{
		return m_strHandlerID;
	};

	m_objThis.getTabInfo = function ()
	{
		return m_objTab;
	};

	m_objThis.getTabs = function ()
	{
		return [
			{
				"id" : m_objTab.id,
				"caption" : m_objTab.caption
			}
		];
	};

	m_objThis.ping = function ()
	{
		//logDebug('child ping: ' + m_objTab.id);
		m_objThis.broadcast('system', 'ping', 'ping');
	};
}

var strTabID = urlParams.get('tabid');

var g_objTabHandler = new childTabHandler(
	{
		"id" : strTabID,
		"cbOnBroadcast" : function() {},
		"window" : window
	}
	);

var g_strChildTabPingTimerID = createTimer(g_objTabHandler.ping, m_CHILDTABPINGFREQUENCY, true);
		</script>
	</body>
</html>