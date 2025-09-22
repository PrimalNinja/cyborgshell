<?php

// messages
define("MSG_ABOUTUPDATED", "Om uppdaterad.");
define("MSG_BLOCKEDWORDFOUND", "Blockerat ord funnet.");
define("MSG_DEVICEKEYSNONE", "enhetsnycklar: inga");
define("MSG_FILEBEAUTIFIED", "Fil vackergjord.");
define("MSG_FILECOPIED", "Fil kopierad.");
define("MSG_FILEDELETED", "Fil raderad.");
define("MSG_FILERENAMED", "Fil omdöpt.");
define("MSG_FILESAVED", "Fil sparad.");
define("MSG_NOFILESFOUND", "Inga filer hittades.");
define("MSG_NOUSERSFOUND", "Inga användare hittades.");
define("MSG_PASSWORDCHANGED", "Lösenordet har ändrats.");
define("MSG_SHAREKEYSNONE", "delnycklar: inga");
define("MSG_SHARESNONE", "delningar: inga");
define("MSG_SPACESNONE", "utrymmen: inga");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "aktiva nycklar");
define("MSG_ACTIVESHARES", "aktiva aktier");
define("MSG_ALIASGRANTED", "%%ALIAS%% beviljad.");
define("MSG_ALIASISNOW", "Alias är nu '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% återställd.");
define("MSG_ALIASREVOKED", "%%ALIAS%% återkallad.");
define("MSG_CURRENTDEVICE", "aktuell enhet");
define("MSG_DEVICEKEYS", "enhetsnycklar: ");
define("MSG_DIRECTORYOF", "Katalog av ");
define("MSG_LISTOFADMINS", "Lista över administratörer:");
define("MSG_LISTOFUSERS", "Lista över användare:");
define("MSG_LOGGEDINAS", "Du är inloggad som '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Ny nyckel '%%NEWKEY%%' (%%ALIAS%%) skapad.");
define("MSG_OFFLINE", "Du är nu offline.");
define("MSG_ONLINE", "Du är nu online.");
define("MSG_REGISTRATION", "Användare '%%USERNAME%%' registrerad, vänligen notera följande information och dela inte ditt användarnamn och lösenord med andra användare.\nanvändarnamn: %%USERNAME%%\nlösenord: %%PASSWORD%%\nalias:    %%ALIAS%%\nanvändarnyckel:  %%USERKEY%%");
define("MSG_SHARES", "aktier:");
define("MSG_SPACENAMEISNOW", "Utrymmet är nu %%SPACENAME%%.");
define("MSG_SPACES", "utrymmen:");
define("MSG_USERNAMEISNOW", "Användarnamn är nu '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Ogiltig enhetsnyckel.");
define("ERR_GRANTEXISTS", "Behörigheten finns redan.");
define("ERR_FILEEXISTS_DESTINATION", "Målfilen finns redan.");
define("ERR_FILENOTEXISTS", "Filen hittades inte.");
define("ERR_FILENOTEXISTS_HELP", "Hjälp är inte tillgänglig.");
define("ERR_FILENOTEXISTS_SOURCE", "Källfilen finns inte.");
define("ERR_LOGININVALID", "Ogiltigt användarnamn eller lösenord.");
define("ERR_LOGINNOTCURRENT", "Du är inte inloggad för tillfället.");
define("ERR_JSONINVALID", "Ogiltig JSON.");
define("ERR_NOTYETIMPLEMENTED", "Inte ännu implementerat.");
define("ERR_PARAMETERSMISSING", "Saknade parametrar.");
define("ERR_PASSWORDINVALIDNEW", "Ogiltigt nytt lösenord. Lösenordet måste vara minst 8 tecken långt.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Ogiltigt tidigare lösenord.");
define("ERR_REGISTRATION", "Registreringsfel.");
define("ERR_SHAREKEYINVALID", "Ogiltig delningsnyckel.");
define("ERR_SPACEKEYINVALID", "Ogiltig utrymmesnyckel.");
define("ERR_SYSTEMGENERAL", "Allmänt systemfel.");
define("ERR_SYSTEMJSON", "Systemfilfel.");
define("ERR_USERNAMEUNAVAILABLE", "Användarnamn är inte tillgängligt.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% är inte definierad.");

?>
