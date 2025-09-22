<?php

// messages
define("MSG_ABOUTUPDATED", "O aktualizaci.");
define("MSG_BLOCKEDWORDFOUND", "Bylo nalezeno blokované slovo.");
define("MSG_DEVICEKEYSNONE", "devicekeys: žádné");
define("MSG_FILEBEAUTIFIED", "Soubor byl upraven.");
define("MSG_FILECOPIED", "Soubor byl zkopírován.");
define("MSG_FILEDELETED", "Soubor byl smazán.");
define("MSG_FILERENAMED", "Soubor byl přejmenován.");
define("MSG_FILESAVED", "Soubor byl uložen.");
define("MSG_NOFILESFOUND", "Žádné soubory nebyly nalezeny.");
define("MSG_NOUSERSFOUND", "Žádní uživatelé nebyli nalezeni.");
define("MSG_PASSWORDCHANGED", "Heslo bylo změněno.");
define("MSG_SHAREKEYSNONE", "sharekeys: žádné");
define("MSG_SHARESNONE", "shares: žádné");
define("MSG_SPACESNONE", "spaces: žádné");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "aktivní klíče");
define("MSG_ACTIVESHARES", "aktivní akcie");
define("MSG_ALIASGRANTED", "%%ALIAS%% bylo uděleno.");
define("MSG_ALIASISNOW", "Alias je nyní '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% bylo obnoven.");
define("MSG_ALIASREVOKED", "%%ALIAS%% bylo odvoláno.");
define("MSG_CURRENTDEVICE", "aktuální zařízení");
define("MSG_DEVICEKEYS", "klíče zařízení: ");
define("MSG_DIRECTORYOF", "Adresář ");
define("MSG_LISTOFADMINS", "Seznam administrátorů:");
define("MSG_LISTOFUSERS", "Seznam uživatelů:");
define("MSG_LOGGEDINAS", "Jste přihlášeni jako '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nový klíč '%%NEWKEY%%' (%%ALIAS%%) byl vytvořen.");
define("MSG_OFFLINE", "Nyní jste offline.");
define("MSG_ONLINE", "Nyní jste online.");
define("MSG_REGISTRATION", "Uživatel '%%USERNAME%%' zaregistrován, prosím vezměte na vědomí následující informace a nesdílejte své uživatelské jméno a heslo s jinými uživateli.\nuživatelské jméno: %%USERNAME%%\nheslo: %%PASSWORD%%\nalias:    %%ALIAS%%\nklíč uživatele:  %%USERKEY%%");
define("MSG_SHARES", "akcie:");
define("MSG_SPACENAMEISNOW", "Prostor je nyní %%SPACENAME%%.");
define("MSG_SPACES", "prostory:");
define("MSG_USERNAMEISNOW", "Uživatelské jméno je nyní '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Neplatný klíč zařízení.");
define("ERR_GRANTEXISTS", "Povolení již existuje.");
define("ERR_FILEEXISTS_DESTINATION", "Cílový soubor již existuje.");
define("ERR_FILENOTEXISTS", "Soubor nebyl nalezen.");
define("ERR_FILENOTEXISTS_HELP", "Nápověda není k dispozici.");
define("ERR_FILENOTEXISTS_SOURCE", "Zdrojový soubor neexistuje.");
define("ERR_LOGININVALID", "Neplatné přihlášení nebo heslo.");
define("ERR_LOGINNOTCURRENT", "Nyní nejste přihlášeni.");
define("ERR_JSONINVALID", "Neplatný JSON.");
define("ERR_NOTYETIMPLEMENTED", "Ještě nebylo implementováno.");
define("ERR_PARAMETERSMISSING", "Chybějící parametry.");
define("ERR_PASSWORDINVALIDNEW", "Neplatné nové heslo. Heslo musí mít alespoň 8 znaků.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Neplatné předchozí heslo.");
define("ERR_REGISTRATION", "Chyba registrace.");
define("ERR_SHAREKEYINVALID", "Neplatný klíč sdílení.");
define("ERR_SPACEKEYINVALID", "Neplatný klíč prostoru.");
define("ERR_SYSTEMGENERAL", "Obecná systémová chyba.");
define("ERR_SYSTEMJSON", "Chyba systémového souboru.");
define("ERR_USERNAMEUNAVAILABLE", "Uživatelské jméno není k dispozici.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% není definováno.");

?>
