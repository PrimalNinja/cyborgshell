<?php

// messages
define("MSG_ABOUTUPDATED", "Na-update ang tungkol.");
define("MSG_BLOCKEDWORDFOUND", "Nahanap ang naka-block na salita.");
define("MSG_DEVICEKEYSNONE", "mga susi ng device: wala");
define("MSG_FILEBEAUTIFIED", "Naging maganda ang file.");
define("MSG_FILECOPIED", "Nakopya ang file.");
define("MSG_FILEDELETED", "Tinanggal ang file.");
define("MSG_FILERENAMED", "Pinalitan ang pangalan ng file.");
define("MSG_FILESAVED", "Nai-save ang file.");
define("MSG_NOFILESFOUND", "Walang nahanap na mga file.");
define("MSG_NOUSERSFOUND", "Walang nahanap na mga gumagamit.");
define("MSG_PASSWORDCHANGED", "Nabago ang password.");
define("MSG_SHAREKEYSNONE", "mga susi ng share: wala");
define("MSG_SHARESNONE", "mga share: wala");
define("MSG_SPACESNONE", "mga espasyo: wala");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "mga aktibong susi");
define("MSG_ACTIVESHARES", "mga aktibong bahagi");
define("MSG_ALIASGRANTED", "%%ALIAS%% ay ipinagkaloob.");
define("MSG_ALIASISNOW", "Ang alias ay ngayon '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% ay muling ipinagkaloob.");
define("MSG_ALIASREVOKED", "%%ALIAS%% ay tinanggal.");
define("MSG_CURRENTDEVICE", "kasalukuyang aparato");
define("MSG_DEVICEKEYS", "mga susi ng aparato: ");
define("MSG_DIRECTORYOF", "Direktoryo ng ");
define("MSG_LISTOFADMINS", "Listahan ng mga admin:");
define("MSG_LISTOFUSERS", "Listahan ng mga gumagamit:");
define("MSG_LOGGEDINAS", "Ikaw ay naka-log in bilang '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Bagong susi '%%NEWKEY%%' (%%ALIAS%%) ay nalikha.");
define("MSG_OFFLINE", "Ikaw ay offline na ngayon.");
define("MSG_ONLINE", "Ikaw ay online na ngayon.");
define("MSG_REGISTRATION", "Gumagamit '%%USERNAME%%' ay nakarehistro, mangyaring tandaan ang sumusunod na impormasyon at huwag ibahagi ang iyong username at password sa ibang mga gumagamit.\nusername: %%USERNAME%%\npassword: %%PASSWORD%%\nalias:    %%ALIAS%%\nuserkey:  %%USERKEY%%");
define("MSG_SHARES", "mga bahagi:");
define("MSG_SPACENAMEISNOW", "Ang espasyo ay ngayon %%SPACENAME%%.");
define("MSG_SPACES", "mga espasyo:");
define("MSG_USERNAMEISNOW", "Ang username ay ngayon '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Di wastong device key.");
define("ERR_GRANTEXISTS", "Nandiyan na ang grant.");
define("ERR_FILEEXISTS_DESTINATION", "Nandiyan na ang file sa destinasyon.");
define("ERR_FILENOTEXISTS", "Hindi natagpuan ang file.");
define("ERR_FILENOTEXISTS_HELP", "Walang magagamit na tulong.");
define("ERR_FILENOTEXISTS_SOURCE", "Walang umiiral na source file.");
define("ERR_LOGININVALID", "Di wastong pag-login o password.");
define("ERR_LOGINNOTCURRENT", "Hindi ka kasalukuyang naka-login.");
define("ERR_JSONINVALID", "Di wastong JSON.");
define("ERR_NOTYETIMPLEMENTED", "Hindi pa naipapatupad.");
define("ERR_PARAMETERSMISSING", "Nawawalang mga parameter.");
define("ERR_PASSWORDINVALIDNEW", "Di wastong bagong password. Ang password ay dapat hindi bababa sa 8 karakter ang haba.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Di wastong nakaraang password.");
define("ERR_REGISTRATION", "Error sa pagpaparehistro.");
define("ERR_SHAREKEYINVALID", "Di wastong share key.");
define("ERR_SPACEKEYINVALID", "Di wastong space key.");
define("ERR_SYSTEMGENERAL", "Pangkalahatang error ng sistema.");
define("ERR_SYSTEMJSON", "Error sa file ng sistema.");
define("ERR_USERNAMEUNAVAILABLE", "Hindi magagamit ang username.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "Ang %%COMMAND%% ay hindi nakatakda.");

?>
