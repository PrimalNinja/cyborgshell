<?php

// messages
define("MSG_ABOUTUPDATED", "À propos mis à jour.");
define("MSG_BLOCKEDWORDFOUND", "Mot bloqué trouvé.");
define("MSG_DEVICEKEYSNONE", "clés de dispositif : aucune");
define("MSG_FILEBEAUTIFIED", "Fichier embelli.");
define("MSG_FILECOPIED", "Fichier copié.");
define("MSG_FILEDELETED", "Fichier supprimé.");
define("MSG_FILERENAMED", "Fichier renommé.");
define("MSG_FILESAVED", "Fichier enregistré.");
define("MSG_NOFILESFOUND", "Aucun fichier trouvé.");
define("MSG_NOUSERSFOUND", "Aucun utilisateur trouvé.");
define("MSG_PASSWORDCHANGED", "Le mot de passe a été changé.");
define("MSG_SHAREKEYSNONE", "clés de partage : aucune");
define("MSG_SHARESNONE", "partages : aucun");
define("MSG_SPACESNONE", "espaces : aucun");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "clés actives");
define("MSG_ACTIVESHARES", "parts actives");
define("MSG_ALIASGRANTED", "%%ALIAS%% accordé.");
define("MSG_ALIASISNOW", "L'alias est maintenant '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% rétabli.");
define("MSG_ALIASREVOKED", "%%ALIAS%% révoqué.");
define("MSG_CURRENTDEVICE", "appareil actuel");
define("MSG_DEVICEKEYS", "clés de l'appareil : ");
define("MSG_DIRECTORYOF", "Répertoire de ");
define("MSG_LISTOFADMINS", "Liste des administrateurs :");
define("MSG_LISTOFUSERS", "Liste des utilisateurs :");
define("MSG_LOGGEDINAS", "Vous êtes connecté en tant que '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nouvelle clé '%%NEWKEY%%' (%%ALIAS%%) créée.");
define("MSG_OFFLINE", "Vous êtes maintenant hors ligne.");
define("MSG_ONLINE", "Vous êtes maintenant en ligne.");
define("MSG_REGISTRATION", "Utilisateur '%%USERNAME%%' enregistré, veuillez prendre note des informations suivantes et ne partagez pas votre nom d'utilisateur et votre mot de passe avec d'autres utilisateurs.\nnom d'utilisateur : %%USERNAME%%\nmot de passe : %%PASSWORD%%\nalias :    %%ALIAS%%\nclé utilisateur :  %%USERKEY%%");
define("MSG_SHARES", "parts :");
define("MSG_SPACENAMEISNOW", "L'espace est maintenant %%SPACENAME%%.");
define("MSG_SPACES", "espaces :");
define("MSG_USERNAMEISNOW", "Le nom d'utilisateur est maintenant '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Clé de l'appareil invalide.");
define("ERR_GRANTEXISTS", "Le droit existe déjà.");
define("ERR_FILEEXISTS_DESTINATION", "Le fichier de destination existe déjà.");
define("ERR_FILENOTEXISTS", "Fichier non trouvé.");
define("ERR_FILENOTEXISTS_HELP", "Aide indisponible.");
define("ERR_FILENOTEXISTS_SOURCE", "Le fichier source n'existe pas.");
define("ERR_LOGININVALID", "Identifiant ou mot de passe invalide.");
define("ERR_LOGINNOTCURRENT", "Vous n'êtes pas actuellement connecté.");
define("ERR_JSONINVALID", "JSON invalide.");
define("ERR_NOTYETIMPLEMENTED", "Pas encore implémenté.");
define("ERR_PARAMETERSMISSING", "Paramètres manquants.");
define("ERR_PASSWORDINVALIDNEW", "Nouveau mot de passe invalide. Le mot de passe doit comporter au moins 8 caractères.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Ancien mot de passe invalide.");
define("ERR_REGISTRATION", "Erreur d'inscription.");
define("ERR_SHAREKEYINVALID", "Clé de partage invalide.");
define("ERR_SPACEKEYINVALID", "Clé d'espace invalide.");
define("ERR_SYSTEMGENERAL", "Erreur générale du système.");
define("ERR_SYSTEMJSON", "Erreur de fichier système.");
define("ERR_USERNAMEUNAVAILABLE", "Nom d'utilisateur indisponible.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% n'est pas défini.");

?>
