<?php

// messages
define("MSG_ABOUTUPDATED", "के बारे में अपडेट किया गया।");
define("MSG_BLOCKEDWORDFOUND", "रोक दिया गया शब्द मिला।");
define("MSG_DEVICEKEYSNONE", "डिवाइस कीज़: कोई नहीं");
define("MSG_FILEBEAUTIFIED", "फाइल सुंदर बनाई गई।");
define("MSG_FILECOPIED", "फाइल कॉपी की गई।");
define("MSG_FILEDELETED", "फाइल हटा दी गई।");
define("MSG_FILERENAMED", "फाइल का नाम बदल दिया गया।");
define("MSG_FILESAVED", "फाइल सहेजी गई।");
define("MSG_NOFILESFOUND", "कोई फाइल नहीं मिली।");
define("MSG_NOUSERSFOUND", "कोई उपयोगकर्ता नहीं मिला।");
define("MSG_PASSWORDCHANGED", "पासवर्ड बदल दिया गया है।");
define("MSG_SHAREKEYSNONE", "शेयर कीज़: कोई नहीं");
define("MSG_SHARESNONE", "शेयर: कोई नहीं");
define("MSG_SPACESNONE", "स्पेस: कोई नहीं");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "सक्रिय कुंजियाँ");
define("MSG_ACTIVESHARES", "सक्रिय शेयर");
define("MSG_ALIASGRANTED", "%%ALIAS%% प्रदान किया गया।");
define("MSG_ALIASISNOW", "उपनाम अब '%%ALIAS%%' है।");
define("MSG_ALIASREINSTATED", "%%ALIAS%% पुनर्स्थापित किया गया।");
define("MSG_ALIASREVOKED", "%%ALIAS%% रद्द किया गया।");
define("MSG_CURRENTDEVICE", "वर्तमान उपकरण");
define("MSG_DEVICEKEYS", "उपकरण कुंजियाँ: ");
define("MSG_DIRECTORYOF", "निर्देशिका ");
define("MSG_LISTOFADMINS", "प्रशासकों की सूची:");
define("MSG_LISTOFUSERS", "उपयोगकर्ताओं की सूची:");
define("MSG_LOGGEDINAS", "आप '%%USERNAME%%' के रूप में लॉग इन हैं।");
define("MSG_NEWKEYCREATED", "नई कुंजी '%%NEWKEY%%' (%%ALIAS%%) बनाई गई।");
define("MSG_OFFLINE", "आप अब ऑफ़लाइन हैं।");
define("MSG_ONLINE", "आप अब ऑनलाइन हैं।");
define("MSG_REGISTRATION", "उपयोगकर्ता '%%USERNAME%%' पंजीकृत है, कृपया निम्नलिखित जानकारी पर ध्यान दें और अपना उपयोगकर्ता नाम और पासवर्ड अन्य उपयोगकर्ताओं के साथ साझा न करें।\nउपयोगकर्ता नाम: %%USERNAME%%\nपासवर्ड: %%PASSWORD%%\nउपनाम:    %%ALIAS%%\nउपयोगकर्ता कुंजी:  %%USERKEY%%");
define("MSG_SHARES", "शेयर:");
define("MSG_SPACENAMEISNOW", "स्पेस अब %%SPACENAME%% है।");
define("MSG_SPACES", "स्पेस:");
define("MSG_USERNAMEISNOW", "उपयोगकर्ता नाम अब '%%USERNAME%%' है।");

// errors
define("ERR_DEVICEKEYINVALID", "अमान्य डिवाइस कुंजी।");
define("ERR_GRANTEXISTS", "अनुमति पहले से मौजूद है।");
define("ERR_FILEEXISTS_DESTINATION", "गंतव्य फ़ाइल पहले से मौजूद है।");
define("ERR_FILENOTEXISTS", "फ़ाइल नहीं मिली।");
define("ERR_FILENOTEXISTS_HELP", "सहायता उपलब्ध नहीं है।");
define("ERR_FILENOTEXISTS_SOURCE", "स्रोत फ़ाइल मौजूद नहीं है।");
define("ERR_LOGININVALID", "अमान्य लॉगिन या पासवर्ड।");
define("ERR_LOGINNOTCURRENT", "आप वर्तमान में लॉग इन नहीं हैं।");
define("ERR_JSONINVALID", "अमान्य JSON।");
define("ERR_NOTYETIMPLEMENTED", "अभी तक लागू नहीं किया गया है।");
define("ERR_PARAMETERSMISSING", "पैरामीटर गायब हैं।");
define("ERR_PASSWORDINVALIDNEW", "अमान्य नया पासवर्ड। पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।");
define("ERR_PASSWORDINVALIDPREVIOUS", "अमान्य पूर्व पासवर्ड।");
define("ERR_REGISTRATION", "पंजीकरण त्रुटि।");
define("ERR_SHAREKEYINVALID", "अमान्य शेयर कुंजी।");
define("ERR_SPACEKEYINVALID", "अमान्य स्पेस कुंजी।");
define("ERR_SYSTEMGENERAL", "सिस्टम सामान्य त्रुटि।");
define("ERR_SYSTEMJSON", "सिस्टम फ़ाइल त्रुटि।");
define("ERR_USERNAMEUNAVAILABLE", "उपयोगकर्ता नाम उपलब्ध नहीं है।");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% परिभाषित नहीं है।");

?>
