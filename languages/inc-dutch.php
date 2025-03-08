<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "Over bijgewerkt.");
define("MSG_BLOCKEDWORDFOUND", "Geblokkeerd woord gevonden.");
define("MSG_DEVICEKEYSNONE", "apparaatsleutels: geen");
define("MSG_FILEBEAUTIFIED", "Bestand verfraaid.");
define("MSG_FILECOPIED", "Bestand gekopieerd.");
define("MSG_FILEDELETED", "Bestand verwijderd.");
define("MSG_FILERENAMED", "Bestand hernoemd.");
define("MSG_FILESAVED", "Bestand opgeslagen.");
define("MSG_NOFILESFOUND", "Geen bestanden gevonden.");
define("MSG_NOUSERSFOUND", "Geen gebruikers gevonden.");
define("MSG_PASSWORDCHANGED", "Wachtwoord is gewijzigd.");
define("MSG_SHAREKEYSNONE", "deelsleutels: geen");
define("MSG_SHARESNONE", "delen: geen");
define("MSG_SPACESNONE", "ruimtes: geen");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "actieve sleutels");
define("MSG_ACTIVESHARES", "actieve aandelen");
define("MSG_ALIASGRANTED", "%%ALIAS%% verleend.");
define("MSG_ALIASISNOW", "Alias is nu '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% hersteld.");
define("MSG_ALIASREVOKED", "%%ALIAS%% ingetrokken.");
define("MSG_CURRENTDEVICE", "huidig apparaat");
define("MSG_DEVICEKEYS", "apparaatsleutels: ");
define("MSG_DIRECTORYOF", "Map van ");
define("MSG_LISTOFADMINS", "Lijst van beheerders:");
define("MSG_LISTOFUSERS", "Lijst van gebruikers:");
define("MSG_LOGGEDINAS", "Je bent ingelogd als '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nieuwe sleutel '%%NEWKEY%%' (%%ALIAS%%) aangemaakt.");
define("MSG_OFFLINE", "Je bent nu offline.");
define("MSG_ONLINE", "Je bent nu online.");
define("MSG_REGISTRATION", "Gebruiker '%%USERNAME%%' geregistreerd, neem alstublieft kennis van de volgende informatie en deel je gebruikersnaam en wachtwoord niet met andere gebruikers.\ngebruikersnaam: %%USERNAME%%\nwachtwoord: %%PASSWORD%%\nalias:    %%ALIAS%%\ngebruikersleutel:  %%USERKEY%%");
define("MSG_SHARES", "aandelen:");
define("MSG_SPACENAMEISNOW", "Ruimte is nu %%SPACENAME%%.");
define("MSG_SPACES", "ruimtes:");
define("MSG_USERNAMEISNOW", "Gebruikersnaam is nu '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Ongeldige apparaatsleutel.");
define("ERR_GRANTEXISTS", "Toestemming bestaat al.");
define("ERR_FILEEXISTS_DESTINATION", "Bestemmingsbestand bestaat al.");
define("ERR_FILENOTEXISTS", "Bestand niet gevonden.");
define("ERR_FILENOTEXISTS_HELP", "Hulp is niet beschikbaar.");
define("ERR_FILENOTEXISTS_SOURCE", "Bronbestand bestaat niet.");
define("ERR_LOGININVALID", "Ongeldige inlog of wachtwoord.");
define("ERR_LOGINNOTCURRENT", "Je bent momenteel niet ingelogd.");
define("ERR_JSONINVALID", "Ongeldige JSON.");
define("ERR_NOTYETIMPLEMENTED", "Nog niet geïmplementeerd.");
define("ERR_PARAMETERSMISSING", "Ontbrekende parameters.");
define("ERR_PASSWORDINVALIDNEW", "Ongeldig nieuw wachtwoord. Wachtwoord moet minimaal 8 tekens lang zijn.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Ongeldig vorig wachtwoord.");
define("ERR_REGISTRATION", "Registratiefout.");
define("ERR_SHAREKEYINVALID", "Ongeldige deel-sleutel.");
define("ERR_SPACEKEYINVALID", "Ongeldige ruimte-sleutel.");
define("ERR_SYSTEMGENERAL", "Algemene systeemfout.");
define("ERR_SYSTEMJSON", "Systeem bestand fout.");
define("ERR_USERNAMEUNAVAILABLE", "Gebruikersnaam niet beschikbaar.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% is niet gedefinieerd.");

?>
