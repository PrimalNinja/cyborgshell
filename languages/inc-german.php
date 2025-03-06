<?php

// actions
define("ACTION_INVALIDATE", "invalidate");

// messages
define("MSG_ABOUTUPDATED", "Über aktualisiert.");
define("MSG_DEVICEKEYSNONE", "Geräte-Schlüssel: keine");
define("MSG_FILEBEAUTIFIED", "Datei verschönert.");
define("MSG_FILECOPIED", "Datei kopiert.");
define("MSG_FILEDELETED", "Datei gelöscht.");
define("MSG_FILERENAMED", "Datei umbenannt.");
define("MSG_FILESAVED", "Datei gespeichert.");
define("MSG_NOFILESFOUND", "Keine Dateien gefunden.");
define("MSG_NOUSERSFOUND", "Keine Benutzer gefunden.");
define("MSG_PASSWORDCHANGED", "Passwort wurde geändert.");
define("MSG_SHAREKEYSNONE", "Freigabeschlüssel: keine");
define("MSG_SHARESNONE", "Freigaben: keine");
define("MSG_SPACESNONE", "Räume: keine");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "aktive Schlüssel");
define("MSG_ACTIVESHARES", "aktive Anteile");
define("MSG_ALIASGRANTED", "%%ALIAS%% gewährt.");
define("MSG_ALIASISNOW", "Alias ist jetzt '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% wiederhergestellt.");
define("MSG_ALIASREVOKED", "%%ALIAS%% widerrufen.");
define("MSG_CURRENTDEVICE", "aktuelles Gerät");
define("MSG_DEVICEKEYS", "Geräteschlüssel: ");
define("MSG_DIRECTORYOF", "Verzeichnis von ");
define("MSG_LISTOFADMINS", "Liste der Administratoren:");
define("MSG_LISTOFUSERS", "Liste der Benutzer:");
define("MSG_LOGGEDINAS", "Sie sind als '%%USERNAME%%' angemeldet.");
define("MSG_NEWKEYCREATED", "Neuer Schlüssel '%%NEWKEY%%' (%%ALIAS%%) erstellt.");
define("MSG_OFFLINE", "Sie sind jetzt offline.");
define("MSG_ONLINE", "Sie sind jetzt online.");
define("MSG_REGISTRATION", "Benutzer '%%USERNAME%%' registriert, bitte beachten Sie die folgenden Informationen und teilen Sie Ihren Benutzernamen und Ihr Passwort nicht mit anderen Benutzern.\nBenutzername: %%USERNAME%%\nPasswort: %%PASSWORD%%\nAlias:    %%ALIAS%%\nBenutzerschlüssel:  %%USERKEY%%");
define("MSG_SHARES", "Anteile:");
define("MSG_SPACENAMEISNOW", "Raum ist jetzt %%SPACENAME%%.");
define("MSG_SPACES", "Räume:");
define("MSG_USERNAMEISNOW", "Benutzername ist jetzt '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Ungültiger Geräte-Schlüssel.");
define("ERR_GRANTEXISTS", "Berechtigung existiert bereits.");
define("ERR_FILEEXISTS_DESTINATION", "Zieldatei existiert bereits.");
define("ERR_FILENOTEXISTS", "Datei nicht gefunden.");
define("ERR_FILENOTEXISTS_HELP", "Hilfe ist nicht verfügbar.");
define("ERR_FILENOTEXISTS_SOURCE", "Quelldatei existiert nicht.");
define("ERR_LOGININVALID", "Ungültige Anmeldedaten oder Passwort.");
define("ERR_LOGINNOTCURRENT", "Sie sind derzeit nicht angemeldet.");
define("ERR_JSONINVALID", "Ungültiges JSON.");
define("ERR_NOTYETIMPLEMENTED", "Noch nicht implementiert.");
define("ERR_PARAMETERSMISSING", "Fehlende Parameter.");
define("ERR_PASSWORDINVALIDNEW", "Ungültiges neues Passwort. Das Passwort muss mindestens 8 Zeichen lang sein.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Ungültiges vorheriges Passwort.");
define("ERR_REGISTRATION", "Registrierungsfehler.");
define("ERR_SHAREKEYINVALID", "Ungültiger Freigabeschlüssel.");
define("ERR_SPACEKEYINVALID", "Ungültiger Raum-Schlüssel.");
define("ERR_SYSTEMGENERAL", "Allgemeiner Systemfehler.");
define("ERR_SYSTEMJSON", "Systemdateifehler.");
define("ERR_USERNAMEUNAVAILABLE", "Benutzername nicht verfügbar.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% ist nicht definiert.");

?>
