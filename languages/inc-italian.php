<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "Informazioni aggiornate.");
define("MSG_BLOCKEDWORDFOUND", "Parola bloccata trovata.");
define("MSG_DEVICEKEYSNONE", "chiavi dispositivo: nessuna");
define("MSG_FILEBEAUTIFIED", "File abbellito.");
define("MSG_FILECOPIED", "File copiato.");
define("MSG_FILEDELETED", "File eliminato.");
define("MSG_FILERENAMED", "File rinominato.");
define("MSG_FILESAVED", "File salvato.");
define("MSG_NOFILESFOUND", "Nessun file trovato.");
define("MSG_NOUSERSFOUND", "Nessun utente trovato.");
define("MSG_PASSWORDCHANGED", "La password è stata cambiata.");
define("MSG_SHAREKEYSNONE", "chiavi condivisione: nessuna");
define("MSG_SHARESNONE", "condivisioni: nessuna");
define("MSG_SPACESNONE", "spazi: nessuno");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "chiavi attive");
define("MSG_ACTIVESHARES", "azioni attive");
define("MSG_ALIASGRANTED", "%%ALIAS%% concessa.");
define("MSG_ALIASISNOW", "L'alias è ora '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% ripristinata.");
define("MSG_ALIASREVOKED", "%%ALIAS%% revocata.");
define("MSG_CURRENTDEVICE", "dispositivo attuale");
define("MSG_DEVICEKEYS", "chiavi del dispositivo: ");
define("MSG_DIRECTORYOF", "Directory di ");
define("MSG_LISTOFADMINS", "Elenco degli amministratori:");
define("MSG_LISTOFUSERS", "Elenco degli utenti:");
define("MSG_LOGGEDINAS", "Sei connesso come '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nuova chiave '%%NEWKEY%%' (%%ALIAS%%) creata.");
define("MSG_OFFLINE", "Sei ora offline.");
define("MSG_ONLINE", "Sei ora online.");
define("MSG_REGISTRATION", "Utente '%%USERNAME%%' registrato, si prega di prendere nota delle seguenti informazioni e di non condividere il proprio nome utente e la password con altri utenti.\nnome utente: %%USERNAME%%\npassword: %%PASSWORD%%\nalias:    %%ALIAS%%\nchiave utente:  %%USERKEY%%");
define("MSG_SHARES", "azioni:");
define("MSG_SPACENAMEISNOW", "Lo spazio è ora %%SPACENAME%%.");
define("MSG_SPACES", "spazi:");
define("MSG_USERNAMEISNOW", "Il nome utente è ora '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Chiave dispositivo non valida.");
define("ERR_GRANTEXISTS", "Autorizzazione già esistente.");
define("ERR_FILEEXISTS_DESTINATION", "Il file di destinazione esiste già.");
define("ERR_FILENOTEXISTS", "File non trovato.");
define("ERR_FILENOTEXISTS_HELP", "Aiuto non disponibile.");
define("ERR_FILENOTEXISTS_SOURCE", "Il file sorgente non esiste.");
define("ERR_LOGININVALID", "Login o password non validi.");
define("ERR_LOGINNOTCURRENT", "Non sei attualmente connesso.");
define("ERR_JSONINVALID", "JSON non valido.");
define("ERR_NOTYETIMPLEMENTED", "Non ancora implementato.");
define("ERR_PARAMETERSMISSING", "Parametri mancanti.");
define("ERR_PASSWORDINVALIDNEW", "Nuova password non valida. La password deve contenere almeno 8 caratteri.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Password precedente non valida.");
define("ERR_REGISTRATION", "Errore di registrazione.");
define("ERR_SHAREKEYINVALID", "Chiave di condivisione non valida.");
define("ERR_SPACEKEYINVALID", "Chiave di spazio non valida.");
define("ERR_SYSTEMGENERAL", "Errore generale del sistema.");
define("ERR_SYSTEMJSON", "Errore del file di sistema.");
define("ERR_USERNAMEUNAVAILABLE", "Nome utente non disponibile.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% non è definito.");

?>
