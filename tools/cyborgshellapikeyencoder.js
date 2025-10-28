// Cyborg ZOSCII v20250805
// (c) 2025 Cyborg Unicorn Pty Ltd.
// This software is released under MIT License.

var g_arrRomData = null;
var g_strTextData = ""; // ALL lines from the text input
var g_arrIndividualResults = []; // Stores the result object for each API key line
var g_objEncodingResult = null; // Stores the aggregated result (superset addresses, combined counts)
var g_BITTAGE = 16;		// 16 or 32 bits

var g_strDateTime = "";

window.onload = function()
{
    setupDropZones();
    setupButtons();
};

function calculateROMStrengthGeneral(objEncodingResult_a)
{
    var intI;
    var fltLogSum = 0.0;
    
    for (intI = 0; intI < 256; intI++)
    {
        if (objEncodingResult_a.romCounts[intI] > 0)
        {
            fltLogSum += Math.log10(objEncodingResult_a.romCounts[intI]);
        }
    }
    
    return fltLogSum;
}

// now caters for duplicate which have two real meanings...
// 1. it can indicate less security if the type of data encoded is known
// 2. no impact to security if the type of data encoded is NOT known
function calculateROMStrengthFile(objEncodingResult_a, blnDataTypeKnown_a)
{
	var blnDataTypeKnown = blnDataTypeKnown_a;
	if (blnDataTypeKnown === undefined) { blnDataTypeKnown = false; }

    var fltLogSum = 0.0;
    var intI;
    
    if (!blnDataTypeKnown) 
    {
        // Scenario 2: Data type unknown - use original calculation
        // Address repetitions don't reveal semantic meaning
        for (intI = 0; intI < 256; intI++)
        {
            if (objEncodingResult_a.inputCounts[intI] > 0 && objEncodingResult_a.romCounts[intI] > 0)
            {
                fltLogSum += objEncodingResult_a.inputCounts[intI] * Math.log10(objEncodingResult_a.romCounts[intI]);
            }
        }
        return fltLogSum;
    }
    else
    {
        // Scenario 1: Data type known - calculate reduction for THIS FILE
        
        // Build frequency distribution for this specific file
        var arrFrequencies = [];
        var intTotalInputLength = 0;
        
        for (intI = 0; intI < 256; intI++)
        {
            if (objEncodingResult_a.inputCounts[intI] > 0)
            {
                arrFrequencies.push({
                    frequency: objEncodingResult_a.inputCounts[intI],
                    romCount: objEncodingResult_a.romCounts[intI]
                });
                intTotalInputLength += objEncodingResult_a.inputCounts[intI];
            }
        }
        
        // Sort by frequency (highest leak risk first)
		arrFrequencies.sort(function(intA_a, intB_a) 
		{
			return intB_a.frequency - intA_a.frequency;
		});
        
        // Calculate expected unique addresses for THIS FILE's encoding
        var fltExpectedUniqueAddresses = 0;
        
        for (intI = 0; intI < arrFrequencies.length; intI++)
        {
            var objFreq = arrFrequencies[intI];
            // Expected unique addresses for this character type
            var fltUnique = objFreq.romCount * (1 - Math.pow(1 - 1/objFreq.romCount, objFreq.frequency));
            fltExpectedUniqueAddresses += fltUnique;
        }
        
        // File security is based on unique address count for THIS FILE
        return Math.log10(fltExpectedUniqueAddresses);
    }
}

function checkEncodeReady() 
{
    // Ready if ROM data is loaded and text input is not empty (after trimming whitespace/newlines)
    var blnReady = g_arrRomData && g_strTextData.trim().length > 0;
    document.getElementById("verifyBtn").disabled = !blnReady;
}

function displayAnalysis(objEncodingResult_a) 
{
	var intI;
    var strHtml = '<div class="scrollable-content"><h3>Encoding Results</h3>';
	
	g_strDateTime = new Date().getTime();
	
    strHtml += "<div class='row'>";
    strHtml += "<div class='col-md-6'>";
    strHtml += "<h5>Input Information (Combined)</h5>";
	strHtml += "<table class='table table-sm analysis-table'>";
	strHtml += "<colgroup><col style='width: 40%;'><col style='width: 60%;'></colgroup>";

    var arrKeys = objEncodingResult_a.originalText.split('\n').map(function(strKey_a) 
    {
        return strKey_a.trim();
    }).filter(function(strKey_a) 
    {
        return strKey_a.length > 0;
    });
    
    var strDisplayText = arrKeys.slice(0, 3).join('; ');
    if (arrKeys.length > 3)
    {
        strDisplayText += '...';
    }
    
    strHtml += "<tr><td>>Total Input Keys:</td><td>" + arrKeys.length + "</td></tr>";
    strHtml += "<tr><td>>Combined Length:</td><td>" + objEncodingResult_a.inputLength + " bytes</td></tr>";
    strHtml += "<tr><td>>Encoding:</td><td>" + objEncodingResult_a.encoding.toUpperCase() + "</td></tr>";
    strHtml += "<tr><td>>Superset Addresses:</td><td>" + objEncodingResult_a.addressCount + "</td></tr>";
    strHtml += "</table>";
    strHtml += "</div>";
    
	strHtml += displayROMStrength(objEncodingResult_a);
    strHtml += "</div>";

    // --- Setup Download Encoded Data Buttons ---
    strHtml += "<div class='mt-4'>";
    strHtml += "<h5>Download Encoded Data</h5>";
    strHtml += "<p>Use the keys verified to generate a Filter ROM or a list of addresses:</p>";

    var strFilterRomButtonText = "64KB";
    if (g_BITTAGE === 32)
    {
        strFilterRomButtonText = "Full Range";
    }
    strHtml += "<button class='btn btn-success me-2' id='generateFilterRomBtn'>Generate Filter ROM (" + strFilterRomButtonText + ")</button>";
    strHtml += "<button class='btn btn-success' id='downloadAddressesBtn'>Download Key/Address List</button>";
    strHtml += "<div id='viewerResult' class='mt-3'></div>";
    strHtml += "</div>";
    
    // --- Individual Encoded Keys Display ---
    strHtml += "<div class='mt-4'>";
    strHtml += "<h5>Individual Encoded Keys (Addresses)</h5>";
    strHtml += "<textarea id='individualEncodedKeys' class='form-control' style='height: 150px; font-size:12px; font-family: monospace;' readonly>";

    var strEncodedKeys = g_arrIndividualResults.map(function(objResult_a) 
    {
        var strEncodedAddressStream = objResult_a.addresses.map(function(intAddr_a) 
        {
            return intAddr_a.toString(16).toUpperCase().padStart(4, '0');
        }).join('');
        
        return objResult_a.originalText + " | " + strEncodedAddressStream; 
    }).join('\n');
    
    strHtml += strEncodedKeys;
    strHtml += "</textarea>";
    strHtml += "<small class='text-muted'>Each line shows: [Original Key] | [Encoded Address Stream]</small>";
    strHtml += "</div>";
    
    // --- Character Usage Section ---
	strHtml += "<div class='mt-4'>";
	strHtml += "<h5>Character Usage (Combined)</h5>";
    strHtml += "<table class='table table-sm analysis-table'><thead><tr><th>Byte</th><th>Dec</th><th>ROM Count</th><th>Input Count</th><th>Char</th></tr></thead><tbody>";
    
	for (var intByte = 0; intByte < 256; intByte++) 
	{
        var intROMCount   = objEncodingResult_a.romCounts[intByte];
		var intInputCount = objEncodingResult_a.inputCounts[intByte];
        var strChar       = '';
        var strStyle      = "";
		
        if (intByte >= 32 && intByte <= 126) 
		{ 
            strChar = String.fromCharCode(intByte);
            if (intROMCount >= 5) 
			{
                strStyle = "color:#155724;background:#d4edda;";
            } 
			else 
			{
                strStyle = "color:#721c24;background:#f8d7da;";
            }
        } 
		else 
		{
            strChar = '&nbsp;';
            if (intROMCount >= 5) 
			{
				strStyle = "color:#6c757d;background:#f8f9fa;";
            } 
			else 
			{
                strStyle = "color:#721c24;background:#f8d7da;";
            }
        }

		var strHexByte = intByte.toString(16).toUpperCase();
        
		if (strHexByte.length < 2)
		{
			strHexByte = "0" + strHexByte;
		}
		
        strHtml += "<tr style='" + strStyle + "'>";
		strHtml += "<td>0x" + strHexByte + "</td>";
        strHtml += "<td>" + intByte + "</td>";
        strHtml += "<td>" + intROMCount + "</td>";
		strHtml += "<td>" + intInputCount + "</td>";
        strHtml += "<td>" + strChar + "</td>";
        strHtml += "</tr>";
    }
    strHtml += "</tbody></table></div></div>";
    
    document.getElementById("analysisContent").innerHTML = strHtml;

    // --- Setup Generate Filter ROM Button (32-bit Compatible) ---
    document.getElementById("generateFilterRomBtn").addEventListener("click", function() 
    {
        var intI;
        var objUsedAddresses = {}; 
        var arrAddresses     = g_objEncodingResult.addresses;
        
        this.disabled    = true;
        this.textContent = "Filtering...";
        
        // 1. Get the superset of used addresses
        for (intI = 0; intI < arrAddresses.length; intI++) 
        {
            objUsedAddresses[arrAddresses[intI]] = true;
        }
        
        // 2. DETERMINE ROM SIZE BASED ON g_BITTAGE (32-bit Logic)
        var intMaxSize;
        if (g_BITTAGE === 16) 
        {
            intMaxSize = 65536; 
        } 
        else if (g_BITTAGE === 32) 
        {
            intMaxSize = 4294967296; 
        } 
        else 
        {
            intMaxSize = 65536;
        }
        
        var intRomSize = Math.min(g_arrRomData.length, intMaxSize);
        
        // 3. Create the Filter ROM
        var arrFilterRom = new Uint8Array(intRomSize);
        
        for (intI = 0; intI < intRomSize; intI++) 
        {
            if (objUsedAddresses[intI]) 
            {
                arrFilterRom[intI] = g_arrRomData[intI];
            } 
            else 
            {
                arrFilterRom[intI] = 0;
            }
        }

        // 4. Download the new ROM
        downloadFile(arrFilterRom, 'zoscii_filter_rom_' + g_strDateTime + '.bin', 'application/octet-stream');
        
        var strResultHtml = "<div class='alert alert-success'>";
        strResultHtml += "<strong>Filter ROM generated successfully!</strong><br>";
        strResultHtml += "Use this " + (g_BITTAGE === 32 ? "Full Range (32-bit)" : "64KB (16-bit)") + " Filter ROM in place of your original ROM. It provides plausible deniability if compromised.";
        strResultHtml += "</div>";
        document.getElementById("viewerResult").innerHTML = strResultHtml;
        
        var strButtonText = "64KB";
        if (g_BITTAGE === 32)
        {
            strButtonText = "Full Range";
        }

        this.disabled    = false;
        this.textContent = "Generate Filter ROM (" + strButtonText + ")";
    });

    // --- Setup Download Encoded Addresses Button ---
    document.getElementById("downloadAddressesBtn").addEventListener("click", function() 
    {
        this.disabled    = true;
        this.textContent = "Preparing List...";

        var strDownloadContent = "";
        
        g_arrIndividualResults.forEach(function(objResult_a) 
        {
            var strOriginalKey = objResult_a.originalText;
            
            var strEncodedKey = objResult_a.addresses.map(function(intAddr_a) 
            {
                return intAddr_a.toString(16).toUpperCase().padStart(4, '0');
            }).join('');
            
            strDownloadContent += strOriginalKey + "\n"; 
            strDownloadContent += strEncodedKey + "\n"; 
            strDownloadContent += "\n"; 
        });

        downloadFile(strDownloadContent, 'zoscii_key_address_list_' + g_strDateTime + '.txt', 'text/plain');

        var strResultHtml = "<div class='alert alert-success'>";
        strResultHtml += "<strong>Key/Address List generated successfully!</strong><br>";
        strResultHtml += "Text file downloaded. Contains [Original Key, Encoded Address Line (2-byte hex stream), Blank Line] for all inputs.";
        strResultHtml += "</div>";
        document.getElementById("viewerResult").innerHTML = strResultHtml;
        
        this.disabled    = false;
        this.textContent = "Download Key/Address List";
    });
}

function displayROMStrength(objEncodingResult_a)
{
    var fltGeneralStrength = calculateROMStrengthGeneral(objEncodingResult_a);
    var fltFileStrength = calculateROMStrengthFile(objEncodingResult_a);
    var intCharactersUsed = 0;
    
    for (var intI = 0; intI < 256; intI++)
    {
        if (objEncodingResult_a.inputCounts[intI] > 0)
        {
            intCharactersUsed++;
        }
    }
    
    var fltUtilization = (intCharactersUsed / 256.0) * 100.0;
    
	var strHtml = "<div class='mt-4 col-md-6'>";
	strHtml += "<h5>ROM Strength Analysis</h5>";
	strHtml += "<table class='table table-sm analysis-table'>";
	strHtml += "<colgroup><col style='width: 40%;'><col style='width: 30%;'><col style='width: 30%;'></colgroup>";
	strHtml += "<tr><td>General ROM Capacity:</td><td>~10^" + fltGeneralStrength.toFixed(0) + "</td><td>" + exponentToLayman(fltGeneralStrength) + "</td></tr>";
	strHtml += "<tr><td>This Key Set Security:</td><td>~10^" + fltFileStrength.toFixed(0) + "</td><td>" + exponentToLayman(fltFileStrength) + "</td></tr>";
	strHtml += "<tr><td>Characters Utilized:</td><td>" + intCharactersUsed + " of 256 (" + fltUtilization.toFixed(1) + "%)</td><td></td></tr>";
	strHtml += "</table>";
	strHtml += "</div>";
    
    return strHtml;
}

function downloadFile(objData_a, strFilename_a, strMimeType_a) 
{
    var objBlob = new Blob([objData_a], {type: strMimeType_a});
    var objUrl = URL.createObjectURL(objBlob);
    var objLink = document.createElement('a');
    objLink.href = objUrl;
    objLink.download = strFilename_a;
    document.body.appendChild(objLink);
    objLink.click();
    document.body.removeChild(objLink);
    URL.revokeObjectURL(objUrl);
}

function escapeHtml(strText_a) 
{
    var objDiv = document.createElement('div');
    objDiv.textContent = strText_a;
    return objDiv.innerHTML;
}

function exponentToLayman(fltExponent_a)
{
    var intRounded = Math.round(fltExponent_a);
    var strResult = "";

    if (intRounded <= 0)
    {
        strResult = "1";
    }
    else if (intRounded === 1)
    {
        strResult = "10";
    }
    else
    {
        strResult = "a 1 with " + intRounded.toLocaleString() + " zeros after it";
    }

    return strResult;
}

function formatLargeExponent(fltExponent_a)
{
	var strResult = "";
	
    if (fltExponent_a < 3)
    {
        strResult = "~" + Math.pow(10, fltExponent_a).toFixed(0) + " permutations";
    }
    else if (fltExponent_a < 6)
    {
        strResult = "~" + (Math.pow(10, fltExponent_a) / 1000).toFixed(1) + " thousand permutations";
    }
    else if (fltExponent_a < 9)
    {
        strResult = "~" + (Math.pow(10, fltExponent_a) / 1000000).toFixed(1) + " million permutations";
    }
    else if (fltExponent_a < 12)
    {
        strResult = "~" + (Math.pow(10, fltExponent_a) / 1000000000).toFixed(1) + " billion permutations";
    }
    else if (fltExponent_a < 15)
    {
        strResult = "~" + (Math.pow(10, fltExponent_a) / 1000000000000).toFixed(1) + " trillion permutations";
    }
    else if (fltExponent_a < 82)
    {
        strResult = "More than all atoms in the observable universe (10^" + fltExponent_a.toFixed(0) + " permutations)";
    }
    else if (fltExponent_a < 1000)
    {
        strResult = "Incomprehensibly massive (10^" + fltExponent_a.toFixed(0) + " permutations)";
    }
    else if (fltExponent_a < 1000000)
    {
        strResult = "Beyond all physical comparison (10^" + (fltExponent_a / 1000).toFixed(0) + " thousand permutations)";
    }
    else
    {
        strResult = "Astronomically secure (10^" + (fltExponent_a / 1000000).toFixed(1) + " million permutations)";
    }
	
	return strResult;
}

function setupButtons()
{
	document.getElementById("clearBtn").addEventListener("click", function()
	{
		g_arrRomData = null;
		g_strTextData = "";
		g_objEncodingResult = null;

		var objRomDropZone = document.getElementById("romDropZone");
		objRomDropZone.classList.remove("has-file");
		objRomDropZone.innerHTML = "<div>Drop ROM FILE here to encode or verify quality<br>or click to browse</div>";

		document.getElementById("textInput").value = "";
		document.getElementById("analysisContent").innerHTML = "<p class='text-muted'>Verify a ROM first to see quality analysis results.</p>";

		checkEncodeReady();
	});
 
	document.getElementById("verifyBtn").addEventListener("click", function()
	{
		if (!g_arrRomData || g_strTextData.trim().length === 0)
		{
            // Do nothing if not ready
			return; 
		}

        this.disabled = true;
        this.textContent = "Verifying...";
   
        // 1. Split keys and handle empty input (ES5 Compliant)
        var arrKeys = g_strTextData.split('\n').map(function(strKey_a) 
        {
            return strKey_a.trim();
        }).filter(function(strKey_a) 
        {
            return strKey_a.length > 0;
        });
            
        if (arrKeys.length === 0) 
        {
            this.disabled = false;
            this.textContent = "Verify ROM";
            return;
        }

        g_arrIndividualResults = [];

        // 2. Determine ROM size (16-bit or 32-bit logic)
        var intMaxSize;
        if (g_BITTAGE === 16)
        {
            intMaxSize = 65536;
        }
        else if (g_BITTAGE === 32)
        {
            intMaxSize = 4294967296;
        } 
        else 
        {
            intMaxSize = 65536;
        }
        
        var intSize = g_arrRomData.length;
        if (intSize > intMaxSize)
        {
            intSize = intMaxSize;
        }
        
        var arrMemoryBlocks = [
            {start: 0, size: intSize}
        ];

        // 3. Initialize combined counters and unique address tracker
        var arrCombinedRomCounts = new Array(256).fill(0);
        var arrCombinedInputCounts = new Array(256).fill(0);
        var objSupersetAddresses = {}; // Used to track unique addresses
        var intCombinedInputLength = 0;
        
        // Initial call to get full ROM counts only once
        // This is inefficient but necessary to get the RomCounts before the loop starts
        var arrInputBytesInitial = new TextEncoder().encode(arrKeys[0]);
        var objInitialResult = toZOSCII(g_arrRomData, arrInputBytesInitial, arrMemoryBlocks, null, 42);
        
        // Slice() is ES5-safe
        arrCombinedRomCounts = objInitialResult.romCounts.slice();

        // 4. Loop through individual keys and aggregate results
        arrKeys.forEach(function(strKey_a) 
        {
            var arrInputBytes = new TextEncoder().encode(strKey_a);
            
            // Execute ZOSCII conversion for the single key
            var objResult = toZOSCII(g_arrRomData, arrInputBytes, arrMemoryBlocks, null, 42); 
            
            // Populate individual result list
            g_arrIndividualResults.push({
                addresses: objResult.addresses,
                originalText: strKey_a,
                inputCounts: objResult.inputCounts,
                addressCount: objResult.addresses.length
            });
            
            // Aggregate totals
            intCombinedInputLength += arrInputBytes.length;
            
            // FIX: Collect unique addresses into the superset object (ES5 Compliant)
            objResult.addresses.forEach(function(intAddr_a) 
            {
                objSupersetAddresses[intAddr_a] = true;
            });
            
            for (var intI = 0; intI < 256; intI++)
            {
                arrCombinedInputCounts[intI] += objResult.inputCounts[intI];
            }
        });
        
        // 5. Convert superset addresses object keys back to an array of integers (ES5 Compliant)
        var arrSupersetAddresses = Object.keys(objSupersetAddresses).map(function(strKey_a) 
        {
            return parseInt(strKey_a, 10);
        });

        // 6. Set the final aggregated result
        g_objEncodingResult = {
            addresses: arrSupersetAddresses,
            inputCounts: arrCombinedInputCounts,
            romCounts: arrCombinedRomCounts,
            originalText: g_strTextData,
            inputLength: intCombinedInputLength,
            addressCount: arrSupersetAddresses.length,
            encoding: "UTF-8"
        };

        displayAnalysis(g_objEncodingResult);
        document.getElementById("analysis-tab").click();
        this.disabled = false;
        this.textContent = "Verify ROM";
	});
}

function setupDropZone(strSelector_a, cbOnFileHandler) 
{
    var objDropZone = document.querySelector(strSelector_a);
    
    objDropZone.addEventListener("dragover", function(objEvent_a) 
    {
        objEvent_a.preventDefault();
        this.classList.add("dragover");
    });
    
    objDropZone.addEventListener("dragleave", function(objEvent_a) 
    {
        objEvent_a.preventDefault();
        this.classList.remove("dragover");
    });
    
    objDropZone.addEventListener("drop", function(objEvent_a) 
    {
        objEvent_a.preventDefault();
        this.classList.remove("dragover");
        
        var arrFiles = objEvent_a.dataTransfer.files;
        if (arrFiles.length > 0) 
        {
            cbOnFileHandler(arrFiles[0]);
        }
    });
}

function setupDropZones() 
{
    // ROM file drop zone
    setupDropZone("#romDropZone", function(objFile_a) 
    {
        var objReader = new FileReader();
        objReader.onload = function(objEvent_a) 
        {
            g_arrRomData = new Uint8Array(objEvent_a.target.result);
            var objRomDropZone = document.getElementById("romDropZone");
            objRomDropZone.classList.add("has-file");
            objRomDropZone.innerHTML = "<div>ROM file loaded: " + objFile_a.name + " (" + objFile_a.size + " bytes)</div>";
            checkEncodeReady();
        };
        objReader.readAsArrayBuffer(objFile_a);
    });

    // ROM drop zone click handler
    document.getElementById("romDropZone").addEventListener("click", function() 
    {
        document.getElementById("romFileInput").click();
    });
    
    // ROM file input change handler
    document.getElementById("romFileInput").addEventListener("change", function() 
    {
        if (this.files.length > 0) 
        {
            var objFile = this.files[0];
            var objReader = new FileReader();
            objReader.onload = function(objEvent_a) 
            {
                g_arrRomData = new Uint8Array(objEvent_a.target.result);
                var objRomDropZone = document.getElementById("romDropZone");
                objRomDropZone.classList.add("has-file");
                objRomDropZone.innerHTML = "<div>ROM file loaded: " + objFile.name + " (" + objFile.size + " bytes)</div>";
                checkEncodeReady();
            };
            objReader.readAsArrayBuffer(objFile);
        }
    });
	
    // Text typing handler (replaces binary file drop zone logic)
    document.getElementById("textInput").addEventListener("input", function() 
    {
        g_strTextData = this.value;
        checkEncodeReady();
    });
}

function showTab(strTabName_a) 
{
	var intI;
	
    // Hide all tab panes
    var arrTabPanes = document.querySelectorAll('.tab-pane');
    for (intI = 0; intI < arrTabPanes.length; intI++) 
    {
        arrTabPanes[intI].classList.remove('active');
    }
    
    // Remove active class from all nav links
    var arrNavLinks = document.querySelectorAll('.nav-link');
    for (intI = 0; intI < arrNavLinks.length; intI++) 
    {
        arrNavLinks[intI].classList.remove('active');
    }
    
    // Show selected tab pane
    document.getElementById(strTabName_a).classList.add('active');
    
    // Add active class to selected nav link
    document.getElementById(strTabName_a + '-tab').classList.add('active');
}

// Cyborg ZOSCII v20250805
// (c) 2025 Cyborg Unicorn Pty Ltd.
// This software is released under MIT License.

// Function to convert string or binary data to ZOSCII address sequence
// arrBinaryData_a: Uint8Array containing the ROM/binary data  
// mixedInputData_a: String or Uint8Array containing the data to convert
// arrMemoryBlocks_a: array of {start: startAddress, size: blockSize} objects
// cbConverter_a: encoding conversion function (e.g., petsciiToAscii, ebcdicToAscii) or null
// intUnmappableChar_a: the native character code to be used if it cannot be mapped to ASCII
// Returns: {addresses: array, inputCounts: array, romCounts: array}

function toZOSCII(arrBinaryData_a, mixedInputData_a, arrMemoryBlocks_a, cbConverter_a, intUnmappableChar_a)
{
    var intStartTime = new Date().getTime();
	
    var intI;
    var intBlock;
    var intResultIndex = 0;
    var intResultCount = 0;
    var intDebugMissing = 0;
    
    var arrByteCounts = new Array(256);
    var arrByteAddresses = new Array(256);
    var arrOffsets = new Array(256);
    var arrInputCounts = new Array(256);
	var intAddress;
	var intByte;
	var intIndex;
	var objBlock;
    
    // Convert input to consistent format
    var arrInputData_a;
    var blnIsString = false;
    
    if (typeof mixedInputData_a === 'string') 
{
        // Handle string input - convert to UTF-8 bytes
        arrInputData_a = new TextEncoder().encode(mixedInputData_a);
        blnIsString = true;
    } else {
        // Handle Uint8Array input
        arrInputData_a = mixedInputData_a;
        blnIsString = false;
    }
    
    // Initialize counters
    for (intI = 0; intI < 256; intI++)
    {
        arrByteCounts[intI] = 0;
        arrInputCounts[intI] = 0;
    }
    
    // Pass 1: Count occurrences by iterating through blocks
    for (intBlock = 0; intBlock < arrMemoryBlocks_a.length; intBlock++)
    {
        objBlock = arrMemoryBlocks_a[intBlock];
        for (intAddress = objBlock.start; intAddress < (objBlock.start + objBlock.size); intAddress++)
        {
            intByte = arrBinaryData_a[intAddress];
            arrByteCounts[intByte]++;
        }
    }
    
    // Pass 2: Pre-allocate exact-sized arrays
    for (intI = 0; intI < 256; intI++)
    {
        arrByteAddresses[intI] = new Array(arrByteCounts[intI]);
        arrOffsets[intI] = 0;
    }
    
    // Pass 3: Populate arrays by iterating through blocks
    for (intBlock = 0; intBlock < arrMemoryBlocks_a.length; intBlock++)
    {
        objBlock = arrMemoryBlocks_a[intBlock];
        for (intAddress = objBlock.start; intAddress < (objBlock.start + objBlock.size); intAddress++)
        {
            intByte = arrBinaryData_a[intAddress];
            arrByteAddresses[intByte][arrOffsets[intByte]] = intAddress;
			arrOffsets[intByte]++;
        }
    }
    
    // Build result array with random addresses - pre-allocate and avoid push()
    for (intI = 0; intI < arrInputData_a.length; intI++)
    {
        intIndex = arrInputData_a[intI];  // Direct byte value
        
        // Apply encoding conversion if provided
        if (cbConverter_a)
        {
            intIndex = cbConverter_a(intIndex, intUnmappableChar_a);
        }
        
        if (intIndex >= 0 && intIndex < 256 && arrByteAddresses[intIndex] && arrByteAddresses[intIndex].length > 0)
        {
            intResultCount++;
        }
        else
        {
            intDebugMissing++;
            if (intDebugMissing <= 10)
            {
                var strHexByte = arrInputData_a[intI].toString(16).toUpperCase();
                if (strHexByte.length < 2) strHexByte = "0" + strHexByte;
                
                if (blnIsString) 
				{
                    console.log("Missing character: '" + String.fromCharCode(arrInputData_a[intI]) + "' (code " + arrInputData_a[intI] + "/0x" + strHexByte + " -> " + intIndex + ")");
                } 
				else 
				{
                    console.log("Missing byte: " + arrInputData_a[intI] + " (0x" + strHexByte + " -> " + intIndex + ")");
                }
            }
        }
    }

    if (blnIsString) 
	{
        console.log("Characters found in ROM: " + intResultCount);
        console.log("Characters missing from ROM: " + intDebugMissing);
    } 
	else 
	{
        console.log("Bytes found in ROM: " + intResultCount);
        console.log("Bytes missing from ROM: " + intDebugMissing);
    }

    var arrResult = new Array(intResultCount);

    for (intI = 0; intI < arrInputData_a.length; intI++)
    {
        intIndex = arrInputData_a[intI];  // Direct byte value
        
        // Apply encoding conversion if provided
        if (cbConverter_a)
        {
            intIndex = cbConverter_a(intIndex, intUnmappableChar_a);
        }

        if (intIndex >= 0 && intIndex < 256 && arrByteAddresses[intIndex] && arrByteAddresses[intIndex].length > 0)
        {
            arrInputCounts[intIndex]++;
            var intRandomPick = Math.floor(Math.random() * arrByteAddresses[intIndex].length);
            arrResult[intResultIndex] = arrByteAddresses[intIndex][intRandomPick];
			intResultIndex++;
        }
    }

    var intEndTime = new Date().getTime();
    var intElapsedMs = intEndTime - intStartTime;
    
    console.log("ZOSCII Performance:");
    console.log("- Binary size: " + arrBinaryData_a.length + " bytes");
    console.log("- Input length: " + arrInputData_a.length + (blnIsString ? " characters" : " bytes"));
    console.log("- Memory blocks: " + arrMemoryBlocks_a.length);
    console.log("- Execution time: " + intElapsedMs + "ms");
    console.log("- Output addresses: " + arrResult.length);
    
    return {
        addresses: arrResult,
        inputCounts: arrInputCounts,
		romCounts: arrByteCounts
    };
}
