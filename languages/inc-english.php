<?php

// messages
define("MSG_ABOUTUPDATED", "About updated.");
define("MSG_BLOCKEDWORDFOUND", "Blocked word found.");
define("MSG_DEVICEKEYSNONE", "devicekeys: none");
define("MSG_FILEBEAUTIFIED", "File beautified.");
define("MSG_FILECOPIED", "File copied.");
define("MSG_FILEDELETED", "File deleted.");
define("MSG_FILERENAMED", "File renamed.");
define("MSG_FILESAVED", "File saved.");
define("MSG_NOFILESFOUND", "No files found.");
define("MSG_NOUSERSFOUND", "No users found.");
define("MSG_PASSWORDCHANGED", "Password has been changed.");
define("MSG_SHAREKEYSNONE", "sharekeys:  none");
define("MSG_SHARESNONE", "shares: none");
define("MSG_SPACESNONE", "spaces: none");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "active keys");
define("MSG_ACTIVESHARES", "active shares");
define("MSG_ALIASGRANTED", "%%ALIAS%% granted.");
define("MSG_ALIASISNOW", "Alias is now '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% reinstated.");
define("MSG_ALIASREVOKED", "%%ALIAS%% revoked.");
define("MSG_CURRENTDEVICE", "current device");
define("MSG_DEVICEKEYS", "devicekeys: ");
define("MSG_DIRECTORYOF", "Directory of ");
define("MSG_LISTOFADMINS", "List of admins:");
define("MSG_LISTOFUSERS", "List of users:");
define("MSG_LOGGEDINAS", "You are logged in as '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "New key '%%NEWKEY%%' (%%ALIAS%%) created.");
define("MSG_OFFLINE", "You are now offline.");
define("MSG_ONLINE", "You are now online.");
define("MSG_REGISTRATION", "User '%%USERNAME%%' registered, please take note of the following information and do not share your username and password with other users.\nusername: %%USERNAME%%\npassword: %%PASSWORD%%\nalias:    %%ALIAS%%\nuserkey:  %%USERKEY%%");
define("MSG_SHARES", "shares:");
define("MSG_SPACENAMEISNOW", "Space is now %%SPACENAME%%.");
define("MSG_SPACES", "spaces:");
define("MSG_USERNAMEISNOW", "Username is now '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Invalid device key.");
define("ERR_GRANTEXISTS", "Grant already exists.");
define("ERR_FILEEXISTS_DESTINATION", "Destination file already exists.");
define("ERR_FILENOTEXISTS", "File not found.");
define("ERR_FILENOTEXISTS_HELP", "Help is unavailable.");
define("ERR_FILENOTEXISTS_SOURCE", "Source file does not exist.");
define("ERR_LOGININVALID", "Invalid login or password.");
define("ERR_LOGINNOTCURRENT", "You are not currently logged in.");
define("ERR_JSONINVALID", "Invalid JSON.");
define("ERR_NOTYETIMPLEMENTED", "Not yet implemented.");
define("ERR_PARAMETERSMISSING", "Missing parameters.");
define("ERR_PASSWORDINVALIDNEW", "Invalid new password. Password must be at least 8 characters long.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Invalid previous password.");
define("ERR_REGISTRATION", "Registration error.");
define("ERR_SHAREKEYINVALID", "Invalid share key.");
define("ERR_SPACEKEYINVALID", "Invalid space key.");
define("ERR_SYSTEMGENERAL", "System general error.");
define("ERR_SYSTEMJSON", "System file error.");
define("ERR_USERNAMEUNAVAILABLE", "Username unavailable.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% is not defined.");

?>
