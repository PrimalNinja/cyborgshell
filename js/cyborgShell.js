function cyborgShell(strContainer_a, strInput_a, strOutput_a, blnShowStartupText_a)
{
	var m_DEBUGREADY = false;
	var m_PARALLELTRANSFORMERS = true;

	var m_COOKIENAME = "csdevicekey";
	var m_COOKIEEXPIRYDAYS = 365;
	var m_FILENUMBERWIDTH = 3;
	var m_INDENTTABCOUNT = 1;
	var m_LINENUMBERWIDTH = 7;
	var m_LOCALSTORAGECONFIG = "config-";
	var m_LOCALSTORAGEPREFIX = "cyborgshell-";
	var m_MAXHEXDATALENGTH = 48;
	var m_MAXHISTORY = 50;
	var m_MAXLISTLINES = 1000;
	var m_NEWFILENAME = 'Unnamed File';
	var m_PRINTABLE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
	
	var m_KEY_ARROWDOWN = 40;
	var m_KEY_ARROWUP = 38;

	// mime types
	var m_MIME_APPBINARY = "application/octet-stream";
	var m_MIME_APPJSON = "application/json";
	var m_MIME_APPPDF = "application/pdf";
	var m_MIME_APPZIP = "application/zip";

	var m_MIME_IMAGEBMP = "image/bmp";
	var m_MIME_IMAGEGIF = "image/gif";
	var m_MIME_IMAGEJPEG = "image/jpeg";
	var m_MIME_IMAGEPNG = "image/png";

	var m_MIME_TEXTBAT = "text/bat";
	var m_MIME_TEXTCSS = "text/css";
	var m_MIME_TEXTCSV = "text/csv";
	var m_MIME_TEXTHTML = "text/html";
	var m_MIME_TEXTJAVASCRIPT = "text/javascript";
	var m_MIME_TEXTPRJ = "application/json";
	var m_MIME_TEXTTRANSFORMER = "text/javascript transformer";
	var m_MIME_TEXTPLAIN = "text/plain";
	
	var m_EDIT_HEX = "hex";
	var m_EDIT_TEXT = "text";

	var m_arrMimeTypes = [
		{ mt: m_MIME_APPBINARY, ext: 'binary', mte: m_EDIT_HEX },
		{ mt: m_MIME_APPBINARY, ext: 'exe', mte: m_EDIT_HEX },
		{ mt: m_MIME_APPBINARY, ext: 'octet-stream', mte: m_EDIT_HEX },
		{ mt: m_MIME_APPJSON, ext: 'json', mte: m_EDIT_TEXT },
		{ mt: m_MIME_APPPDF, ext: 'pdf', mte: m_EDIT_HEX },
		{ mt: m_MIME_APPZIP, ext: 'zip', mte: m_EDIT_HEX },
		
		{ mt: m_MIME_IMAGEBMP, ext: 'bmp', mte: m_EDIT_HEX },
		{ mt: m_MIME_IMAGEGIF, ext: 'gif', mte: m_EDIT_HEX },
		{ mt: m_MIME_IMAGEJPEG, ext: 'jpg', mte: m_EDIT_HEX },
		{ mt: m_MIME_IMAGEPNG, ext: 'png', mte: m_EDIT_HEX },
		
		{ mt: m_MIME_TEXTBAT, ext: 'bat', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTCSS, ext: 'css', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTCSV, ext: 'csv', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTPLAIN, ext: 'hex', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTHTML, ext: 'htm', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTHTML, ext: 'html', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTJAVASCRIPT, ext: 'js', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTPRJ, ext: 'prj', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTTRANSFORMER, ext: 'xfrm', mte: m_EDIT_TEXT },
		{ mt: m_MIME_TEXTPLAIN, ext: 'txt', mte: m_EDIT_TEXT }
	];

	eval("var m_objThis = this;");
	var m_objContainer = $(strContainer_a);
	var m_objInput = $(strInput_a);
	var m_objOutput = $(strOutput_a);

	var m_blnLoginMode = false;	// special input mode for typing in passwords
	var m_blnPasswordMode = false;
	var m_intInputDepth = 0;	// input mode is > 0, this is required to cater for nested inputs within callbacks 
	var m_strUsername = '';		// related to login command
	var m_cbInput = null;
	var m_strInputDefault = "";
	var m_blnShowStartupText = blnShowStartupText_a;

	var m_intFiles = 2;
	var m_intCurrentFile = 1;
	var m_strProjectName = '';
	var m_strProjectFilename = '';
	
	var m_blnLocalStorageAvailable = hasLocalStorage();
	var m_blnLocalStorageSpace = false;
	var m_strAutorun = '';
	
	if (m_blnLocalStorageAvailable)
	{
		m_strAutorun = loadLocalData(m_LOCALSTORAGECONFIG + 'autorun');
	}

	// see function createNewFile for attribute info
	var m_arrFiles = [
			createNewFile([], "Run Space", m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0),
			createNewFile([], m_NEWFILENAME, m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0)
		];	
	var m_arrOutput = [];
	
	var m_arrCommandHistory = [];
	var m_intHistoryIndex = -1;
	
	// event transformers
	var m_arrLinkEvents = [];
	
	eval("var m_objG = {};");		// globals
	var m_blnRTL = false;
	eval("m_objG.console = m_objThis;");

	eval("var m_objAPI = new cyborgShell_API(m_objG);");

	// utils
	
	function after(cb_a, intDelay_a)
	{
		setTimeout(cb_a, intDelay_a);
	}
	
	function afterDOM(cb_a)
	{
		setTimeout(cb_a, 0);
	}

	function appendOutput(str_a, blnForceLTR_a, blnReverseRTL_a, blnDontEscape_a)
	{
		var blnForceLTR = blnForceLTR_a;
		if (blnForceLTR === undefined) { blnForceLTR = false; }
		
		var blnReverseRTL = blnReverseRTL_a;
		if (blnReverseRTL === undefined) { blnReverseRTL = false; }
		
		var blnDontEscape = blnDontEscape_a;
		if (blnDontEscape === undefined) { blnDontEscape = false; }
		
		m_arrOutput.push({
			rtl: m_blnRTL && !blnForceLTR,
			reverse: blnReverseRTL,
			output: str_a,
			dontescape: blnDontEscape
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
			
			if (objOutput_a.dontescape)
			{
				strHtml += '<div class="' + strRTLClass  + '">' + strOutput + '</div>';
			}
			else
			{
				strHtml += '<div class="' + strRTLClass  + '">' + escapeHTML(strOutput) + '</div>';
			}
		});
		
		m_objOutput.html(strHtml);
		scrollContainer();
	}

	function build(arrCode_a, blnIndent_a)
	{
		var intIndent = 0;
		var intIndentOffsetPre = 0;
		var intIndentOffsetPost = 0;
		var strResult = '';

		processArray(arrCode_a, function(objLine_a)
		{
			if (objLine_a && typeof objLine_a.lc === "string") 
			{
				if (strResult.length > 0)
				{
					strResult += '\r\n';
				}

				var strIndent = '';

				intIndentOffsetPre = getIndentOffset(objLine_a.lc, false);
				intIndentOffsetPost = getIndentOffset(objLine_a.lc, true);

				intIndent += intIndentOffsetPre;
				if (intIndent > 0)
				{
					strIndent = '\t'.repeat(intIndent);
				}

				var strLine = '';
				var strLineCode = objLine_a.lc.trim();
				if (strLineCode.length > 0)
				{
					strLine = strIndent + strLineCode;
				}
				strResult += strLine;

				intIndent += intIndentOffsetPost;
			}
		});

		return strResult;
	}
	
	function byteToHex(byByte_a) 
	{
		var intChar = byByte_a.charCodeAt(0);
		var strResult = intChar.toString(16).toUpperCase();
		if (strResult.length < 2)
		{
			strResult = '0' + strResult;
		}
		return strResult;
	}

	function clearInput(strSource_a)
	{
		m_objInput.val('');
	}

	function clearOutput()
	{
		m_arrOutput = [];
		m_objOutput.html('');
	}
	
	function createEmptyFilesUpTo(intFileUpto_a) 
	{
		while (m_intFiles <= intFileUpto_a) 
		{
			m_arrFiles.push(createNewFile([], m_NEWFILENAME, m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0));
			m_intFiles++;
		}
	}
	
	function createNewFile(arrCode_a, strFileName_a, strMimeType_a, strEditor_a, blnDirty_a, objRaw_a, intRawSize_a)
	{
		return {
			fn: strFileName_a,		// filename
			mt: strMimeType_a,		// mimetype
			mte: strEditor_a,		// editor type
			raw: objRaw_a,			// raw file (built code)
			rs: intRawSize_a,		// raw file size (approximate, nothing relies on it anyway)
			cd: arrCode_a,			// editor (unbuilt code)
			ln: null,				// file that this one is linked to
			pl: '',					// plugin name
			arg: '',				// optional plugin arguments
			fl: '',					// file flavour
			st: '',					// status
			dt: blnDirty_a			// is the file dirty?
		};
	}
	
	function createNewLine(intLineNumber_a, strCode_a)
	{
		return {
					ln: intLineNumber_a,
					lc: strCode_a
				};
	}

	function createProjectTemplate(strProjectName_a, arrInputFilenames_a, strTransformer_a, strArguments_a) 
	{
		var intI;
		var objFile;
		
		strProjectName_a = strProjectName_a.replace(/\s+/g, '-');
		
		var objProject = 
		{
			projectName: strProjectName_a, 
			files: []
		};
		
		var strFilename = '';
		for (intI = 0; intI < arrInputFilenames_a.length; intI++) 
		{
			strFilename = arrInputFilenames_a[intI];
			objProject.files.push(createNewFile([], strFilename, "", "", true, "", 0));
		}
			
		for (intI = 0; intI < arrInputFilenames_a.length; intI++) 
		{
			strFilename = 'output-' + arrInputFilenames_a[intI];
			objFile = createNewFile([], strFilename, m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, true, "", 0);
			objFile.ln = intI + 1;
			objFile.pl = strTransformer_a;
			objFile.arg = strArguments_a;
			
			objProject.files.push(objFile);
		}

		objFile = createNewFile([], strTransformer_a, m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, "", 0);
		objFile.fn = strTransformer_a;
		objFile.mt = "text/javascript transformer";
		objFile.mte = "text";

		objProject.files.push(objFile);

		return objProject;
	}

	function deleteCookie(strCookieName_a)
	{
		document.cookie = strCookieName_a + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	}

	function hasLocalStorage()
	{
		var blnResult = false;
		
		try 
		{
			var strTest = m_LOCALSTORAGEPREFIX + 'test';
			localStorage.setItem(strTest, strTest);
			localStorage.removeItem(strTest);
			blnResult = true;
		} 
		catch(objException_a) 
		{
			blnResult = false;
		}
		
		return blnResult;
	}

	// command support
	function editLine(intLineNumber_a)
	{
		var intLineIndex = findLine(m_arrFiles[m_intCurrentFile].cd, intLineNumber_a);

		if (intLineIndex >= 0)
		{
			var strLineCode = intLineNumber_a + ' ' + m_arrFiles[m_intCurrentFile].cd[intLineIndex].lc.replace(/[ \r\n]+$/, '');
			m_arrFiles[m_intCurrentFile].dt = true;
			afterDOM(function() 
			{ 
				scrollContainer();
				m_objInput.val(strLineCode); 
			});
		}
		else
		{
			errorOutput("Line number out of range.");
		}
	}

	function errorOutput(strError_a)
	{
		appendOutput(strError_a, false, true);
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
	
	function findEventByName(strEventName_a)
	{
		var intResult = -1;
		
		for (var intI = 0; intI < m_arrLinkEvents.length; intI++)
		{
			if (m_arrLinkEvents[intI].eventname === strEventName_a)
			{
				intResult = intI;
				break;
			}
		}
		
		return intResult;
	}

	function findFileByName(strFileName_a)
	{
		var intResult = -1;
		
		for (intI = 0; intI < m_arrFiles.length; intI++)
		{
			if (m_arrFiles[intI].fn === strFileName_a)
			{
				intResult = intI;
				break;
			}
		}
		
		return intResult;
	}

	function findLine(arrCode_a, intLineNumber_a)
	{
		var intResult = -1; // index of line number within the array, return -1 for not found
		var intIndex = 0;

		processArray(arrCode_a, function(objLine_a)
		{
			if (objLine_a.ln === intLineNumber_a)
			{
				intResult = intIndex;
				//return true;
			}

			intIndex++;
		});

		return intResult;
	}

	function executePlugin(intPluginFileIndex_a, objSource_a, objTarget_a, cb_a)
	{
		function cb(objResult_a)
		{
console.log('start of internal callback');
			if (objResult_a.cd)
			{
				if (((objResult_a.mte === m_EDIT_HEX) || (objResult_a.mte === m_EDIT_TEXT)) && objResult_a.mte !== objTarget_a.mte)
				{
					// change mte and a new default mimetype
					objTarget_a.mte = objResult_a.mte;
					if (objResult_a.mt !== undefined && objResult_a.mt !== null)
					{
						objTarget_a.mt = objResult_a.mt;
					}
					else
					{
						if (objTarget_a.mte === m_EDIT_HEX)
						{
							objTarget_a.mt = m_MIME_APPBINARY;
						}
						else
						{
							objTarget_a.mt = m_MIME_TEXTPLAIN;
						}
					}
				}
				else
				{
					if (objResult_a.mt !== undefined && objResult_a.mt !== null && objResult_a.mt !== objTarget_a.mt)
					{
						objTarget_a.mt = objResult_a.mt;
					}
				}

				objTarget_a.cd = objResult_a.cd;
				objTarget_a.raw = build(objResult_a.cd);
				objTarget_a.rs = objTarget_a.raw.length;
			}
			else if (objResult_a.raw)
			{
				if (((objResult_a.mte === m_EDIT_HEX) || (objResult_a.mte === m_EDIT_TEXT)) && objResult_a.mte !== objTarget_a.mte)
				{
					// change mte and a new default mimetype
					objTarget_a.mte = objResult_a.mte;
					if (objResult_a.mt !== undefined && objResult_a.mt !== null)
					{
						objTarget_a.mt = objResult_a.mt;
					}
					else
					{
						if (objTarget_a.mte === m_EDIT_HEX)
						{
							objTarget_a.mt = m_MIME_APPBINARY;
						}
						else
						{
							objTarget_a.mt = m_MIME_TEXTPLAIN;
						}
					}
				}
				else
				{
					if (objResult_a.mt !== undefined && objResult_a.mt !== null && objResult_a.mt !== objTarget_a.mt)
					{
						objTarget_a.mt = objResult_a.mt;
					}
				}

				objTarget_a.raw = objResult_a.raw;
				objTarget_a.rs = objResult_a.raw.length;
				objTarget_a.cd = unbuild(objResult_a.raw, objResult_a.mte);
			}
			else
			{
				//var strFallback = build(objSource_a.cd);
				objTarget_a.raw = '';
				objTarget_a.cd = []; //unbuild(strFallback, objSource_a.mte);
				objTarget_a.rs = 0; //strFallback.length;
			}
			
			if (objResult_a.message && objResult_a.message.length > 0)
			{
				appendOutput(objResult_a.message, false, true);
			}
			
			if (objResult_a.error && objResult_a.error.length > 0)
			{
				errorOutput(objResult_a.error);
			}
console.log('set dirty flag');			
			objTarget_a.dt = true;
			
			if (m_objThis.isFunction(cb_a))
			{
console.log('end of executePlugin about to callback');
				cb_a();
			}
		}

		try
		{
			var strPluginCode = build(m_arrFiles[intPluginFileIndex_a].cd, m_EDIT_TEXT);
			var strFunctionName = m_arrFiles[intPluginFileIndex_a].fn.replace('.xfrm', '_xfrm');

			eval('system_api = {};');
			system_api.sfn = objSource_a.fn;
			system_api.smt = objSource_a.mt;
			system_api.smte = objSource_a.mte;
			system_api.tfn = objTarget_a.fn;
			if (objSource_a.mte === m_EDIT_HEX)
			{
				system_api.raw = objSource_a.raw;
			}
			else
			{
				system_api.raw = build(objSource_a.cd);
			}
			system_api.cd = objSource_a.cd;
			system_api.cb = cb;
			system_api.arg = objTarget_a.arg;
			
			var strCode = '(function(api, globals){' + strPluginCode + '; ' + strFunctionName + '(api, globals, system_api.sfn, system_api.smt, system_api.smte, system_api.tfn, system_api.raw, system_api.cd, system_api.arg, system_api.cb); })(m_objAPI, m_objG);';

console.log('about to eval plugin which has an internal callback');

			eval(strCode);
		}
		catch (objException_a)
		{
console.log('eval plugin exception, end of executePlugin about to callback');
			errorOutput(objException_a.message);
			var strFallback = build(objSource_a.cd);
			objTarget_a.cd = unbuild(strFallback, objSource_a.mte);
			objTarget_a.rs = strFallback.length;
			
			if (m_objThis.isFunction(cb_a))
			{
				cb_a();
			}
		}
	}

	function findMimeType(strFilename_a, strMimeType_a)
	{
		var strResult = m_MIME_APPBINARY;
		var strExtension = strFilename_a.split('.').pop().toLowerCase();
		var blnFound = false;
		
		processArray(m_arrMimeTypes, function(objMimeType_a)
		{
			if ((objMimeType_a.mt === strMimeType_a) || (objMimeType_a.ext === strMimeType_a))
			{
				strResult = objMimeType_a.mt;
				blnFound = true;
				return true;
			}
		});

		// if not found by mime type, then find it by filename extension
		if (!blnFound)
		{
			processArray(m_arrMimeTypes, function(objMimeType_a)
			{
				if ((objMimeType_a.ext === strExtension))
				{
					strResult = objMimeType_a.mt;
					blnFound = true;
					return true;
				}
			});
		}
		
		return strResult;
	}

	function findMimeTypeEditor(strFilename_a, strMimeType_a)
	{
		var strResult = m_EDIT_HEX;
		var strExtension = strFilename_a.split('.').pop().toLowerCase();
		var blnFound = false;
		
		processArray(m_arrMimeTypes, function(objMimeType_a)
		{
			if ((objMimeType_a.mt === strMimeType_a) || (objMimeType_a.ext === strMimeType_a))
			{
				strResult = objMimeType_a.mte;
				blnFound = true;
				return true;
			}
		});

		// if not found by mime type, then find it by filename extension
		if (!blnFound)
		{
			processArray(m_arrMimeTypes, function(objMimeType_a)
			{
				if ((objMimeType_a.ext === strExtension))
				{
					strResult = objMimeType_a.mte;
					blnFound = true;
					return true;
				}
			});
		}
		
		return strResult;
	}

	function findPluginFile(strPluginName_a)
	{
		var intResult = -1;
		var intBestMatch = -1;
		
		processArray(m_arrFiles, function(objFile_a, intRowNum_a, intIndex_a)
		{
			if (objFile_a.fn === strPluginName_a)
			{
				if (objFile_a.dt) // Prefer dirty (edited) files
				{
					intResult = intIndex_a;
				}
				else if (intBestMatch === -1)
				{
					intBestMatch = intIndex_a; // Keep as fallback
				}
				
				if (intResult >= 0)
				{
					return true; // break - dirty file wins
				}
			}
		});
		
		if (intResult === -1)
		{
			intResult = intBestMatch;
		}
		
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

		if (m_arrFiles[m_intCurrentFile].mte === m_EDIT_TEXT)
		{
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
		}

		return intResult;
	}

	function getInt(strInput, intRadix)
	{
		var intResult = NaN;
		var strTrimmed, regexPattern;
		
		intRadix = intRadix || 10;
		
		// Trim whitespace
		strTrimmed = strInput.replace(/^\s+|\s+$/g, '');
		
		// Check if not empty and matches valid integer pattern
		if (strTrimmed)
		{
			if (intRadix === 16)
			{
				regexPattern = /^-?[0-9a-fA-F]+$/;
			}
			else
			{
				regexPattern = /^-?\d+$/;
			}
			
			if (regexPattern.test(strTrimmed))
			{
				intResult = parseInt(strTrimmed, intRadix);
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

		var intRFrom = 0; // create strR from...
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
				errorOutput(objResponseJSON.error);
			}
			
			if (!blnSuppressMessage && objResponseJSON.message.length > 0)
			{
				if (strInput_a.startsWith('help'))
				{
					appendOutput(objResponseJSON.message, false, false, true);
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
				m_arrFiles[m_intCurrentFile].fn = strF1;
				m_arrFiles[m_intCurrentFile].mt = findMimeType(strF1, '');
				m_arrFiles[m_intCurrentFile].mte = findMimeTypeEditor(strF1, '');
				m_arrFiles[m_intCurrentFile].raw = strContent;
				m_arrFiles[m_intCurrentFile].rs = strContent.length;
				m_arrFiles[m_intCurrentFile].cd = unbuild(strContent, m_arrFiles[m_intCurrentFile].mte);
				m_arrFiles[m_intCurrentFile].dt = false;
				
				updateLinkedFiles(m_intCurrentFile);
			}

			if (blnSaveProgram && objResponseJSON.error.length === 0)
			{
				m_arrFiles[m_intCurrentFile].dt = false;
			}

			if (m_objThis.isFunction(cb_a))
			{
				cb_a(objResponseJSON);
			}

			ready('handleServerCommands', blnSuppressReady);
		});
	}

	function hexToASCII(strCodeLine_a) 
	{
		var arrHex = strCodeLine_a.trim().split(' ');
		var strResult = '';

		for (var intI = 0; intI < arrHex.length; intI++) 
		{
			var strHex = getInt(arrHex[intI], 16);
			var strChar = String.fromCharCode(strHex);
			if (m_PRINTABLE_CHARS.indexOf(strChar) !== -1) 
			{
				strResult += strChar;
			} 
			else 
			{
				strResult += '.'; // Replace non-ASCII bytes with a dot
			}
		}

		return escapeHTML(strResult);
	}

	function linkFile(intDestFile_a, intSourceFile_a, strPlugin_a, strArguments_a) 
	{
		var strPlugin = strPlugin_a;
		var strArguments = strArguments_a;
		
		if (!strPlugin) 
		{
			strPlugin = 'null.xfrm';
		}
		
		if (!strPlugin.endsWith('.xfrm')) 
		{
			strPlugin += '.xfrm';
		}
		
		if (strArguments === undefined)
		{
			strArguments = '';
		}

		if (intSourceFile_a < 0 || intDestFile_a < 0) 
		{
			errorOutput("Invalid file number.");
			ready('linkFile');
		}
		else if (intSourceFile_a === intDestFile_a) 
		{
			errorOutput("A file cannot be linked to itself.");
			ready('linkFile');
		}
		else if (intSourceFile_a >= m_intFiles || intDestFile_a >= m_intFiles) 
		{
			cmdFiles();
		}
		else 
		{
			// Load plugin immediately
			var intPluginFileIndex = findPluginFile(strPlugin);

			if (intPluginFileIndex === -1) 
			{
console.log('about to load plugin');
				loadFile(strPlugin, function(objResponse_a) 
				{
console.log('plugin loaded');
					if (objResponse_a.error.length === 0) 
					{
						var strContent = objResponse_a.content;

						// Create plugin file
						var intNewFileIndex = m_intFiles;
						m_arrFiles.push(createNewFile([], strPlugin, m_MIME_TEXTTRANSFORMER, m_EDIT_TEXT, false, strContent, strContent.length));
						var arrUnbuilt = unbuild(strContent, m_EDIT_TEXT);
						m_arrFiles[intNewFileIndex].cd = arrUnbuilt;

						m_intFiles++;

						// Set up the link
						m_arrFiles[intDestFile_a].ln = intSourceFile_a;
						m_arrFiles[intDestFile_a].pl = strPlugin;
						m_arrFiles[intDestFile_a].arg = strArguments;

console.log('before updating linked file');

						// Apply transformation immediately
						//var strSourceCode = build(m_arrFiles[intSourceFile_a].cd);
						updateLinkedFile(m_arrFiles[intSourceFile_a], m_arrFiles[intDestFile_a], function() 
						{
console.log('before updating linked file ready');
							ready('linkFile');
						});
					}
					else 
					{
						errorOutput("Failed to load plugin: " + objResponse_a.error);
						ready('linkFile');
					}
console.log('plugin loaded end');
				});
			}
			else 
			{
console.log('plugin already loaded');
				// Plugin already loaded
				m_arrFiles[intDestFile_a].ln = intSourceFile_a;
				m_arrFiles[intDestFile_a].pl = strPlugin;
				m_arrFiles[intDestFile_a].arg = strArguments;

				// Apply transformation immediately
				//var strSourceCode = build(m_arrFiles[intSourceFile_a].cd);
				updateLinkedFile(m_arrFiles[intSourceFile_a], m_arrFiles[intDestFile_a], function() 
				{
					ready('linkFile');
				});
			}
		}
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
			
			if (m_objThis.isFunction(cb_a))
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
				errorOutput(objResponseJSON_a.error);
			}
			
			if (objResponseJSON_a.message.length > 0)
			{
				appendOutput(objResponseJSON_a.message, false);
			}

			if (m_objThis.isFunction(cb_a))
			{
				cb_a(objResponseJSON_a);
			}
		});
	}
	
	
	function deleteLocalData(strFilename_a)
	{
		var blnResult = false;
		
		try 
		{
			var strKey = m_LOCALSTORAGEPREFIX + strFilename_a;
			localStorage.removeItem(strKey);
			blnResult = true;
		} 
		catch (objException_a) 
		{
			blnResult = false;
		}
		
		return blnResult;
	}

	function loadLocalData(strFilename_a)
	{
		var objResult = null;
		
		try 
		{
			var strKey = m_LOCALSTORAGEPREFIX + strFilename_a;
			var strData = localStorage.getItem(strKey);
			if (strData !== null)
			{
				objResult = JSON.parse(strData);
			}
		} 
		catch (objException_a) 
		{
			objResult = null;
		}
		
		return objResult;
	}

	function saveLocalData(strFilename_a, objData_a)
	{
		var blnResult = false;
		
		try 
		{
			var strKey = m_LOCALSTORAGEPREFIX + strFilename_a;
			var strData = JSON.stringify(objData_a);
			localStorage.setItem(strKey, strData);
			blnResult = true;
		} 
		catch (objException_a) 
		{
			blnResult = false;
		}
		
		return blnResult;
	}

	function newFile(strMimeType_a, intFile_a, blnSuppressReady_a)
	{
		if (intFile_a !== null) 
		{
			if (intFile_a > m_intFiles)
			{
				// Optional file number provided
				createEmptyFilesUpTo(intFile_a);
			}
			else
			{
				// Current behavior - add to end
				m_arrFiles.push(createNewFile([], m_NEWFILENAME, strMimeType_a, m_EDIT_TEXT, false, '', 0));
				m_intCurrentFile = m_intFiles;
				m_intFiles++;
			}
			m_intCurrentFile = intFile_a;
		}
		else 
		{
			// Current behavior - add to end
			m_arrFiles.push(createNewFile([], m_NEWFILENAME, strMimeType_a, m_EDIT_TEXT, false, '', 0));
			m_intCurrentFile = m_intFiles;
			m_intFiles++;
		}
		
		ready('cmdNewFile', blnSuppressReady_a);
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
				objResult.from = getInt(arrParts[0], 10);
				objResult.to = getInt(arrParts[1], 10);
			}
			else if (strSelection_a.charAt(0) === '-')
			{
				objResult.from = -Infinity;
				objResult.to = getInt(strSelection_a.substring(1), 10);
			}
			else if (strSelection_a.charAt(strSelection_a.length - 1) === '-')
			{
				objResult.from = getInt(strSelection_a.substring(0, strSelection_a.length - 1), 10);
				objResult.to = Infinity;
			}
			else
			{
				objResult.from = getInt(strSelection_a, 10);
				objResult.to = getInt(strSelection_a, 10);
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
	
	// turn password mode on or off for the input box
	function passwordMode(blnMode_a)
	{
		m_blnPasswordMode = blnMode_a;
		
		m_objInput.val('');
		if (m_blnPasswordMode)
		{
			m_objInput.attr('type', 'password');
		}
		else
		{
			m_objInput.attr('type', 'email');
		}
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
					if (m_objThis.isFunction(cb_a))
					{
						blnAbort = cb_a(arr_a[intI], intRowNum, intI);
					}
				}
				intRowNum++;
				intI++;
			}
		}
	}

	function ready(strSource_a, blnSuppressReady_a)
	{
		var blnSuppressReady = blnSuppressReady_a;
		if (blnSuppressReady === undefined) { blnSuppressReady = false; }
		
		if (!blnSuppressReady)
		{
			if (m_DEBUGREADY)
			{
				appendOutput("Ready:" + strSource_a, false, true);
			}
			else
			{
				appendOutput("Ready", false, true);
			}
			//scrollContainer();
		}
	}

	function reverseOutput(str_a)
	{
		var strResult = str_a;
		var arrLines = strResult.split("\n");
		var intLine = 0;
		var strLine = '';
		processArray(arrLines, function(strLine_a)
		{
			strLine = strLine_a;
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
	
	function runJS(strCode_a, arrParams_a)
	{
		try
		{
			m_objAPI.commandline = arrParams_a;
			var strCode = '(function(api, globals){' + strCode_a + '})(m_objAPI, m_objG);';
			eval(strCode);
			//ready('runJS');
		}
		catch (objException_a)
		{
			errorOutput(objException_a.message);
			//scrollContainer();
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
			
			if (m_objThis.isFunction(cb_a))
			{
				cb_a(objResponseJSON);
			}
		});
	}

	function scrollContainer()
	{
		after(function()
		{
			var divContainer = document.querySelector('#ge-clicontainer');
			divContainer.scrollTop = divContainer.scrollHeight - divContainer.clientHeight;
		}, 100);
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

	function str_match(strPattern_a, strString_a)
	{
		blnResult = true;
		
		if (strPattern_a.length > 0)
		{
			// Convert shell wildcards to regex
			var strRegex = strPattern_a.replace(/\*/g, '.*').replace(/\?/g, '.');
			var objRegex = new RegExp('^' + strRegex + '$', 'i');
			blnResult = objRegex.test(strString_a);
		}
		
		return blnResult;
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

	function unbuild(strCode_a, strMimeType_a)
	{
		var arrResult = [];
		var strMimeType = strMimeType_a;
		//if (strMimeType ===  undefined)
		//{
			//strMimeType = m_arrFiles[m_intCurrentFile].mte;
		//}

		var intLineIndex = 1;
		var intLineNumber = 10;
		if (strMimeType === m_EDIT_HEX)
		{
			var strCodeLine = '';
			var intHexDataLength = 0;
			for (var intI = 0; intI < strCode_a.length; intI++) 
			{
				var strChar = strCode_a[intI];
				
				// TODO IN FUTURE: Verify the -1 on the next line, incomplete hex?
				if ((intHexDataLength === m_MAXHEXDATALENGTH) || (intI === strCode_a.length - 1))
				{
					// finish the line
					var strCodeLineASCII = hexToASCII(strCodeLine);
					
					if (strCodeLine.length < m_MAXHEXDATALENGTH * 3)
					{
						strCodeLine += Array(m_MAXHEXDATALENGTH * 3 - strCodeLine.length + 1).join(' ');
					}
					
					strCodeLine += "  " + strCodeLineASCII;
					arrResult.push(createNewLine(intLineNumber, strCodeLine));

					intLineNumber += 10;
					intLineIndex++;
					intHexDataLength = 0;
					strCodeLine = '';
				}
				else
				{
					strCodeLine += byteToHex(strChar) + " ";
					intHexDataLength++;
				}
			}
		}
		else if (strMimeType === m_EDIT_TEXT)
		{
			var arrCode = strCode_a.split('\n');
			
			processArray(arrCode, function(strCode_a)
			{
				var strCode = strCode_a.trim();
				if (!((intLineIndex === arrCode.length) && (strCode.length === 0)))
				{
					arrResult.push(createNewLine(intLineNumber, strCode));

					intLineNumber += 10;
					intLineIndex++;
				}
			});
		}

		return arrResult;
	}
	
	function updateFileStats(intFileIndex_a)
	{
		var strBuild = build(m_arrFiles[intFileIndex_a].cd, false);
		m_arrFiles[intFileIndex_a].rs = strBuild.length;
	}

	function updateLinkedFile(objSource_a, objTarget_a, cb_a)
	{
		if (objSource_a.dt)
		{
			var strPluginName = objTarget_a.pl || 'blocker.xfrm';
			var intPluginFileIndex = findPluginFile(strPluginName);

			if (intPluginFileIndex !== -1)
			{
				executePlugin(intPluginFileIndex, objSource_a, objTarget_a, cb_a);
			}
			else
			{
				// Fallback if plugin not found (shouldn't happen)
				var strFallback = build(objSource_a.cd);
				objTarget_a.cd = unbuild(strFallback, objSource_a.mte);
				objTarget_a.rs = strFallback.length;
				if (m_objThis.isFunction(cb_a)) 
				{
					cb_a();
				}
			}
		}
		else
		{
			if (m_objThis.isFunction(cb_a)) 
			{
				cb_a();
			}
		}
	}

	// SEQUENTIAL update each file that are linked to specified file
	function SEQUENTIAL_updateLinkedFiles(intFileLinkedTo_a)
	{
		var arrVisited = [];
		var arrStack = [];
		var intTarget;

		// Phase 1: Traverse link graph and build stack of all [source,target] links in post-order
		function addLinksToStack(intSource_a)
		{
			if (arrVisited.indexOf(intSource_a) === -1)
			{
				arrVisited.push(intSource_a);
				var arrChildren = [];
				
				for (intTarget = 0; intTarget < m_arrFiles.length; intTarget++)
				{
					if (m_arrFiles[intTarget].ln === intSource_a)
					{
						// Then record the link from parent (source) to child (target)
						arrStack.push({ source: intSource_a, target: intTarget });
						arrChildren.push(intTarget);
					}
				}
				
				for (var intChild = 0; intChild < arrChildren.length; intChild++)
				{
					// now iterate through arrChildren and recurse
					addLinksToStack(arrChildren[intChild]);
				}
			}
		}
		addLinksToStack(intFileLinkedTo_a);

		// Phase 2: Iterate/process the arrStack as needed
		var intProcess = 0;
		function processLink()
		{
			if (intProcess < arrStack.length)
			{
				var objLink = arrStack[intProcess];
				intProcess++;
				updateLinkedFile(m_arrFiles[objLink.source], m_arrFiles[objLink.target], processLink);
			}
		}
		processLink();
	}

	// PARALLEL update each file that are linked to specified file
	function PARALLEL_updateLinkedFiles(intFileLinkedTo_a)
	{
		var arrUpdated = [];
		
		function updateCascade(intFileIndex, cb_a)
		{
			if (arrUpdated.indexOf(intFileIndex) !== -1)
			{
				if (m_objThis.isFunction(cb_a)) cb_a();
				return;
			}
			
			arrUpdated.push(intFileIndex);
			var arrToUpdate = [];
			
			processArray(m_arrFiles, function(objFile_a, intRowNum_a, intFileIndex_a)
			{
				if (objFile_a.ln === intFileIndex)
				{
					arrToUpdate.push({file: objFile_a, index: intFileIndex_a});
				}
			});
			
			var intCompleted = 0;
			if (arrToUpdate.length === 0)
			{
				if (m_objThis.isFunction(cb_a)) cb_a();
				return;
			}
			
			processArray(arrToUpdate, function(objUpdate_a)
			{
				//var strSourceCode = build(m_arrFiles[intFileIndex].cd);
				updateLinkedFile(m_arrFiles[intFileIndex], objUpdate_a.file, function()
				{
					intCompleted++;
					if (intCompleted === arrToUpdate.length)
					{
						// All files at this level updated, now cascade
						var intCascadeCompleted = 0;
						processArray(arrToUpdate, function(objUpdate_a)
						{
							updateCascade(objUpdate_a.index, function()
							{
								intCascadeCompleted++;
								if (intCascadeCompleted === arrToUpdate.length)
								{
									if (m_objThis.isFunction(cb_a)) cb_a();
								}
							});
						});
					}
				});
			});
		}
		
		updateCascade(intFileLinkedTo_a);
	}
	
	function updateLinkedFiles(intFileLinkedTo_a)
	{
		if (intFileLinkedTo_a === undefined)
		{
			// No parameter - process all dirty files
			for (var intI = 0; intI < m_arrFiles.length; intI++)
			{
				if (m_arrFiles[intI].dt)
				{
					if (m_PARALLELTRANSFORMERS)
					{
						PARALLEL_updateLinkedFiles(intI);
					}
					else
					{
						SEQUENTIAL_updateLinkedFiles(intI);
					}
				}
			}
		}
		else
		{
			// Parameter provided - process specific file
			if (m_PARALLELTRANSFORMERS)
			{
				PARALLEL_updateLinkedFiles(intFileLinkedTo_a);
			}
			else
			{
				SEQUENTIAL_updateLinkedFiles(intFileLinkedTo_a);
			}
		}
	}
	
	// event handlers
	function inputCommand_onKeyPress(objEvent_a)
	{
		var strInput = '';
		
		if (objEvent_a.which === 13) // Enter key
		{
			if (m_intInputDepth > 0)
			{
				strInput = m_objInput.val();
				if (m_objThis.isFunction(m_cbInput))
				{
					m_cbInput(strInput);
				}

				m_objInput.val('');
				m_intInputDepth--;
				if (m_intInputDepth === 0)
				{
					m_cbInput = null;
					m_strInputDefault = "";
				}
			}
			else if (m_blnLoginMode)
			{
				strInput = m_objInput.val();
				passwordMode(false);
				var arrParams = strInput.split(' ');
				cmdLogin(arrParams);
			}
			else
			{
				strInput = m_objInput.val();

				// Add to history (avoid duplicates and empty commands)
				if (strInput.trim().length > 0 && (m_arrCommandHistory.length === 0 || m_arrCommandHistory[m_arrCommandHistory.length - 1] !== strInput))
				{
					m_arrCommandHistory.push(strInput);
					if (m_arrCommandHistory.length > m_MAXHISTORY)
					{
						m_arrCommandHistory.shift(); // Remove oldest
					}
				}
				m_intHistoryIndex = -1; // Reset history navigation

				appendOutput(strInput, false, true);
				processCommand(strInput);
				clearInput('inputCommand_onKeyPress');
			}
		}
		else if (objEvent_a.which === m_KEY_ARROWUP)
		{
			if ((m_intInputDepth === 0) && !m_blnLoginMode && m_arrCommandHistory.length > 0)
			{
				if (m_intHistoryIndex === -1)
				{
					m_intHistoryIndex = m_arrCommandHistory.length - 1;
				}
				else if (m_intHistoryIndex > 0)
				{
					m_intHistoryIndex--;
				}
				m_objInput.val(m_arrCommandHistory[m_intHistoryIndex]);
				objEvent_a.preventDefault();
			}
		}
		else if (objEvent_a.which === m_KEY_ARROWDOWN)
		{
			if ((m_intInputDepth === 0) && !m_blnLoginMode)
			{
				if (m_intHistoryIndex !== -1)
				{
					m_intHistoryIndex++;
					if (m_intHistoryIndex >= m_arrCommandHistory.length)
					{
						m_intHistoryIndex = -1;
						m_objInput.val('');
					}
					else
					{
						m_objInput.val(m_arrCommandHistory[m_intHistoryIndex]);
					}
				}
				objEvent_a.preventDefault();
			}
		}
	}

	function inputCommand_onPaste(objEvent_a)
	{
		var objEvent = objEvent_a.originalEvent;
		var strInput = '';
		
		if ((m_intInputDepth === 0) && (!m_blnLoginMode))
		{
			//objEvent_a.preventDefault();
			
			var objClipData = objEvent.clipboardData || window.clipboardData;
			if (objClipData && objClipData.getData) 
			{
				strInput = objClipData.getData('text') || objClipData.getData('text');
			}
			
			if (strInput.indexOf("\n") !== -1)
			{
				// bulk paste mode
				objEvent_a.preventDefault();

				strInput = str_replace(strInput, "\t", " ");
				strInput = str_replace(strInput, "\r", "");
				
				var arrLines = strInput.split("\n");
				var blnAutoNumber = false;
				var intLineNumber = 0;
				var strLine = '';

				// first detect if the first line has a line number
				if (arrLines.length > 0)
				{
					strLine = arrLines[0];
					var arrParts = strLine.split(' ');
					intLineNumber = getInt(arrParts[0], 10);

					if (isNaN(intLineNumber) || intLineNumber === 0)
					{
						blnAutoNumber = true;
					}
				}
				
				var arrCode = m_arrFiles[m_intCurrentFile].cd;

				// get the last line
				intLineNumber = 0;
				if (arrCode.length > 0)
				{
					intLineNumber = arrCode[arrCode.length-1].ln;
				}
				intLineNumber += 10;

				if (blnAutoNumber)
				{
					appendOutput("autonumber", false, true);
				}
				else
				{
					appendOutput("preserve line numbers", false, true);
				}

				arrLines = strInput.split("\n");
				processArray(arrLines, function(strLine_a)
				{
					strLine = strLine_a.trim();
					appendOutput(strLine, false, true);
					
					if (blnAutoNumber)
					{
						arrCode.push(createNewLine(intLineNumber, strLine));
					}
					else
					{
						processCommand(strLine, null, true);
					}
					
					intLineNumber += 10;
				});
				
				var strBuild = build(arrCode, true);
				m_arrFiles[m_intCurrentFile].rs = strBuild.length;
				m_arrFiles[m_intCurrentFile].cd = unbuild(strBuild, m_arrFiles[m_intCurrentFile].mte);	// does a renumber also
				
				clearInput('inputCommand_onPaste');
				ready('inputCommand_onPaste');
			}
		}
	}

	// commands
	function cmdAddReplaceDeleteLine(intLineNumber_a, strInput_a, blnSuppressReady_a)
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
					m_arrFiles[m_intCurrentFile].cd[intLineIndex].lc = strNewLine;
					m_arrFiles[m_intCurrentFile].dt = true;
				}

				 updateFileStats(m_intCurrentFile);
				updateLinkedFiles(m_intCurrentFile);
				ready('cmdAddReplaceDeleteLine', blnSuppressReady_a);
			}
			else
			{
				// delete a line
				m_arrFiles[m_intCurrentFile].cd.splice(intLineIndex, 1);
				m_arrFiles[m_intCurrentFile].dt = true;

				 updateFileStats(m_intCurrentFile);
				updateLinkedFiles(m_intCurrentFile);
				ready('cmdAddReplaceDeleteLine', blnSuppressReady_a);
			}
		}
		else
		{
			// adding a new line
			strNewLine = getNewLine(strInput_a);
			//if (strNewLine.trim().length > 0)	// omitting this line allows us to toggle blank lines by simply typing the line number
			//{
				m_arrFiles[m_intCurrentFile].cd.push(createNewLine(intLineNumber_a, strNewLine));
				m_arrFiles[m_intCurrentFile].dt = true;
			//}

			// sort the lines
			m_arrFiles[m_intCurrentFile].cd.sort(function(a, b)
			{
				return a.ln - b.ln;
			});

			updateFileStats(m_intCurrentFile);
			updateLinkedFiles(m_intCurrentFile);
			ready('cmdAddReplaceDeleteLine', blnSuppressReady_a);
		}
	}

	function cmdBeautify()
	{
		var strJSON = build(m_arrFiles[m_intCurrentFile].cd, false);
		
		try
		{
			var arrJSON = JSON.parse(strJSON);
			strJSON = JSON.stringify(arrJSON, null, 2);
			m_arrFiles[m_intCurrentFile].cd = unbuild(strJSON, m_arrFiles[m_intCurrentFile].mte);
			m_arrFiles[m_intCurrentFile].dt = true;
		}
		catch (objException_a)
		{
			errorOutput(objException_a.message);
		}
		ready('cmdBeautify');
	}
	
	function cmdCLS()
	{
		clearOutput();
		ready('cmdCLS');
	}
	
	function cmdConfig(arrParams_a)
	{
		var blnSuccess = false;

		if (arrParams_a.length < 3) 
		{
			errorOutput("Missing parameters.");
		} 
		else 
		{
			var strAction = arrParams_a[1].trim().toLowerCase();
			var strFilename = arrParams_a[2].trim().toLowerCase();

			if (strAction === 'delete') 
			{
				blnSuccess = deleteLocalData(m_LOCALSTORAGECONFIG + strFilename);
				if (blnSuccess) 
				{
					appendOutput('Config option deleted.', false, true);
				} 
				else 
				{
					errorOutput("Failed to delete config option.");
				}
			} 
			else if (strAction === 'save') 
			{
				if (arrParams_a.length < 4) 
				{
					errorOutput("Missing config option value.");
				} 
				else 
				{
					// Join all remaining parameters as the key
					var strKeyValue = arrParams_a.slice(3).join(' ');
					blnSuccess = saveLocalData(m_LOCALSTORAGECONFIG + strFilename, strKeyValue);
					if (blnSuccess) 
					{
						appendOutput('Config option saved.', false, true);
					} 
					else 
					{
						errorOutput("Failed to save config option.");
					}
				}
			} 
			else 
			{
				errorOutput("Invalid action. Use save or delete.");
			}
		}
		ready('cmdConfig');
	}
	
	function cmdDir(arrParams_a, strInput_a)
	{
		if (m_blnLocalStorageSpace)
		{
			var arrFiles = [];
			var strPattern = "";
			if (arrParams_a.length > 1)
			{
				arrParams_a[1];
			}
			
			// Get all localStorage keys that start with our prefix
			for (var intI = 0; intI < localStorage.length; intI++)
			{
				var strKey = localStorage.key(intI);
				if (typeof strKey === 'string' && strKey.length > 0 && strKey.startsWith(m_LOCALSTORAGEPREFIX))
				{
					var strFilename = strKey.substring(m_LOCALSTORAGEPREFIX.length);
					
					// Apply pattern filter if provided
					if (strPattern.length === 0 || str_match(strPattern.toUpperCase(), strFilename.toUpperCase()))
					{
						arrFiles.push(strFilename);
					}
				}
			}
			
			if (arrFiles.length === 0)
			{
				errorOutput("No files found.");
			}
			else
			{
				arrFiles.sort(); // Sort alphabetically
				var strFileList = arrFiles.join(', ');
				appendOutput(strFileList, false, true);
			}
			ready('cmdDir');
		}
		else
		{
			handleServerCommands(strInput_a, 0);
		}
	}

	function cmdEdit(arrParams_a)
	{
		var intLineNumber = getInt(arrParams_a[1], 10);

		if (!isNaN(intLineNumber) && intLineNumber > 0)
		{
			editLine(intLineNumber);
		}
		else
		{
			errorOutput("Invalid line number.");
			ready('cmdEdit');
		}
	}

	function cmdFile(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			var intFile = getInt(arrParams_a[1].trim(), 10);
			if (intFile < 0)
			{
				errorOutput("Invalid file number.");
				ready('cmdFile');
			}
			else if (intFile >= m_intFiles)
			{
				//cmdFiles();
				createEmptyFilesUpTo(intFile);
				m_intCurrentFile = intFile;
				ready('cmdFile');
			}
			else
			{
				if (intFile < 0)
				{
					intFile = 0;
				}
				m_intCurrentFile = intFile;
				ready('cmdFile');
			}
		}
		else
		{
			//output current file area
			appendOutput(m_arrFiles[m_intCurrentFile].fn);
			ready('cmdFile');
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
		}
		else
		{
			appendOutput(m_arrFiles[m_intCurrentFile].fn);
		}

		ready('cmdFilename');
	}
	
	function cmdFiles()
	{
		if (m_strProjectName.length > 0)
		{
			appendOutput("Project name: " + m_strProjectName, false, true);
		}
		
		if (m_strProjectFilename.length > 0)
		{
			appendOutput("Project filename: " + m_strProjectFilename, false, true);
		}
		
		var intFile = 0;
		appendOutput("Files:", false, true);
		processArray(m_arrFiles, function(objFile_a)
		{
			var strFileNumber = padWithSpaces(intFile, m_FILENUMBERWIDTH);
			var strCurrent = " ";
			if (m_intCurrentFile === intFile)
			{
				strCurrent = "*";
			}

			var strDirty = " ";
			if (objFile_a.dt)
			{
				strDirty = "D";
			}

			var strType = "";
			if (objFile_a.fn.endsWith('.xfrm') || objFile_a.mt === m_MIME_TEXTTRANSFORMER)
			{
				strType = " [PLUGIN]";
			}
		
			var strFlavour = objFile_a.fl;
			if (strFlavour.length > 0)
			{
				strFlavour = " " + strFlavour;
			}

			var intLinkTo = objFile_a.ln;
			var strLinkTo = "";
			if (intLinkTo !== null)
			{
				if (intLinkTo  >= 0)
				{
					strLinkTo = " Linked to " + intLinkTo + ":" + objFile_a.pl + ":" + objFile_a.arg;
				}
			}
			
			var strStatus = objFile_a.st;
			if (strStatus.length > 0)
			{
				strStatus = " " + strStatus;
			}
			
			appendOutput(strFileNumber + " " + strCurrent + strDirty + " " + objFile_a.fn + strType + " " + objFile_a.rs + " bytes/" + objFile_a.cd.length + " lines (" + objFile_a.mt + ":" + objFile_a.mte + ")" + strFlavour + strLinkTo + strStatus, false, true);
			intFile++;
		});
		appendOutput("\n* current file, D dirty file", false, true);
		ready('cmdFiles');
	}
	
	function cmdFlavour(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			m_arrFiles[m_intCurrentFile].fl = arrParams_a[1].trim();
		}
		else
		{
			appendOutput(m_arrFiles[m_intCurrentFile].fl, false, true);
			ready('cmdFlavour');
		}
	}

	function cmdLink(arrParams_a)
	{
		var intExistingInde;
		var strArguments;
		
		if (arrParams_a.length < 2)
		{
			errorOutput("Missing parameters.");
			ready('cmdLink');
		}
		else
		{
			var arg1 = arrParams_a[1];
			if (/^\d+$/.test(arg1))
			{
				// Traditional file-number logic
				if (arrParams_a.length < 3)
				{
					errorOutput("Missing parameters.");
					ready('cmdLink');
					return;
				}
				
				var intDestFile = getInt(arg1, 10);
				var intSourceFile = getInt(arrParams_a[2], 10);
				var strPlugin = arrParams_a[3];
				strArguments = arrParams_a.slice(4).join(' ');

				createEmptyFilesUpTo(intDestFile);
				createEmptyFilesUpTo(intSourceFile);
				linkFile(intDestFile, intSourceFile, strPlugin, strArguments);
			}
			else
			{
				// Event-based linking
				var strEvent = arg1;
				
				if (arrParams_a.length === 2)
				{
					// Remove event link: "link drop"
					intExistingIndex = findEventByName(strEvent);
					if (intExistingIndex >= 0)
					{
						m_arrLinkEvents.splice(intExistingIndex, 1);
						appendOutput("Event link removed: " + strEvent, false, true);
					}
					else
					{
						appendOutput("No event link found for: " + strEvent, false, true);
					}
					ready('cmdLink');
				}
				else
				{
					// Add/overwrite event link: "link drop chatgpt translate to korean"
					var strTransformer = arrParams_a[2];
					strArguments = arrParams_a.slice(3).join(' ');

					if (!strTransformer.endsWith('.xfrm')) 
					{
						strTransformer += '.xfrm';
					}

					// Check if event already exists and remove it
					intExistingIndex = findEventByName(strEvent);
					if (intExistingIndex >= 0)
					{
						m_arrLinkEvents.splice(intExistingIndex, 1);
						appendOutput("Event link replaced: " + strEvent + " => " + strTransformer + ":" + strArguments, false, true);
					}
					else
					{
						appendOutput("Event link added: " + strEvent + " => " + strTransformer + ":" + strArguments, false, true);
					}

					m_arrLinkEvents.push({ eventname: strEvent, transformer: strTransformer, arg: strArguments });
					ready('cmdLink');
				}
			}
		}
	}

	function OLD_cmdLink(arrParams_a) 
	{
		if (arrParams_a.length > 3) 
		{
			if (m_blnLocalStorageSpace)
			{
				errorOutput('Invalid operation for the local space.');
			}
			else
			{
				var intDestFile = getInt(arrParams_a[1].trim(), 10);
				var intSourceFile = getInt(arrParams_a[2].trim(), 10);
				var strPlugin = arrParams_a[3];
				var strArguments = arrParams_a.slice(4).join(' ');
				createEmptyFilesUpTo(intDestFile);
				createEmptyFilesUpTo(intSourceFile);
				linkFile(intDestFile, intSourceFile, strPlugin, strArguments);
			}
		} 
		else 
		{
			errorOutput("Missing parameters.");
			ready('cmdLink');
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

			if ((arrCurrentCode_a.length > m_MAXLISTLINES) && (objRange.from === -Infinity) && (objRange.to === Infinity))
			{
				errorOutput("Too many lines, list a range.");
			}
			else
			{
				processArray(arrCurrentCode_a, function(objLine_a)
				{
					var blnContinue = true;
					var intLineNumber = objLine_a.ln;

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

						intIndentOffsetPre = getIndentOffset(objLine_a.lc, false);
						intIndentOffsetPost = getIndentOffset(objLine_a.lc, true);

						intIndent += intIndentOffsetPre;
						if (intIndent > 0)
						{
							strIndent = '\t'.repeat(intIndent);
						}

						var strLineNumber = padWithSpaces(intLineNumber, m_LINENUMBERWIDTH);
						var strLine = '';
						var strLineCode = objLine_a.lc.trim();
						
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
		}
		ready('cmdList');
	}

	function cmdLogin(arrParams_a)
	{
		var blnImmediate = true;
		var strCommand = '';
		var strUsername = m_strUsername;
		var strPassword = '';

		if (m_blnLoginMode)
		{
			m_blnLoginMode = false;
			m_strUsername = '';
			if (arrParams_a.length === 0)
			{
				blnImmediate = true;
				errorOutput("Missing parameters.");
			}
			else
			{
				strPassword = arrParams_a[0].trim();

				blnImmediate = false;
				strCommand = 'login ' + strUsername + ' ' + strPassword;
				handleServerCommands(strCommand, 0, cbLogin, true);
			}
		}
		else
		{
			if (arrParams_a.length === 1)
			{
				blnImmediate = true;
				errorOutput("Missing parameters.");
			}
			else if (arrParams_a.length === 2)
			{
				strUsername = arrParams_a[1].trim();

				blnImmediate = false;
				m_blnLoginMode = true;
				m_strUsername = strUsername;
				passwordMode(true);
			}
			else if (arrParams_a.length > 2)
			{
				strUsername = arrParams_a[1].trim();
				strPassword = arrParams_a[2].trim();

				blnImmediate = false;
				strCommand = 'login ' + strUsername + ' ' + strPassword;
				handleServerCommands(strCommand, 0, cbLogin, true);
			}
		}

		if (blnImmediate)
		{
			ready('cmdLogin');
		}
	}

	function cmdLTR(blnReady_a)
	{
		m_blnRTL = false;
		//m_objOutput.removeClass("rtlo");
		m_objInput.removeClass("rtli");
		
		if (blnReady_a)
		{
			ready('cmdLTR');
		}
	}

	function cmdMimeType(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			var strMimeType = arrParams_a[1].trim();
			if (strMimeType.length > 0)
			{
				var strMimeTypeEditorFrom = m_arrFiles[m_intCurrentFile].mte;
				var strMimeTypeEditorTo = findMimeTypeEditor('', strMimeType);
				
				if (strMimeTypeEditorFrom === strMimeTypeEditorTo)
				{
					// mimetype can change but no need to change editor behaviour
					m_arrFiles[m_intCurrentFile].mt = findMimeType('', strMimeType);
				}
				else
				{
					// we need to change editor behaviour, for now we don't cater for HEX back to TEXT
	//alert("from:" + strMimeTypeEditorFrom + ", to:" + strMimeTypeEditorTo);				
					var strContent = build(m_arrFiles[m_intCurrentFile].cd);
					
					m_arrFiles[m_intCurrentFile].mte = strMimeTypeEditorTo;
					m_arrFiles[m_intCurrentFile].cd = unbuild(strContent, m_arrFiles[m_intCurrentFile].mte);
				}
			}
		}
		else
		{
			appendOutput(m_arrFiles[m_intCurrentFile].mt);
		}

		ready('cmdMimeType');
	}

	function cmdNew()
	{
		m_arrFiles[m_intCurrentFile].fn = m_NEWFILENAME;
		m_arrFiles[m_intCurrentFile].mt = findMimeType('', m_MIME_TEXTJAVASCRIPT);
		m_arrFiles[m_intCurrentFile].mte = findMimeTypeEditor('', m_MIME_TEXTJAVASCRIPT);
		m_arrFiles[m_intCurrentFile].raw = '';
		m_arrFiles[m_intCurrentFile].rs = 0;
		m_arrFiles[m_intCurrentFile].cd = [];
		m_arrFiles[m_intCurrentFile].st = '';
		m_arrFiles[m_intCurrentFile].dt = false;
		ready('cmdNew');
	}
	
	function cmdNewFile(arrParams_a)
	{
		// Parse arrParams_a to extract parameters and call newFile
		var strMimeType = m_MIME_TEXTJAVASCRIPT;
		var intFile = null;
		
		if (arrParams_a.length > 1)
		{
			var intParam = getInt(arrParams_a[1].trim(), 10);
			if (!isNaN(intParam) && intParam > 0)
			{
				intFile = intParam;
			}
		}
		
		newFile(strMimeType, intFile, false);
	}	

	function cmdPaste(arrParams_a)
	{
		if (arrParams_a.length > 2)
		{
			var intLineNumber = getInt(arrParams_a[1].trim(), 10);
			var intFile = getInt(arrParams_a[2].trim(), 10);
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
					if (objLine_a.ln < intLineNumber)
					{
						if (strStart.length > 0)
						{
							strStart += '\r\n';
						}

						strLine = '';
						strLineCode = objLine_a.lc.trim();
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
						strLineCode = objLine_a.lc.trim();
						if (strLineCode.length > 0)
						{
							strLine = strLineCode;
						}
						strEnd += strLine;
					}
				});

				// take all the lines from intFile into middle
				processArray(m_arrFiles[intFile].cd, function(objLine_a)
				{
					if (strMiddle.length > 0)
					{
						strMiddle += '\r\n';
					}

					strLine = '';
					strLineCode = objLine_a.lc.trim();
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
				m_arrFiles[m_intCurrentFile].cd = unbuild(strNewCode, m_arrFiles[m_intCurrentFile].mte);
				m_arrFiles[m_intCurrentFile].dt = true;
				
				updateLinkedFiles(m_intCurrentFile);
			}
			else
			{
				errorOutput("Invalid parameters.");
			}
		}
		else
		{
			errorOutput("Missing parameters.");
		}

		ready('cmdPaste');
	}
	
	function cmdProject(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			var strAction = arrParams_a[1].trim().toLowerCase();
			
			if (strAction === 'save')
			{
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					cmdProjectSave(arrParams_a);
				}
			}
			else if (strAction === 'load')
			{
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					cmdProjectLoad(arrParams_a);
				}
			}
			else
			{
				// Set project name
				m_strProjectName = arrParams_a[1].trim();
				appendOutput("Project name set to: " + m_strProjectName, false, true);
				ready('cmdProject');
			}
		}
		else
		{
			if (m_strProjectName.length > 0)
			{
				appendOutput("Current project: " + m_strProjectName, false, true);
			}
			else
			{
				appendOutput("No project name set.", false, true);
			}
			ready('cmdProject');
		}
	}

	function cmdProjectLoad(arrParams_a)
	{
		if (arrParams_a.length > 2)
		{
			var strFilename = arrParams_a[2].trim();
			if (!strFilename.endsWith('.prj'))
			{
				strFilename += '.prj';
			}

			loadFile(strFilename, function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					try
					{
						var strContent = objResponse_a.content;
						var objProject = JSON.parse(strContent);

						// Reset file system

						m_arrFiles = [
							createNewFile([], "Run Space", m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0)
						];
						m_strProjectName = objProject.projectName || '';
						m_strProjectFilename = strFilename;
						m_intFiles = objProject.files.length + 1 || 1;
						m_intCurrentFile = 1;

						if (!objProject.files || objProject.files.length === 0)
						{
							finishProjectLoad();
							return;
						}

						// Prepare queue of load "files" to preserve slot/index order
						var arrQueue = [];
						for (var intFile = 0; intFile < objProject.files.length; intFile++)
						{
							arrQueue.push({ fileInfo: objProject.files[intFile], idx: (intFile + 1) });
						}

						// Process files
						function next()
						{
							if (arrQueue.length === 0)
							{
								finishProjectLoad();
								return;
							}

							var objFile = arrQueue.shift();
							var objFileInfo = objFile.fileInfo;
							var intFileIndex = objFile.idx;

							if (objFileInfo.fn === 'Unnamed File')
							{
								m_arrFiles[intFileIndex] = createNewFile([], objFileInfo.fn, objFileInfo.mt, objFileInfo.mte, false, '', 0);
								m_arrFiles[intFileIndex].ln = objFileInfo.ln;
								m_arrFiles[intFileIndex].pl = objFileInfo.pl;
								m_arrFiles[intFileIndex].arg = objFileInfo.arg;
								m_arrFiles[intFileIndex].fl = objFileInfo.fl;
								m_arrFiles[intFileIndex].st = objFileInfo.st;
								next();
							}
							else
							{
								loadFile(objFileInfo.fn, function(objFileResponse_a)
								{
									if (objFileResponse_a.error.length === 0)
									{
										strContent = objFileResponse_a.content;

										m_arrFiles[intFileIndex] = createNewFile([], objFileInfo.fn, objFileInfo.mt, objFileInfo.mte, false, strContent, strContent.length);
										var arrUnbuilt = unbuild(strContent, objFileInfo.mte);	// this is the editable version
										m_arrFiles[intFileIndex].cd = arrUnbuilt;
										
										m_arrFiles[intFileIndex].ln = objFileInfo.ln;
										m_arrFiles[intFileIndex].pl = objFileInfo.pl;
										m_arrFiles[intFileIndex].arg = objFileInfo.arg;
										m_arrFiles[intFileIndex].fl = objFileInfo.fl;
										m_arrFiles[intFileIndex].st = objFileInfo.st;

										appendOutput("File loaded: " + objFileInfo.fn, false, true);
									}
									else
									{
										errorOutput("Could not load " + objFileInfo.fn);
										m_arrFiles[intFileIndex] = createNewFile([], objFileInfo.fn, objFileInfo.mt, objFileInfo.mte, false, '', 0 );

										m_arrFiles[intFileIndex].ln = objFileInfo.ln;
										m_arrFiles[intFileIndex].pl = objFileInfo.pl;
										m_arrFiles[intFileIndex].arg = objFileInfo.arg;
										m_arrFiles[intFileIndex].fl = objFileInfo.fl;
										m_arrFiles[intFileIndex].st = objFileInfo.st;
									}
									next();
								});
							}
						}
						next();

						function finishProjectLoad()
						{
							// Now that all slots are filled, resolve links and rebuild linked files
							for (var intFile = 0; intFile < m_intFiles; intFile++)
							{
								var intLinkTo = m_arrFiles[intFile].ln;
								if (intLinkTo !== null)
								{
									if (intLinkTo >= 0 && intLinkTo < m_arrFiles.length && m_arrFiles[intLinkTo])
									{
										if (m_arrFiles[intLinkTo].cd.length > 0)
										{
											//var strSourceCode = build(m_arrFiles[intLinkTo].cd);
											updateLinkedFile(m_arrFiles[intLinkTo], m_arrFiles[intFile], function() {});
										}
									}
								}
							}
							appendOutput("Project loaded: " + m_strProjectName, false, true);
							ready('cmdProjectLoad');
						}
					}
					catch (objException_a)
					{
						errorOutput("Error parsing project file: " + objException_a.message);
						ready('cmdProjectLoad');
					}
				}
				else
				{
					errorOutput("Error loading project: " + objResponse_a.error);
					ready('cmdProjectLoad');
				}
			});
		}
		else
		{
			errorOutput("Missing filename.");
			ready('cmdProjectLoad');
		}
	}

	function cmdProjectSave(arrParams_a)
	{
		if (arrParams_a.length > 2)
		{
			var strFilename = arrParams_a[2].trim();
			
			// Add .prj if not present
			if (!strFilename.endsWith('.prj'))
			{
				strFilename += '.prj';
			}
			
			var objProject = {
				projectName: m_strProjectName,
				files: []
			};
			
			// Save file metadata (not content)
			var blnIgnoreFirst = true;
			processArray(m_arrFiles, function(objFile_a)
			{
				if (blnIgnoreFirst)
				{
					blnIgnoreFirst = false;
				}
				else
				{
					objProject.files.push({
						fn: objFile_a.fn,
						mt: objFile_a.mt,
						mte: objFile_a.mte,
						ln: objFile_a.ln,
						pl: objFile_a.pl,
						arg: objFile_a.arg,
						fl: objFile_a.fl,
						st: objFile_a.st
						// Deliberately exclude: raw, rs, cd, dt
					});
				}
			});
			
			var strProjectJson = JSON.stringify(objProject, null, 2);
			
			saveFile(strFilename, strProjectJson, function(objResponse_a)
			{
				if (objResponse_a.error.length === 0)
				{
					m_strProjectFilename = strFilename;
					appendOutput("Project saved to: " + strFilename, false, true);
				}
				else
				{
					errorOutput("Error saving project: " + objResponse_a.error);
				}
				ready('cmdProjectSave');
			});
		}
		else
		{
			errorOutput("Missing filename.");
			ready('cmdProjectSave');
		}
	}
	
	function cmdRenum()
	{
		m_arrFiles[m_intCurrentFile].cd = unbuild(build(m_arrFiles[m_intCurrentFile].cd, false), m_arrFiles[m_intCurrentFile].mte);
		ready('cmdRenum');
	}

	function cmdReset(blnSuppressReady_a)
	{
		m_arrCommandHistory = [];
		m_intHistoryIndex = -1;

		m_intFiles = 2;
		m_intCurrentFile = 1;
		m_arrFiles = [
			createNewFile([], "Run Space", m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0),
			createNewFile([], m_NEWFILENAME, m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0)
		];
		m_arrOutput = [];
		eval("m_objG = {};");
		m_blnRTL = false;
		eval("m_objG.console = m_objThis;");

		clearInput('cmdReset');
		clearOutput();
		
		if (m_blnLocalStorageAvailable)
		{
			appendOutput("Local storage is available.", false, true);
		}
		else
		{
			appendOutput("Local storage is UNAVAILABLE.", false, true);
		}

		//var strCommand = 'run desktop.js';
		//var arrParams = strCommand.split(' ');
		//cmdRun(arrParams);
		cmdValidateCookie(blnSuppressReady_a);
	}
	
	function cmdRTL(blnReady_a)
	{
		m_blnRTL = true;
		//m_objOutput.addClass("rtlo");
		m_objInput.addClass("rtli");
		
		if (blnReady_a)
		{
			ready('cmdRTL');
		}
	}

	function cmdRun(arrParams_a)
	{
		var blnImmediate = true;
		var strBuild = '';

		if (arrParams_a.length > 1)
		{
			if (m_blnLocalStorageSpace)
			{
				errorOutput('Invalid operation for the local space.');
			}
			else
			{
				var strFilename = arrParams_a[1].trim();
				if (strFilename.length > 0)
				{
					blnImmediate = false;
					loadProgram(strFilename, function(objResponse_a)
					{
						var strContent = objResponse_a.content;
						if (strContent.length > 0)
						{
							m_arrFiles[0].fn = strFilename;
							m_arrFiles[0].mt = findMimeType(strFilename, '');
							m_arrFiles[0].mte = findMimeTypeEditor(strFilename, '');
							m_arrFiles[0].raw = strContent;
							m_arrFiles[0].rs = strContent.length;
							m_arrFiles[0].cd = unbuild(strContent, m_arrFiles[0].mte);
							m_arrFiles[0].dt = false;
							strBuild = build(m_arrFiles[0].cd, false);
							
							runJS(strBuild, arrParams_a);
						}
					});
				}
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
		if (m_blnLocalStorageSpace)
		{
			errorOutput('Invalid operation for the local space.');
			return;
		}

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
				ready('cmdSaveAll');
			}
		}
		
		next();
	}
	
	function cmdSpace(arrParams_a, strInput_a)
	{
	   if (arrParams_a.length > 1 && arrParams_a[1].trim().toLowerCase() === 'local')
	   {
		   if (m_blnLocalStorageAvailable)
		   {
			   m_blnLocalStorageSpace = true;
			   appendOutput("Space is now local.", false, true);
			   ready('cmdSpace');
		   }
		   else
		   {
			   errorOutput("Local storage unavailable.");
			   ready('cmdSpace');
		   }
	   }
	   else if (arrParams_a.length > 1)
	   {
		   // Switching to non-local space
		   m_blnLocalStorageSpace = false;
		   handleServerCommands(strInput_a, 1);
	   }
	   else
	   {
		   if (m_blnLocalStorageSpace)
		   {
			   appendOutput("local", false, true);
			   ready('cmdSpace');
		   }
		   else
		   {
			   handleServerCommands(strInput_a, 1);
		   }
	   }
	}
   
	function cmdTouch(arrParams_a)
	{
		if (arrParams_a.length > 1)
		{
			var intFile = getInt(arrParams_a[1].trim(), 10);
			if (intFile < 0)
			{
				errorOutput("Invalid file number.");
				ready('cmdTouch');
			}
			else if (intFile > m_intFiles)
			{
				errorOutput("File does not exist.");
				ready('cmdTouch');
			}
			else
			{
				// Update file stats and trigger cascade
				updateFileStats(intFile);
				updateLinkedFiles(intFile);
				ready('cmdTouch');
			}
		}
		else
		{
			errorOutput("Missing file number.");
			ready('cmdTouch');
		}
	}

	function cmdType(arrParams_a)
	{
		if (m_blnLocalStorageSpace)
		{
			errorOutput('Invalid operation for the local space.');
			return;
		}

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
					var arrCurrentCode = unbuild(objResponse_a.content, m_EDIT_TEXT);
					cmdList(arrCurrentCode, strSelection);
				});
			}
		}

		if (blnImmediate)
		{
			ready('cmdType');
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

	function cbSpaces(objResponse_a)
	{
		var strMessage = objResponse_a.message;
		if (m_blnLocalStorageAvailable)
		{
			strMessage = str_replace(strMessage, "home", "home\nlocal");
		}
		appendOutput(strMessage, false);
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
			
			if (m_strAutorun !== null && m_strAutorun.length > 0)
			{
				processCommand(m_strAutorun);
			}
		}
	}

	// command processors
	function processCommand(strInput_a, cb_a, blnSuppressReady_a)
	{
		var strInput = strInput_a;
		var strFirstChar = strInput[0];

		if (strFirstChar === '!')
		{
			var strTemp = strInput.slice(1);
			var strHandler = loadLocalData(m_LOCALSTORAGECONFIG + 'ai-handler');

			if ((strHandler !== null) && (strHandler.length > 0))
			{
				strInput = 'run ' + strHandler + '.js ' + strTemp;
			}
		}

		var blnSuppressReady = blnSuppressReady_a;
		var arrParams = strInput.split(' ');
		var strCommand = arrParams[0];
		var intLineNumber = getInt(strCommand, 10);
		
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
			// if our command is a number, then we are modifying a line
			// we are adding, replace or deleting a line
			cmdAddReplaceDeleteLine(intLineNumber, strInput, blnSuppressReady);
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
					handleServerCommands('run ' + strInput, 1);
				}
				break;
				
				case 'clear':
				case 'cls':
				cmdCLS();
				break;

				case 'config':
				cmdConfig(arrParams);
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
				
				case 'flavor':
				case 'flavour':
				cmdFlavour(arrParams);
				break;
				
				case 'link':
				cmdLink(arrParams);
				break;

				case 'list':
				var strSelection = arrParams[1];
				cmdList(m_arrFiles[m_intCurrentFile].cd, strSelection);
				break;

				case 'ltr':
				cmdLTR(true);
				break;

				case 'mimetype':
				cmdMimeType(arrParams);
				break;

				case 'new':
				cmdNew();
				break;
				
				case 'newfile':
				cmdNewFile(arrParams);
				break;
				
				case 'paste':
				cmdPaste(arrParams);
				break;

				case 'project':
				cmdProject(arrParams);
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
				cmdRun(arrParams, arrParams);
				break;

				case 'touch':
				cmdTouch(arrParams);
				break;

				case 'type':
				cmdType(arrParams);
				break;
				
				case 'width':
				cmdWidth();
				break;

				case 'notes':		// general
				case 'startup':		// general
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					handleServerCommands(strInput, 1, cbStartup);
				}
				break;

				case 'login':		// account
				cmdLogin(arrParams);
				break;

				case 'validatecookie':// account
				handleServerCommands(strInput, 0, cbValidateCookie, blnSuppressReady);
				break;

				case 'spaces':		// file
				handleServerCommands(strInput, 0, cbSpaces, false, true);
				break;

				case 'cat':			// file
				case 'dir':			// file
				case 'ls':			// file
				cmdDir(arrParams, strInput);
				break;

				case 'device':		// general
				case 'devices':		// general
				case 'language':	// general
				case 'languages':	// general

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
				handleServerCommands(strInput, 0);
				break;

				case 'cd':			// file
				case 'chdir':		// file
				case 'cs':			// file
				case 'space':		// file
				cmdSpace(arrParams, strInput);
				break;

				case 'del':			// file
				case 'delete':		// file
				case 'era':			// file
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					handleServerCommands(strInput, 1);
				}
				break;

				case 'help':		// file
				handleServerCommands(strInput, 1);
				break;
				
				case 'load':		// file
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					handleServerCommands(strInput, 1, null, false, false, false, true);
				}
				break;

				case 'saveall':		// file
				cmdSaveAll();
				break;

				case 'save':		// file
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					handleServerCommands(strInput, 1, null, false, false, false, false, true);
				}
				break;

				case 'copy':		// file
				case 'cp':			// file

				case 'mv':			// file
				case 'ren':			// file
				case 'rename':		// file
				if (m_blnLocalStorageSpace)
				{
					errorOutput('Invalid operation for the local space.');
				}
				else
				{
					handleServerCommands(strInput, 2);
				}
				break;

				default:
				processCommandDefault(strInput, arrParams);
				break;
			}
		}
	}
	
	function processCommandDefault(strInput_a)
	{
		var arrParams = strInput_a.split(' ');
		
		if (arrParams[0].indexOf('(') !== -1 || arrParams[0].indexOf(')') !== -1)
		{
			runJS(strInput_a);
		}
		else
		{
			if (!arrParams[0].endsWith('.js'))
			{
				arrParams[0] = arrParams[0] + '.js';
			}
			arrParams.unshift('run');
			cmdRun(arrParams, arrParams);
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
	
	this.deleteLocalData = function(strFilename_a, cb_a)
	{
		var blnResult = deleteLocalData(m_LOCALSTORAGECONFIG + strFilename_a);
		cb_a(blnResult);
	};
	
	this.end = function()
	{
		ready('end', false);
		//scrollContainer();
	};
	
	this.errorOutput = function(strError_a)
	{
		errorOutput(strError_a);
	};

	this.fileStatus = function(strCurrentStatus_a, strNewStatus_a, blnCheckAllFiles_a)
	{
		var blnCheckAllFiles = blnCheckAllFiles_a || false;
		var blnResult = false;
		
		if (strCurrentStatus_a === '' && blnCheckAllFiles) 
		{
			// Check if ANY file has the new status
			var blnFound = false;
			for (var intI = 0; intI < m_arrFiles.length; intI++) 
			{
				if (m_arrFiles[intI].st === strNewStatus_a) 
				{
					blnFound = true;
					break;
				}
			}
			
			if (!blnFound) 
			{
				m_arrFiles[m_intCurrentFile].st = strNewStatus_a;
				blnResult = true;
			}
		} 
		else 
		{
			// Original behavior - check/set on current file only
			if (m_arrFiles[m_intCurrentFile].st === strCurrentStatus_a) 
			{
//alert(m_arrFiles[m_intCurrentFile].st + ":" + strNewStatus_a);
				m_arrFiles[m_intCurrentFile].st = strNewStatus_a;
				blnResult = true;
			}
		}
		
		return blnResult;
	};
	
	this.getCurrentFile = function()
	{
		return m_arrFiles[m_intCurrentFile];
	};

	this.handleServerCommands = function(strInput_a, intFileCount_a, cb_a)
	{
		handleServerCommands(strInput_a, intFileCount_a, cb_a, true, true, true);
	};
	
	this.injectFile = function(strMimeType_a, strContent_a)
	{
		newFile(strMimeType_a, null, false);
		m_arrFiles[m_intCurrentFile].raw = strContent_a;
		m_arrFiles[m_intCurrentFile].rs = strContent_a.length;
		m_arrFiles[m_intCurrentFile].cd = unbuild(strContent_a, m_arrFiles[m_intCurrentFile].mte);
		m_arrFiles[m_intCurrentFile].dt = false;
	};
	
	this.input = function(strDefault_a, cb_a)
	{
		m_cbInput = cb_a;
		m_intInputDepth++;
		m_strInputDefault = strDefault_a;
		m_objInput.focus();

		afterDOM(function() 
		{
			m_objInput.val(m_strInputDefault);
		});
	};
	
	this.isFunction = function(fn_a)
	{
		var getType = {};
		return fn_a && getType.toString.call(fn_a) === '[object Function]';
	};

	this.loadFile = function(strFilename_a, cb_a)
	{
		loadFile(strFilename_a, cb_a);
	};
	
	this.loadLocalData = function(strFilename_a, cb_a)
	{
		var objData = loadLocalData(m_LOCALSTORAGECONFIG + strFilename_a);
		cb_a(objData);
	};
	
	this.saveLocalData = function(strFilename_a, objData_a, cb_a)
	{
		var blnResult = saveLocalData(m_LOCALSTORAGECONFIG + strFilename_a, objData_a);
		cb_a(blnResult);
	};
	
	this.newFile = function(strMimeType_a)
	{
		newFile(strMimeType_a, null, false);
	};

	this.saveFile = function(strFilename_a, objData_a, cb_a)
	{
		saveFile(strFilename_a, objData_a, cb_a);
	};

	this.stop = function()
	{
		ready('stop', false);
		//scrollContainer();
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

		m_objInput.on('paste', function(objEvent_a)
		{
			inputCommand_onPaste(objEvent_a);
		});

		m_objInput.on('keydown', function(objEvent_a)
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


		function handleFileDrop(arrDroppedFiles_a)
		{
			var intI;
			var intLoaded = 0;

			// Load all files asynchronously and collect contents
			for (intI = 0; intI < arrDroppedFiles_a.length; intI++)
			{
				(function(intFile_a) 
				{
					var objFile = arrDroppedFiles_a[intFile_a];
					var objReader = new FileReader();

					objReader.onload = function(objEvent_a)
					{
						arrDroppedFiles_a[intFile_a].content = objEvent_a.target.result; 
						intLoaded++;

						if (intLoaded === arrDroppedFiles_a.length)
						{
							// All files have been loaded, now process!
							doProjectFromDrop(arrDroppedFiles_a);
						}
					};

					objReader.onerror = function(objEvent_a)
					{
						arrDroppedFiles_a[intFile_a].content = null; 
						intLoaded++;

						if (intLoaded === arrDroppedFiles_a.length)
						{
							doProjectFromDrop(arrDroppedFiles_a);
						}
						errorOutput("Failed to read file: " + objFile.name);
					};

					var strMimeTypeEditor = findMimeTypeEditor(objFile.name, objFile.type);
					if (strMimeTypeEditor === m_EDIT_TEXT) 
					{
						objReader.readAsText(objFile);
					} 
					else 
					{
						objReader.readAsBinaryString(objFile);
					}
				})(intI);
			}
		}

		function doProjectFromDrop(arrDroppedFiles_a)
		{
			var arrDroppedFilenames = [];
			var intI;
			var intRawSize;
			var objNewFile;
			var strContent;
			var strFileName = "";
			var strMimeType = "";
			var strMimeTypeEditor = "";

			for (intI = 0; intI < arrDroppedFiles_a.length; intI++)
			{
				arrDroppedFilenames.push(arrDroppedFiles_a[intI].name);
			}

			var intEventIndex = findEventByName("drop");
			
			if (intEventIndex >= 0)
			{
				m_strProjectName = 'DroppedProject';

				var objEvent = m_arrLinkEvents[intEventIndex];
				var strPluginName = objEvent.transformer;
				var objProject = createProjectTemplate(m_strProjectName, arrDroppedFilenames, strPluginName, objEvent.arg);
				
				// Reset file system like cmdProjectLoad does
				m_arrFiles = [
					createNewFile([], "Run Space", m_MIME_TEXTJAVASCRIPT, m_EDIT_TEXT, false, '', 0)
				];
				
				m_intFiles = 1; // Start with just Run Space
				m_intCurrentFile = 1;

				// Now create the project files
				for (intI = 0; intI < objProject.files.length; intI++)
				{
					strFilename = objProject.files[intI].fn;
					
					// note: intFileIndex >= 0 means it was a dropped file, not one created by the project setup
					var intFileIndex = arrDroppedFilenames.indexOf(strFilename);
					
					strContent = "";
					intRawSize = 0;
					if (intFileIndex >= 0)
					{
						strContent = arrDroppedFiles_a[intFileIndex].content;
						intRawSize = arrDroppedFiles_a[intFileIndex].size;

						strMimeType = findMimeType(strFileName, arrDroppedFiles_a[intFileIndex].type);
						strMimeTypeEditor = findMimeTypeEditor(strFileName, arrDroppedFiles_a[intFileIndex].type);

						objNewFile = createNewFile([], strFilename, strMimeType, strMimeTypeEditor, true, strContent, intRawSize);
						objNewFile.cd = unbuild(strContent, strMimeTypeEditor);
					}
					else
					{
						objNewFile = createNewFile([], strFilename, objProject.files[intI].mt, objProject.files[intI].mte, false, strContent, intRawSize);

						objNewFile.ln = objProject.files[intI].ln;
						objNewFile.pl = objProject.files[intI].pl;
						objNewFile.arg = objProject.files[intI].arg;
						objNewFile.cd = unbuild(strContent, m_EDIT_TEXT);
						objNewFile.dt = true;
					}
					
					// Add to array and increment counter
					m_arrFiles.push(objNewFile);
					m_intFiles++;
				}

				// After creating project files, load the drop event transformer
				var intPluginFileIndex = findPluginFile(strPluginName);

				if (intPluginFileIndex !== -1)
				{
					// Plugin file exists but is empty, load its content
					loadFile(strPluginName, function(objResponse_a) 
					{
						if (objResponse_a.error.length === 0) 
						{
							strContent = objResponse_a.content;
							m_arrFiles[intPluginFileIndex].raw = strContent;
							m_arrFiles[intPluginFileIndex].rs = strContent.length;
							m_arrFiles[intPluginFileIndex].cd = unbuild(strContent, m_EDIT_TEXT);
							
							// Now trigger transformations for linked files
							updateLinkedFiles(); // Start with first source file
						}
					});
				}

				appendOutput("Project created from dropped files with event 'drop'.", false, true);
			}
			else
			{
				// Manual/legacy: add/overwrite file slots using loaded content
				for (intI = 0; intI < arrDroppedFiles_a.length; intI++)
				{
					strFileName = arrDroppedFiles_a[intI].name;
					strMimeType = findMimeType(strFileName, arrDroppedFiles_a[intI].type);
					strMimeTypeEditor = findMimeTypeEditor(strFileName, arrDroppedFiles_a[intI].type);
					
					strContent = arrDroppedFiles_a[intI].content;
					intRawSize = arrDroppedFiles_a[intI].size;

					var intSlot = findFileByName(strFileName);

					if (intSlot === -1)
					{
						intSlot = m_arrFiles.length;
						newFile(m_MIME_TEXTJAVASCRIPT, null, true);
					}

					m_arrFiles[intSlot].fn = strFileName;
					m_arrFiles[intSlot].mt = strMimeType;
					m_arrFiles[intSlot].mte = strMimeTypeEditor;
					m_arrFiles[intSlot].raw = strContent;
					m_arrFiles[intSlot].rs = intRawSize;
					m_arrFiles[intSlot].cd = unbuild(strContent, strMimeTypeEditor);
					m_arrFiles[intSlot].dt = true;
				}
				appendOutput("Files loaded (no event detected).", false, true);
			}
		}

		m_objContainer.on('drop', function(objEvent_a) 
		{
			m_objContainer.removeClass('dragover-highlight');
			objEvent_a.preventDefault();

			var arrFiles = objEvent_a.originalEvent.dataTransfer.files;
			// Pass all files to your new handler:
			handleFileDrop(arrFiles);
		});
	};
}