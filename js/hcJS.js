function hcJS(strContainer_a, strInput_a, strOutput_a, blnShowStartupText_a)
{
	var m_COOKIENAME = "hcjsdevicekey";
	var m_COOKIEEXPIRYDAYS = 365;
	var m_FILENUMBERWIDTH = 3;
	var m_LINENUMBERWIDTH = 7;
	var m_INDENTTABCOUNT = 1;
	var m_NEWFILENAME = 'Unnamed File';
	
	var m_objThis = this;
	var m_objContainer = $(strContainer_a);
	var m_objInput = $(strInput_a);
	var m_objOutput = $(strOutput_a);

	var m_blnInputMode = false;
	var m_cbInput = null;
	var m_blnShowStartupText = blnShowStartupText_a;

	var m_intFiles = 1;
	var m_intCurrentFile = 0;
	var m_arrFiles = [{
		cd: [],				// code
		fn: m_NEWFILENAME,	// filename
		dt: false			// dirty flag
	}];	// 1 file by default
	var m_arrOutput = [];
	var m_objG = {};		// globals
	var m_blnRTL = false;
	m_objG.console = m_objThis;

	var m_objAPI = new hcJS_API(m_objG);

	// utils
	function appendOutput(str_a, blnForceLTR_a, blnReverseRTL_a)
	{
		var blnForceLTR = blnForceLTR_a;
		if (blnForceLTR === undefined) { blnForceLTR = false; }
		
		var blnReverseRTL = blnReverseRTL_a;
		if (blnReverseRTL === undefined) { blnReverseRTL = false; }
		
		m_arrOutput.push({
			rtl: m_blnRTL && !blnForceLTR,
			reverse: blnReverseRTL,
			output: str_a
		});
		
		var strHtml = "";
		m_objOutput.html("");
		
		processArray(m_arrOutput, function(objOutput_a)
		{
			var strRTLClass = "";
			if (objOutput_a.rtl)
			{
				strRTLClass = "rtlo";
			}
			
			var strOutput = objOutput_a.output;
			if ((objOutput_a.reverse) && (objOutput_a.rtl))
			{
				strOutput = reverseOutput(strOutput);
			}
			strHtml += '<div class="' + strRTLClass  + '">' + escapeHTML(strOutput) + '</div>';
		});
		
		m_objOutput.html(strHtml);
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
		m_arrOutput = [];
		m_objOutput.html('');
	}

	function deleteCookie(strCookieName_a)
	{
		document.cookie = strCookieName_a + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	}

	// command support
	function editLine(intLineNumber_a)
	{
		var intLineIndex = findLine(m_arrFiles[m_intCurrentFile].cd, intLineNumber_a);

		if (intLineIndex >= 0)
		{
			var strLineCode = intLineNumber_a + ' ' + m_arrFiles[m_intCurrentFile].cd[intLineIndex].lineCode.replace(/[ \r\n]+$/, '');
			m_arrFiles[m_intCurrentFile].dt = true;
			setTimeout(function() 
			{ 
				scrollContainer();
				m_objInput.val(strLineCode); 
			}, 0);
		}
		else
		{
			appendOutput("Line number out of range.", false, true);
		}
	}

	function escapeHTML(str_a) 
	{
		var strResult = str_a;
		
		strResult = str_replace(strResult, "&", "&amp;");
		strResult = str_replace(strResult, "<", "&lt;");
		strResult = str_replace(strResult, ">", "&gt;");
		strResult = str_replace(strResult, '"', "&quot;");
		strResult = str_replace(strResult, "'", "&#39;");
		
		return strResult;
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

	function getCharWidth() 
	{
		var strTempSpan = $('<span>').css({
			'font-family': m_objOutput.css('font-family'),
			'font-size': m_objOutput.css('font-size'),
			'visibility': 'hidden'
		}).text('W');

		m_objOutput.append(strTempSpan);
		var intCharWidth = strTempSpan.width();
		strTempSpan.remove();

		var intDivWidth = m_objOutput.width();
		return Math.floor(intDivWidth / intCharWidth);
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

	function getIndentOffset(strCode_a, blnPost_a)
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

	// handle server commands
	function handleServerCommands(strInput_a, intFileCount_a, cb_a, blnSuppressReady_a, blnSuppressMessage_a, blnSuppressError_a, blnLoadProgram_a, blnSaveProgram_a)
	{
		var strF1 = '';
		var strF2 = '';
		var strP1 = '';
		var strP2 = '';
		var strP3 = '';
		var strR = '';	// remainder after parameters
		var strContent = '';
	
		var blnSuppressReady = blnSuppressReady_a;
		if (blnSuppressReady === undefined) { blnSuppressReady = false; }
		
		var blnLoadProgram = blnLoadProgram_a;
		if (blnLoadProgram === undefined) { blnLoadProgram = false; }
		
		var blnSaveProgram = blnSaveProgram_a;
		if (blnSaveProgram === undefined) { blnSaveProgram = false; }
		
		var blnSuppressMessage = blnSuppressMessage_a;
		if (blnSuppressMessage === undefined) { blnSuppressMessage = false; }
		
		var blnSuppressError = blnSuppressError_a;
		if (blnSuppressError === undefined) { blnSuppressError = false; }
		
		var arrInput = strInput_a.split(' ');

		intRFrom = 0; // create strR from...
		if (intFileCount_a === 1)
		{
			strF1 = arrInput[1] || '';
			strP1 = arrInput[2] || '';
			strP2 = arrInput[3] || '';
			strP3 = arrInput[4] || '';
			intRFrom = 5;
		}
		else if (intFileCount_a === 2)
		{
			strF1 = arrInput[1] || '';
			strF2 = arrInput[2] || '';
			strP1 = arrInput[3] || '';
			strP2 = arrInput[4] || '';
			strP3 = arrInput[5] || '';
			intRFrom = 6;
		}
		else if (intFileCount_a === 0)
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

		if (blnSaveProgram)
		{
			strContent = build(m_arrFiles[m_intCurrentFile].cd, true);
			m_arrFiles[m_intCurrentFile].fn = strF1;
		}

		// commandline: '', f1: '', f2: '', p1: '', p2: '', p3: '', r: '', content: ''
		$.post('', { commandline: strInput_a, f1: strF1, f2: strF2, p1: strP1, p2: strP2, p3: strP3, r: strR, content: strContent }, function(strResponse_a)
		{
//alert(strResponse_a);
			var objResponseJSON = JSON.parse(strResponse_a);

			// standard actions
			if (objResponseJSON.actions.includes('invalidate'))
			{
				deleteCookie(m_COOKIENAME);
			}
			
			if (objResponseJSON.actions.includes('ltr'))
			{
				cmdLTR(false);
			}
			
			if (objResponseJSON.actions.includes('rtl'))
			{
				cmdRTL(false);
			}

			if (!blnSuppressError && objResponseJSON.error.length > 0)
			{
				appendOutput(objResponseJSON.error, false);
			}
			
			if (!blnSuppressMessage && objResponseJSON.message.length > 0)
			{
				if (strInput_a.startsWith('help'))
				{
					appendOutput(objResponseJSON.message, false);
				}
				else if ((strInput_a.startsWith('cat')) || (strInput_a.startsWith('dir')) || (strInput_a.startsWith('ls')))
				{
					appendOutput(objResponseJSON.message, false);
					appendOutput(objResponseJSON.content, false);
				}
				else
				{
					appendOutput(objResponseJSON.message, false);
				}
			}
			
			if (blnLoadProgram)
			{
				strContent = objResponseJSON.content;
				m_arrFiles[m_intCurrentFile].cd = unbuild(strContent);
				m_arrFiles[m_intCurrentFile].fn = strF1;
				m_arrFiles[m_intCurrentFile].dt = false;
			}

			if (blnSaveProgram && objResponseJSON.error.length === 0)
			{
				m_arrFiles[m_intCurrentFile].dt = false;
			}

			if (isFunction(cb_a))
			{
				cb_a(objResponseJSON);
			}

			if (!blnSuppressReady)
			{
				ready();
			}
		});
	}

	function isFunction(fn_a)
	{
		var getType = {};
		return fn_a && getType.toString.call(fn_a) === '[object Function]';
	}

	// used by commands that need to perform a load before executing
	function loadFile(strFilename_a, cb_a)
	{
		var strFilename = strFilename_a;
		
		// commandline: '', f1: '', f2: '', p1: '', p2: '', p3: '', r: '', content: ''
		$.post('', { commandline: 'load', f1: strFilename, f2: '', p1: '', p2: '', p3: '', r: '', content: '' }, function(strResponse_a)
		{
			var objResponseJSON = JSON.parse(strResponse_a);

			// standard actions
			if (objResponseJSON.actions.includes('invalidate'))
			{
				deleteCookie(m_COOKIENAME);
			}
			
			if (isFunction(cb_a))
			{
				cb_a(objResponseJSON);
			}
		});
	}

	function loadProgram(strFilename_a, cb_a)
	{
		loadFile(strFilename_a, function(objResponseJSON_a)
		{
			if (objResponseJSON_a.actions.includes('ltr'))
			{
				cmdLTR(false);
			}
			
			if (objResponseJSON_a.actions.includes('rtl'))
			{
				cmdRTL(false);
			}

			if (objResponseJSON_a.error.length > 0)
			{
				appendOutput(objResponseJSON_a.error, false);
			}
			
			if (objResponseJSON_a.message.length > 0)
			{
				appendOutput(objResponseJSON_a.message, false);
			}

			if (isFunction(cb_a))
			{
				cb_a(objResponseJSON_a);
			}
		});
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
		appendOutput("Ready", false, true);
		scrollContainer();
	}

	function reverseOutput(str_a)
	{
		var strResult = str_a;
		var arrLines = strResult.split("\n");
		var intLine = 0;
		processArray(arrLines, function(strLine_a)
		{
			var strLine = strLine_a;
			var arr = strLine.split("").reverse();
			var intLen = arr.length;

			for (var intI = 0; intI < intLen; intI++) 
			{
				switch (arr[intI]) 
				{
					case "(":
					arr[intI] = ")";
					break;
					case ")":
					arr[intI] = "(";
					break;
					case "[":
					arr[intI] = "]";
					break;
					case "]":
					arr[intI] = "[";
					break;
					case "{":
					arr[intI] = "}";
					break;
					case "}":
					arr[intI] = "{";
					break;
					default:
					break;
				}
			}

			strLine = arr.join("");
			arrLines[intLine] = strLine;
			intLine++;
		});
		
		strResult = strLine = arrLines.join("\n");
		
		return strResult;
	}
	
	function runJS(strCode_a)
	{
		try
		{
			var strCode = '(function(api, globals){' + strCode_a + '})(m_objAPI, m_objG);';
			eval(strCode);
			//ready();
		}
		catch (objException_a)
		{
			appendOutput("Error: " + objException_a.message, false, true);
			scrollContainer();
		}
	}
	
	function saveFile(strFilename_a, objData_a, cb_a)
	{
		var strFilename = strFilename_a;
		
		// commandline: '', f1: '', f2: '', p1: '', p2: '', p3: '', r: '', content: ''
		$.post('', { commandline: 'save', f1: strFilename, f2: '', p1: '', p2: '', p3: '', r: '', content: objData_a }, function(strResponse_a)
		{
			var objResponseJSON = JSON.parse(strResponse_a);

			// standard actions
			if (objResponseJSON.actions.includes('invalidate'))
			{
				deleteCookie(m_COOKIENAME);
			}
			
			if (isFunction(cb_a))
			{
				cb_a(objResponseJSON);
			}
		});
	}

	function scrollContainer()
	{
		setTimeout(function()
		{
			var divContainer = document.querySelector('#ge-container');
			divContainer.scrollTop = divContainer.scrollHeight - divContainer.clientHeight;
		}, 100);
	}

	function str_replace(str_a, strOld_a, strNew_a)
	{
		var blnSubset = false;
		var strOld = strOld_a + '';	// force them to strings
		var strNew = strNew_a + '';	// force them to strings
		var strResult = str_a + '';	// force them to strings

		if (strOld === undefined)
		{
			strOld = '';
		}

		if (strNew === undefined)
		{
			strNew = '';
		}

		if (strResult === undefined)
		{
			strResult = '';
		}

		// if the old is a subset of the new, we would get into an infinite loop, so we need ot make it temporarily not a subset
		if (strNew.indexOf(strOld) >= 0)
		{
			strNew = str_replace(strNew, strOld, '__OLD__');
			blnSubset = true;
		}

		while (strResult.indexOf(strOld) >= 0)
		{
			strResult = strResult.replace(strOld, strNew);
		}

		// if we had a subset, revert it
		if (blnSubset)
		{
			strResult = str_replace(strResult, '__OLD__', strOld);
		}

		return strResult;
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
			if (m_blnInputMode)
			{
				var strInput = m_objInput.val();
				if ($.isFunction(m_cbInput))
				{
					m_cbInput(strInput);
				}

				m_objInput.val('');
				m_cbInput = null;
				m_blnInputMode = false;
			}
			else
			{
				var strCommand = m_objInput.val();
				appendOutput(strCommand, false, true);
				processCommand(strCommand);
				clearInput();
			}
		}
	}

	// commands
	function cmdAddReplaceDeleteLine(intLineNumber_a, strInput_a)
	{
		var arrParts;
		var strNewLine = '';
		var intLineIndex = findLine(m_arrFiles[m_intCurrentFile].cd, intLineNumber_a);
		if (intLineIndex >= 0)
		{
			arrParts = strInput_a.split(' ');

			if (arrParts.length > 1)
			{
				// replace a line
				strNewLine = getNewLine(strInput_a);
				if (strNewLine.trim().length > 0)
				{
					m_arrFiles[m_intCurrentFile].cd[intLineIndex].lineCode = strNewLine;
					m_arrFiles[m_intCurrentFile].dt = true;
				}
				ready();
			}
			else
			{
				// delete a line
				m_arrFiles[m_intCurrentFile].cd.splice(intLineIndex, 1);
				m_arrFiles[m_intCurrentFile].dt = true;
				ready();
			}
		}
		else
		{
			// adding a new line
			strNewLine = getNewLine(strInput_a);
			if (strNewLine.trim().length > 0)
			{
				m_arrFiles[m_intCurrentFile].cd.push({
					lineNumber: intLineNumber_a,
					lineCode: strNewLine
				});
				m_arrFiles[m_intCurrentFile].dt = true;
			}

			// sort the lines
			m_arrFiles[m_intCurrentFile].cd.sort(function(a, b)
			{
				return a.lineNumber - b.lineNumber;
			});

			ready();
		}
	}

	function cmdBeautify()
	{
		var strJSON = build(m_arrFiles[m_intCurrentFile].cd, false);
		
		try
		{
			var arrJSON = JSON.parse(strJSON);
			strJSON = JSON.stringify(arrJSON, null, 2);
			m_arrFiles[m_intCurrentFile].cd = unbuild(strJSON);
			m_arrFiles[m_intCurrentFile].dt = true;
		}
		catch (objException_a)
		{
			appendOutput("Error: " + objException_a.message, false, true);
		}
		ready();
	}
	
	function cmdCLS()
	{
		clearOutput();
		ready();
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
			appendOutput("Invalid line number.", false, true);
			ready();
		}
	}
	
	function cmdFile(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			var intFile = parseInt(arrParams_a[1].trim(), 10);
			if (intFile < 1)
			{
				appendOutput("Invalid file number.", false, true);
				ready();
			}
			else if (intFile > m_intFiles)
			{
				cmdFiles();
			}
			else
			{
				intFile--;
				if (intFile < 0)
				{
					intFile = 0;
				}
				m_intCurrentFile = intFile;
				ready();
			}
		}
		else
		{
			//output current file area
			appendOutput(m_intCurrentFile + 1);
			ready();
		}
	}
	
	function cmdFilename(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			var strFilename = arrParams_a[1].trim();
			if (strFilename.length > 0)
			{
				m_arrFiles[m_intCurrentFile].fn = strFilename;
			}
			else
			{
				appendOutput(m_arrFiles[m_intCurrentFile].fn);
			}
		}

		ready();
	}
	
	function cmdFiles()
	{
		var intFile = 1;
		appendOutput("Files:", false, true);
		processArray(m_arrFiles, function(objFile_a)
		{
			var strFileNumber = padWithSpaces(intFile, m_FILENUMBERWIDTH);
			var strCurrent = " ";
			if (m_intCurrentFile + 1 === intFile)
			{
				strCurrent = "*";
			}
			var strDirty = " ";
			if (objFile_a.dt)
			{
				strDirty = "D";
			}
			appendOutput(strFileNumber + " " + strCurrent + strDirty + " " + objFile_a.fn, false, true);
			intFile++;
		});
		appendOutput("\n* current file, D dirty file", false, true);
		ready();
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
						strLine = strLineNumber + '\t';
					}
					
					appendOutput(strLine, true);

					intIndent += intIndentOffsetPost;
				}
			});
		}
		ready();
	}

	function cmdLTR(blnReady_a)
	{
		m_blnRTL = false;
		//m_objOutput.removeClass("rtlo");
		m_objInput.removeClass("rtli");
		
		if (blnReady_a)
		{
			ready();
		}
	}

	function cmdNew()
	{
		m_arrFiles[m_intCurrentFile].cd = [];
		m_arrFiles[m_intCurrentFile].fn = m_NEWFILENAME;
		m_arrFiles[m_intCurrentFile].dt= false;
		ready();
	}
	
	function cmdNewFile(blnSuppressReady_a)
	{
		m_arrFiles.push({
			cd: [],
			fn: m_NEWFILENAME,
			dt: false
		});

		m_intCurrentFile = m_intFiles;
		m_intFiles++;
		
		if (!blnSuppressReady_a)
		{
			ready();
		}
	}

	function cmdPaste(arrParams_a)
	{
		if (arrParams_a.length > 2)
		{
			var intLineNumber = parseInt(arrParams_a[1].trim(), 10);
			var intFile = parseInt(arrParams_a[2].trim(), 10);
			if ((intLineNumber > 0) && (intFile > 0) && (intFile <= m_intFiles))
			{
				var strStart = "";
				var strEnd = "";
				var strMiddle = "";
				var strNewCode = "";
				var strLine = '';
				var strLineCode = '';
				
				// take up to intLineNumber from current File into start
				// AND take from intLineNumber from current File into end
				processArray(m_arrFiles[m_intCurrentFile].cd, function(objLine_a)
				{
					if (objLine_a.lineNumber < intLineNumber)
					{
						if (strStart.length > 0)
						{
							strStart += '\r\n';
						}

						strLine = '';
						strLineCode = objLine_a.lineCode.trim();
						if (strLineCode.length > 0)
						{
							strLine = strLineCode;
						}
						strStart += strLine;
					}
					else
					{
						if (strEnd.length > 0)
						{
							strEnd += '\r\n';
						}

						strLine = '';
						strLineCode = objLine_a.lineCode.trim();
						if (strLineCode.length > 0)
						{
							strLine = strLineCode;
						}
						strEnd += strLine;
					}
				});

				// take all the lines from intFile into middle
				processArray(m_arrFiles[intFile - 1].cd, function(objLine_a)
				{
					if (strMiddle.length > 0)
					{
						strMiddle += '\r\n';
					}

					strLine = '';
					strLineCode = objLine_a.lineCode.trim();
					if (strLineCode.length > 0)
					{
						strLine = strLineCode;
					}
					strMiddle += strLine;
				});

				// join start + middle + end
				strNewCode = strStart;
				if (strNewCode.length > 0)
				{
					strNewCode += '\r\n';
				}
				strNewCode += strMiddle;
				if (strNewCode.length > 0)
				{
					strNewCode += '\r\n';
				}
				strNewCode += strEnd;
				m_arrFiles[m_intCurrentFile].cd = unbuild(strNewCode);
				m_arrFiles[m_intCurrentFile].dt = true;
			}
			else
			{
				appendOutput("Invalid parameters.", false, true);
			}
		}
		else
		{
			appendOutput("Missing parameters.", false, true);
		}

		ready();
	}
	
	function cmdRenum()
	{
		m_arrFiles[m_intCurrentFile].cd = unbuild(build(m_arrFiles[m_intCurrentFile].cd, false));
		ready();
	}

	function cmdReset(blnSuppressReady_a)
	{
		m_intFiles = 1;
		m_intCurrentFile = 0;
		m_arrFiles = [{
			cd: [],
			fn: m_NEWFILENAME,
			dt: false
		}];	// 1 file by default
		m_arrOutput = [];
		m_objG = {};
		m_blnRTL = false;
		m_objG.console = m_objThis;

		clearInput();
		clearOutput();

		cmdValidateCookie(blnSuppressReady_a);
	}
	
	function cmdRTL(blnReady_a)
	{
		m_blnRTL = true;
		//m_objOutput.addClass("rtlo");
		m_objInput.addClass("rtli");
		
		if (blnReady_a)
		{
			ready();
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
				loadProgram(strFilename, function(objResponse_a)
				{
					m_arrFiles[m_intCurrentFile].cd = unbuild(objResponse_a.content);
					m_arrFiles[m_intCurrentFile].fn = strFilename;
					m_arrFiles[m_intCurrentFile].dt = false;
					strBuild = build(m_arrFiles[m_intCurrentFile].cd, false);
					runJS(strBuild);
				});
			}
		}

		if (blnImmediate)
		{
			strBuild = build(m_arrFiles[m_intCurrentFile].cd, false);
			runJS(strBuild);
		}
	}

	function cmdSaveAll()
	{
		var intFile = 0;
		var arrFiles = [];
		
		processArray(m_arrFiles, function(objFile_a)
		{
			if (objFile_a.dt && objFile_a.fn !== m_NEWFILENAME)
			{
				arrFiles.push(intFile);
			}
			intFile++;
		});
		
		function next()
		{
			if (arrFiles.length > 0)
			{
				var intFile = arrFiles.pop();

				function saved()
				{
					m_arrFiles[intFile].dt = false;
					next();
				}
				
				var strContent = build(m_arrFiles[intFile].cd, true);
				var strFilename = m_arrFiles[intFile].fn;
				saveFile(strFilename, strContent, saved);
			}
			else
			{
				ready();
			}
		}
		
		next();
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
				loadProgram(strFilename, function(objResponse_a)
				{
					blnImmediate = false;
					var arrCurrentCode = unbuild(objResponse_a.content);
					cmdList(arrCurrentCode, strSelection);
				});
			}
		}

		if (blnImmediate)
		{
			ready();
		}
	}

	function cmdValidateCookie(blnSuppressReady_a)
	{
		var strCookie = getCookie(m_COOKIENAME);
		var strCommand = 'validatecookie ' + strCookie;

		processCommand(strCommand, null, blnSuppressReady_a);
	}
	
	function cmdWidth()
	{
		var intWidth = getCharWidth();
		appendOutput(intWidth, false, true);
	}

	// callbacks
	function cbLogin(objResponse_a)
	{
		setCookie(m_COOKIENAME, objResponse_a.devicekey, m_COOKIEEXPIRYDAYS);
		cmdValidateCookie(false);
	}

	function cbStartup(objResponse_a)
	{
		if (objResponse_a.content.length > 0)
		{
			appendOutput(objResponse_a.content, true);
		}
	}
	
	function cbValidateCookie(objResponse_a)
	{
		if (m_blnShowStartupText)
		{
			m_blnShowStartupText = false;
			processCommand('startup');
		}
	}

	// command processors
	function processCommand(strInput_a, cb_a, blnSuppressReady_a)
	{
		var blnSuppressReady = blnSuppressReady_a;
		var arrParams = strInput_a.split(' ');
		var strCommand = arrParams[0];
		var intLineNumber = parseInt(strCommand, 10);
		
		if (blnSuppressReady === undefined)
		{
			blnSuppressReady = false;
		}

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
					handleServerCommands(strInput_a, 1);
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
				
				case 'file':
				cmdFile(arrParams);
				break;

				case 'filename':
				cmdFilename(arrParams);
				break;

				case 'files':
				cmdFiles();
				break;

				case 'list':
				var strSelection = arrParams[1];
				cmdList(m_arrFiles[m_intCurrentFile].cd, strSelection);
				break;

				case 'ltr':
				cmdLTR(true);
				break;

				case 'new':
				cmdNew();
				break;
				
				case 'newfile':
				cmdNewFile(false);
				break;

				case 'paste':
				cmdPaste(arrParams);
				break;

				case 'renum':
				cmdRenum();
				break;

				case 'reset':
				cmdReset(false);
				break;

				case 'rtl':
				cmdRTL(true);
				break;

				case 'run':
				cmdRun(arrParams);
				break;

				case 'type':
				cmdType(arrParams);
				break;
				
				case 'width':
				cmdWidth();
				break;

				case 'notes':		// general
				case 'startup':		// general
				handleServerCommands(strInput_a, 1, cbStartup);
				break;

				case 'login':		// account
				handleServerCommands(strInput_a, 0, cbLogin, true);
				break;

				case 'validatecookie':// account
				handleServerCommands(strInput_a, 0, cbValidateCookie, blnSuppressReady);
				break;

				case 'device':		// general
				case 'devices':		// general
				case 'language':	// general
				case 'languages':	// general

				case 'cat':			// file
				case 'dir':			// file
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

				case 'grant':		// sharing
				case 'keys':		// sharing
				case 'newkey':		// sharing
				case 'revoke':		// sharing
				case 'shares':		// sharing
				handleServerCommands(strInput_a, 0);
				break;

				case 'cd':			// file
				case 'chdir':		// file
				case 'cs':			// file

				case 'del':			// file
				case 'delete':		// file
				case 'era':			// file

				case 'help':		// file
				case 'space':		// file
				handleServerCommands(strInput_a, 1);
				break;
				
				case 'load':		// file
				handleServerCommands(strInput_a, 1, null, false, false, false, true);
				break;

				case 'saveall':		// file
				cmdSaveAll();
				break;

				case 'save':		// file
				handleServerCommands(strInput_a, 1, null, false, false, false, false, true);
				break;

				case 'copy':		// file
				case 'cp':			// file

				case 'mv':			// file
				case 'ren':			// file
				case 'rename':		// file
				handleServerCommands(strInput_a, 2);
				break;

				default:
				runJS(strInput_a);
				break;
			}
		}
	}

	// exposed for API
	this.appendOutput = function(str_a, blnForceLTR_a, blnReverseRTL_a)
	{
		appendOutput(str_a, blnForceLTR_a, blnReverseRTL_a);
	};

	this.clearOutput = function()
	{
		clearOutput();
	};

	this.handleServerCommands = function(strInput_a, intFileCount_a, cb_a)
	{
		handleServerCommands(strInput_a, intFileCount_a, cb_a, true, true, true);
	};
	
	this.input = function(cb_a)
	{
		m_cbInput = cb_a;
		m_blnInputMode = true;
		m_objInput.focus();
	};
	
	this.loadFile = function(strFilename_a, cb_a)
	{
		loadFile(strFilename_a, cb_a);
	};

	this.saveFile = function(strFilename_a, objData_a, cb_a)
	{
		saveFile(strFilename_a, objData_a, cb_a);
	};

	this.stop = function()
	{
		ready('stop');
	};
	
	// not usually used from API
	this.onResize = function()
	{
		scrollContainer();
	};

	this.reset = function()
	{
		cmdReset(true);

		// bindings
		$(document.body).on('click', function()
		{
			m_objInput.focus();
		});

		m_objInput.on('keypress', function(objEvent_a)
		{
			inputCommand_onKeyPress(objEvent_a);
		});

		m_objContainer.on('dragleave', function() 
		{
			m_objContainer.removeClass('dragover-highlight');
		});

		m_objContainer.on('dragover', function(objEvent_a) 
		{
			objEvent_a.preventDefault();
			m_objContainer.addClass('dragover-highlight');
		});

		m_objContainer.on('drop', function(objEvent_a) 
		{
			var intCurrentFile = m_intCurrentFile;
			
			m_objContainer.removeClass('dragover-highlight');

			objEvent_a.preventDefault();
			var arrFiles = objEvent_a.originalEvent.dataTransfer.files;

			var blnFirst = true;
			processArray(arrFiles, function(objFile_a)
			{
				var objReader = new FileReader();

				objReader.onload = function(objEvent_a) 
				{
					var strContent = objEvent_a.target.result;
					if (blnFirst)
					{
						blnFirst = false;
					}
					else
					{
						cmdNewFile(true);
					}
					
					m_arrFiles[m_intCurrentFile].cd = unbuild(strContent);
					m_arrFiles[m_intCurrentFile].fn = objFile_a.name;
					m_arrFiles[m_intCurrentFile].dt = true;
					
					m_intCurrentFile = intCurrentFile;
				};

				objReader.readAsText(objFile_a);
			});
		});
	};
}