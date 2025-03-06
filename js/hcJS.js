function hcJS(strInput_a, strOutput_a, blnShowStartupText_a)
{
	var m_objThis = this;
	var m_objInput = $(strInput_a);
	var m_objOutput = $(strOutput_a);
	var m_arrCurrentCode = [];

	var m_objAPI = new hcJS_API(strOutput_a);
	var m_objGlobals = {};

	var m_COOKIENAME = "hcjsdevicekey";
	var m_COOKIEEXPIRYDAYS = 365;
	var m_LINENUMBERWIDTH = 7;
	var m_INDENTTABCOUNT = 1;
	
	function scrollContainer()
	{
		setTimeout(function()
		{
			var divContainer = document.querySelector('#ge-container');
			divContainer.scrollTop = divContainer.scrollHeight - divContainer.clientHeight;
		}, 100);
	}

	this.onResize = function()
	{
		scrollContainer();
	};

	this.reset = function()
	{
		cmdReset();

		// bindings
		$(document.body).on('click', function()
		{
			m_objInput.focus();
		});

		m_objInput.on('keypress', function(objEvent_a)
		{
			inputCommand_onKeyPress(objEvent_a);
		});

		// utils
		function appendOutput(str_a)
		{
			//m_objOutput.append(str_a + '\n');
			m_objOutput.text($(strOutput_a).text() + str_a + '\n');
		}

		function build(arrCode_a, blnIndent_a)
		{
			var intIndent = 0;
			var intIndentOffsetPre = 0;
			var intIndentOffsetPost = 0;
			var strResult = '';

			processArray(arrCode_a, function(objLine_a)
			{
				if (strResult.length > 0)
				{
					strResult += '\r\n';
				}

				var strIndent = '';

				intIndentOffsetPre = getIndentOffset(objLine_a.lineCode, false);
				intIndentOffsetPost = getIndentOffset(objLine_a.lineCode, true);

				intIndent += intIndentOffsetPre;
				if (intIndent > 0)
				{
					strIndent = '\t'.repeat(intIndent);
				}

				var strLine = '';
				var strLineCode = objLine_a.lineCode.trim();
				if (strLineCode.length > 0)
				{
					strLine = strIndent + strLineCode;
				}
				strResult += strLine;
				//appendOutput(strLine);

				intIndent += intIndentOffsetPost;
			});

			return strResult;
		}

		function clearInput()
		{
			m_objInput.val('');
		}

		function clearOutput()
		{
			m_objOutput.html('');
		}

		function deleteCookie(strCookieName_a)
		{
			document.cookie = strCookieName_a + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
		}

		function findLine(arrCode_a, intLineNumber_a)
		{
			var intResult = -1; // index of line number within the array, return -1 for not found
			var intIndex = 0;

			processArray(arrCode_a, function(objLine_a)
			{
				if (objLine_a.lineNumber === intLineNumber_a)
				{
					intResult = intIndex;
					//return true;
				}

				intIndex++;
			});

			return intResult;
		}

		function getCookie(strCookieName_a)
		{
			var strCookieName = strCookieName_a + "=";
			var arrCookies = document.cookie.split(';');
			var strResult = "";

			for (var intI = 0; intI < arrCookies.length; intI++)
			{
				var strCookie = arrCookies[intI];
				while (strCookie.charAt(0) === " ")
				{
					strCookie = strCookie.substring(1);
				}

				if (strCookie.indexOf(strCookieName) === 0)
				{
					strResult = strCookie.substring(strCookieName.length);
					break;
				}
			}

			return strResult;
		}

		function getIndentOffset(strCode_a, blnPost_a)	// HERE
		{
			var intResult = 0;
			var strCode = strCode_a.trim();

			if (strCode.slice(0, 2) !== '//')
			{
				if ((strCode.slice(-1) === '{') ||
				(strCode.slice(-1) === '[') ||
				(strCode === "("))
				{
					if (blnPost_a)
					{
						intResult = m_INDENTTABCOUNT;
					}
				}
				else if ((strCode === "}") ||
				(strCode === ")") ||
				(strCode === "};") ||
				(strCode === "];") ||
				(strCode === "}];") ||
				(strCode === "});") ||

				//(strCode.slice(-1) === ',') ||
				(strCode.slice(-1) === ']') ||

				(strCode.slice(-2) === '}]') ||

				(strCode.slice(0, 2) === '},') ||
				(strCode.slice(0, 2) === '],') ||
				(strCode.slice(0, 3) === '}],'))
				{
					if (!blnPost_a)
					{
						intResult = -m_INDENTTABCOUNT;
					}
				}
			}

			return intResult;
		}

		function getNewLine(strInput_a)
		{
			var arrParts = strInput_a.split(' ');
			var strResult = '';
			var blnSkip = true;	// skip the line number from the input parts
			processArray(arrParts, function(strPart_a)
			{
				if (blnSkip)
				{
					blnSkip = false;
				}
				else
				{
					if (strResult.length > 0)
					{
						strResult += ' ';
					}

					strResult += strPart_a;
				}
			});

			return strResult;
		}

		function isFunction(fn_a)
		{
			var getType = {};
			return fn_a && getType.toString.call(fn_a) === '[object Function]';
		}

		//	<no parameters> list all ine numbers
		//	10-20 is a range from and to for which to list line numbers
		//	10 is an absolute line number to list
		//	10- is from which line number to list to the end
		//	-20 is up to which line number to list from the start
		function parseRange(strSelection_a)
		{
			var objResult = {};

			if (strSelection_a)
			{
				var intDashIndex = strSelection_a.indexOf('-');

				if ((intDashIndex !== -1) && (intDashIndex !== strSelection_a.length - 1))
				{
					var arrParts = strSelection_a.split('-');
					objResult.from = parseInt(arrParts[0], 10);
					objResult.to = parseInt(arrParts[1], 10);
				}
				else if (strSelection_a.charAt(0) === '-')
				{
					objResult.from = -Infinity;
					objResult.to = parseInt(strSelection_a.substring(1), 10);
				}
				else if (strSelection_a.charAt(strSelection_a.length - 1) === '-')
				{
					objResult.from = parseInt(strSelection_a.substring(0, strSelection_a.length - 1), 10);
					objResult.to = Infinity;
				}
				else
				{
					objResult.from = parseInt(strSelection_a, 10);
					objResult.to = parseInt(strSelection_a, 10);
				}
			}
			else
			{
				objResult.from = -Infinity;
				objResult.to = Infinity;
			}

			return objResult;
		}

		function padWithSpaces(int_a, intLength_a)
		{
			return int_a.toString().padStart(intLength_a, " ");
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

		function ready(strFrom_a)
		{
			//appendOutput("Ready: " + strFrom_a);	// for debugging
			appendOutput("Ready");
			scrollContainer();
		}

		function runJS(strCode_a)
		{
			try
			{
				var strCode = '(function(api, globals){' + strCode_a + '})(m_objAPI, m_objGlobals);';
				eval(strCode);
				ready('runJS');
			}
			catch (objException_a)
			{
				appendOutput("Error: " + objException_a.message);
				scrollContainer();
			}
		}

		function setCookie(strCookieName_a, strValue_a, intExpiryDays_a)
		{
			var strCookie = "";
			var strExpiry = "";

			if (intExpiryDays_a)
			{
				var objDate = new Date();
				objDate.setTime(objDate.getTime() + (intExpiryDays_a * 24 * 60 * 60 * 1000));
				strExpiry = "; expires=" + objDate.toUTCString();
			}

			strCookie = strCookieName_a + "=" + (strValue_a || "") + strExpiry + "; path=/";
			document.cookie = strCookie;
		}

		function unbuild(strCode_a)
		{
			var arrCode = strCode_a.split('\n');
			var arrResult = [];

			var intLineIndex = 1;
			var intLineNumber = 10;
			processArray(arrCode, function(strCode_a)
			{
				var strCode = strCode_a.trim();
				if (!((intLineIndex === arrCode.length) && (strCode.length === 0)))
				{
					arrResult.push({
						lineNumber: intLineNumber,
						lineCode: strCode
					});

					intLineNumber += 10;
					intLineIndex++;
				}
			});

			return arrResult;
		}

		// event handlers
		function inputCommand_onKeyPress(objEvent_a)
		{
			if (objEvent_a.which === 13)
			{
				var strCommand = m_objInput.val();
				appendOutput(strCommand);
				processCommand(strCommand);
				clearInput();
			}
		}

		// commands
		function cmdAddReplaceDeleteLine(intLineNumber_a, strInput_a)
		{
			var arrParts;
			var strNewLine = '';
			var intLineIndex = findLine(m_arrCurrentCode, intLineNumber_a);
			if (intLineIndex >= 0)
			{
				arrParts = strInput_a.split(' ');

				if (arrParts.length > 1)
				{
					// replace a line
					strNewLine = getNewLine(strInput_a);
					if (strNewLine.trim().length > 0)
					{
						m_arrCurrentCode[intLineIndex].lineCode = strNewLine;
					}
					ready('cmdAddReplaceDeleteLine');
				}
				else
				{
					// delete a line
					m_arrCurrentCode.splice(intLineIndex, 1);
					ready('cmdAddReplaceDeleteLine');
				}
			}
			else
			{
				// adding a new line
				strNewLine = getNewLine(strInput_a);
				if (strNewLine.trim().length > 0)
				{
					m_arrCurrentCode.push({
						lineNumber: intLineNumber_a,
						lineCode: strNewLine
					});
				}

				// sort the lines
				m_arrCurrentCode.sort(function(a, b)
				{
					return a.lineNumber - b.lineNumber;
				});

				ready('cmdAddReplaceDeleteLine');
			}
		}

		function cmdBeautify()
		{
			var strJSON = build(m_arrCurrentCode, false);
			
			try
			{
				var arrJSON = JSON.parse(strJSON);
				strJSON = JSON.stringify(arrJSON, null, 2);
				m_arrCurrentCode = unbuild(strJSON);
			}
			catch (objException_a)
			{
				appendOutput("Error: " + objException_a.message);
			}
			ready('cmdBeautify');
		}
		
		function cmdCLS()
		{
			clearOutput();
			ready('cmdCLS');
		}

		function cmdEdit(arrParams_a)
		{
			var intLineNumber = parseInt(arrParams_a[1], 10);

			if (!isNaN(intLineNumber) && intLineNumber > 0)
			{
				editLine(intLineNumber);
			}
			else
			{
				appendOutput("Invalid line number.");
				ready('cmdEdit');
			}
		}

		function cmdList(arrCurrentCode_a, strSelection_a)
		{
			var intIndent = 0;
			var intIndentOffsetPre = 0;
			var intIndentOffsetPost = 0;

			if (arrCurrentCode_a.length > 0)
			{
				var objRange = parseRange(strSelection_a);

				processArray(arrCurrentCode_a, function(objLine_a)
				{
					var blnContinue = true;
					var intLineNumber = objLine_a.lineNumber;

					if ((objRange.from !== -Infinity) && (intLineNumber < objRange.from))
					{
						blnContinue = false;
					}

					if ((objRange.to !== Infinity) && (intLineNumber > objRange.to))
					{
						blnContinue = false;
					}

					if (blnContinue)
					{
						var strIndent = '';

						intIndentOffsetPre = getIndentOffset(objLine_a.lineCode, false);
						intIndentOffsetPost = getIndentOffset(objLine_a.lineCode, true);

						intIndent += intIndentOffsetPre;
						if (intIndent > 0)
						{
							strIndent = '\t'.repeat(intIndent);
						}

						var strLineNumber = padWithSpaces(intLineNumber, m_LINENUMBERWIDTH);
						var strLine = '';
						var strLineCode = objLine_a.lineCode.trim();
						if (strLineCode.length > 0)
						{
							strLine = strLineNumber + '\t' + strIndent + strLineCode;
						}
						else
						{
							strLine = strLineNumber;
						}
						appendOutput(strLine);

						intIndent += intIndentOffsetPost;
					}
				});
			}
			ready('cmdList');
		}

		function cmdNew()
		{
			m_arrCurrentCode = [];
			ready('cmdNew');
		}

		function cmdRenum()
		{
			m_arrCurrentCode = unbuild(build(m_arrCurrentCode, false));
			ready('cmdRenum');
		}

		function cmdReset()
		{
			clearInput();
			clearOutput();

			if (blnShowStartupText_a)
			{
				processCommand('startup');
			}
			else
			{
				cmdValidateCookie();
			}
		}

		function cmdRun(arrParams_a)
		{
			var blnImmediate = true;
			var strBuild = '';

			if (arrParams_a.length > 1)
			{
				var strFilename = arrParams_a[1].trim();
				if (strFilename.length > 0)
				{
					blnImmediate = false;
					loadFile(strFilename, function(objResponse_a)
					{
						m_arrCurrentCode = unbuild(objResponse_a.content);
						strBuild = build(m_arrCurrentCode, false);
						runJS(strBuild);
					});
				}
			}

			if (blnImmediate)
			{
				strBuild = build(m_arrCurrentCode, false);
				runJS(strBuild);
			}
		}

		function cmdType(arrParams_a)
		{
			var blnImmediate = true;

			if (arrParams_a.length > 1)
			{
				var strFilename = arrParams_a[1].trim();
				var strSelection = arrParams_a[2];

				if (strFilename.length > 0)
				{
					loadFile(strFilename, function(objResponse_a)
					{
						blnImmediate = false;
						var arrCurrentCode = unbuild(objResponse_a.content);
						cmdList(arrCurrentCode, strSelection);
					});
				}
			}

			if (blnImmediate)
			{
				ready('cmdType');
			}
		}

		function cmdValidateCookie()
		{
			var strCookie = getCookie(m_COOKIENAME);
			var strCommand = 'validatecookie ' + strCookie;

			if (strCookie.length > 0)
			{
				processCommand(strCommand);
			}
			else
			{
				appendOutput("You are not currently logged in.");
				ready();
			}
		}

		// callbacks
		function cbLogin(objResponse_a)
		{
			setCookie(m_COOKIENAME, objResponse_a.devicekey, m_COOKIEEXPIRYDAYS);
			cmdValidateCookie();
		}

		function cbStartup(objResponse_a)
		{
			if (objResponse_a.content.length > 0)
			{
				appendOutput(objResponse_a.content);
			}
			cmdValidateCookie();
		}

		// command processors
		function processCommand(strInput_a, cb_a)
		{
			var arrParams = strInput_a.split(' ');
			var strCommand = arrParams[0];
			var intLineNumber = parseInt(strCommand, 10);

			if (strCommand.trim().length === 0)
			{
				appendOutput("");
			}
			else if (!isNaN(intLineNumber))
			{
				// we are adding, replace or deleting a line
				cmdAddReplaceDeleteLine(intLineNumber, strInput_a);
			}
			else
			{
				// we are processing another command
				switch (strCommand)
				{
					case 'beautify':	// file or internal
					if (arrParams.length === 1)
					{
						cmdBeautify();
					}
					else
					{
						handleServerCommands(strInput_a, '1file');
					}
					break;
					
					case 'clear':
					case 'cls':
					cmdCLS();
					break;

					case 'ed':
					case 'edit':
					cmdEdit(arrParams);
					break;

					case 'list':
					var strSelection = arrParams[1];
					cmdList(m_arrCurrentCode, strSelection);
					break;

					case 'new':
					cmdNew();
					break;

					case 'renum':
					cmdRenum();
					break;

					case 'reset':
					cmdReset();
					break;

					case 'run':
					cmdRun(arrParams);
					break;

					case 'type':
					cmdType(arrParams);
					break;

					case 'startup':		// general
					handleServerCommands(strInput_a, '1file', cbStartup, true);
					break;

					case 'login':		// account
					handleServerCommands(strInput_a, 'nofiles', cbLogin, true);
					break;

					case 'device':		// general
					case 'devices':		// general

					case 'cat':			// file
					case 'dir':			// file
					case 'files':		// file
					case 'ls':			// file

					case 'spaces':		// file

					case 'about':		// account
					case 'admins':		// account
					case 'alias':		// account
					case 'chpwd':		// account
					case 'password':	// account
					case 'logout':		// account
					case 'offline':		// account
					case 'online':		// account
					case 'register':	// account
					case 'username':	// account
					case 'users':		// account
					case 'validatecookie':// account

					case 'grant':		// sharing
					case 'keys':		// sharing
					case 'newkey':		// sharing
					case 'revoke':		// sharing
					case 'shares':		// sharing
					handleServerCommands(strInput_a, 'nofiles');
					break;

					case 'cd':			// file
					case 'chdir':		// file
					case 'cs':			// file

					case 'del':			// file
					case 'delete':		// file
					case 'era':			// file

					case 'help':		// file
					case 'load':		// file
					case 'save':		// file
					case 'space':		// file
					handleServerCommands(strInput_a, '1file');
					break;

					case 'copy':		// file
					case 'cp':			// file

					case 'mv':			// file
					case 'ren':			// file
					case 'rename':		// file
					handleServerCommands(strInput_a, '2files');
					break;

					default:
					runJS(strInput_a);
					break;
				}
			}
		}

		// handle server commands
		function handleServerCommands(strInput_a, strType_a, cb_a, blnSuppressReady_a)
		{
			var strBuild = '';
			var strF1 = '';
			var strF2 = '';
			var strP1 = '';
			var strP2 = '';
			var strP3 = '';
			var strR = '';	// remainder after parameters
			var blnSuppressReady = blnSuppressReady_a;
			if (blnSuppressReady === undefined) { blnSuppressReady = false; }
			
			var arrInput = strInput_a.split(' ');

			intRFrom = 0; // create strR from...
			if (strType_a === '1file')
			{
				strF1 = arrInput[1] || '';
				strP1 = arrInput[2] || '';
				strP2 = arrInput[3] || '';
				strP3 = arrInput[4] || '';
				intRFrom = 5;
			}
			else if (strType_a === '2files')
			{
				strF1 = arrInput[1] || '';
				strF2 = arrInput[2] || '';
				strP1 = arrInput[3] || '';
				strP2 = arrInput[4] || '';
				strP3 = arrInput[5] || '';
				intRFrom = 6;
			}
			else if (strType_a === 'nofiles')
			{
				strP1 = arrInput[1] || '';
				strP2 = arrInput[2] || '';
				strP3 = arrInput[3] || '';
				intRFrom = 4;
			}
			
			// create remainder
			var intR = 0;
			processArray(arrInput, function(str_a)
			{
				if (intR >= intRFrom)
				{
					if (strR.length > 0)
					{
						strR += ' ';
					}
					strR += str_a;
				}
				intR++;
			});

			if (strInput_a.startsWith('save '))
			{
				strBuild = build(m_arrCurrentCode, true);
			}

			$.post('', { commandline: strInput_a, f1: strF1, f2: strF2, p1: strP1, p2: strP2, p3: strP3, r: strR, content: strBuild }, function(strResponse_a)
			{
//alert(strResponse_a);
				var objResponseJSON = JSON.parse(strResponse_a);

				// standard actions
				if (objResponseJSON.action === 'invalidate')
				{
					deleteCookie(m_COOKIENAME);
				}

				if (objResponseJSON.error.length > 0)
				{
					appendOutput(objResponseJSON.error);
				}
				else if (objResponseJSON.message.length > 0)
				{
					appendOutput(objResponseJSON.message);
				}
				else
				{
					if (strInput_a.startsWith('load '))
					{
						strBuild = objResponseJSON.content;
						m_arrCurrentCode = unbuild(strBuild);
					}
				}

				if (isFunction(cb_a))
				{
					cb_a(objResponseJSON);
				}

				if (!blnSuppressReady)
				{
					ready('handleServerCommands:' + strInput_a);
				}
			});
		}

		// command support
		function editLine(intLineNumber_a)
		{
			var intLineIndex = findLine(m_arrCurrentCode, intLineNumber_a);

			if (intLineIndex >= 0)
			{
				var strLineCode = intLineNumber_a + ' ' + m_arrCurrentCode[intLineIndex].lineCode.replace(/[ \r\n]+$/, '');
				setTimeout(function() 
				{ 
					scrollContainer();
					m_objInput.val(strLineCode); 
				}, 0);
				// var strNewLine = prompt("Edit line " + intLineNumber_a + ":", strLineCode);
				// if (strNewLine !== null)
				// {
					// m_arrCurrentCode[intLineIndex].lineCode = strNewLine;
					// ready('editLine');
				// }
			}
			else
			{
				appendOutput("Line number out of range.");
			}
		}

		// used by commands that need to perform a load before executing
		function loadFile(strFilename_a, cb_a)
		{
			$.post('', { commandline: 'load', f1: strFilename_a, f2: '', p1: '', p2: '', p3: '', r: '' }, function(strResponse_a)
			{
				var objResponseJSON = JSON.parse(strResponse_a);

				// standard actions
				if (objResponseJSON.action === 'invalidate')
				{
					deleteCookie(m_COOKIENAME);
				}

				if (objResponseJSON.error.length > 0)
				{
					appendOutput(objResponseJSON.error);
				}
				else if (objResponseJSON.message.length > 0)
				{
					appendOutput(objResponseJSON.message);
				}
				else
				{
					if (strInput_a.startsWith('load '))
					{
						strBuild = objResponseJSON.content;
						m_arrCurrentCode = unbuild(strBuild);

						ready('loadFile');
					}
				}

				if (isFunction(cb_a))
				{
					cb_a(objResponseJSON);
				}
			});
		}
	};
}