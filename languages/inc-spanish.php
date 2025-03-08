<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "Acerca de actualizado.");
define("MSG_BLOCKEDWORDFOUND", "Se ha encontrado una palabra bloqueada.");
define("MSG_DEVICEKEYSNONE", "claves de dispositivo: ninguna");
define("MSG_FILEBEAUTIFIED", "Archivo embellecido.");
define("MSG_FILECOPIED", "Archivo copiado.");
define("MSG_FILEDELETED", "Archivo eliminado.");
define("MSG_FILERENAMED", "Archivo renombrado.");
define("MSG_FILESAVED", "Archivo guardado.");
define("MSG_NOFILESFOUND", "No se encontraron archivos.");
define("MSG_NOUSERSFOUND", "No se encontraron usuarios.");
define("MSG_PASSWORDCHANGED", "La contraseña ha sido cambiada.");
define("MSG_SHAREKEYSNONE", "claves de compartición: ninguna");
define("MSG_SHARESNONE", "comparticiones: ninguna");
define("MSG_SPACESNONE", "espacios: ninguno");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "claves activas");
define("MSG_ACTIVESHARES", "acciones activas");
define("MSG_ALIASGRANTED", "%%ALIAS%% concedido.");
define("MSG_ALIASISNOW", "El alias es ahora '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% restablecido.");
define("MSG_ALIASREVOKED", "%%ALIAS%% revocado.");
define("MSG_CURRENTDEVICE", "dispositivo actual");
define("MSG_DEVICEKEYS", "claves del dispositivo: ");
define("MSG_DIRECTORYOF", "Directorio de ");
define("MSG_LISTOFADMINS", "Lista de administradores:");
define("MSG_LISTOFUSERS", "Lista de usuarios:");
define("MSG_LOGGEDINAS", "Has iniciado sesión como '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nueva clave '%%NEWKEY%%' (%%ALIAS%%) creada.");
define("MSG_OFFLINE", "Ahora estás desconectado.");
define("MSG_ONLINE", "Ahora estás en línea.");
define("MSG_REGISTRATION", "Usuario '%%USERNAME%%' registrado, por favor toma nota de la siguiente información y no compartas tu nombre de usuario y contraseña con otros usuarios.\nnombre de usuario: %%USERNAME%%\ncontraseña: %%PASSWORD%%\nalias:    %%ALIAS%%\nclave de usuario:  %%USERKEY%%");
define("MSG_SHARES", "acciones:");
define("MSG_SPACENAMEISNOW", "El espacio es ahora %%SPACENAME%%.");
define("MSG_SPACES", "espacios:");
define("MSG_USERNAMEISNOW", "El nombre de usuario es ahora '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Clave de dispositivo inválida.");
define("ERR_GRANTEXISTS", "El permiso ya existe.");
define("ERR_FILEEXISTS_DESTINATION", "El archivo de destino ya existe.");
define("ERR_FILENOTEXISTS", "Archivo no encontrado.");
define("ERR_FILENOTEXISTS_HELP", "Ayuda no disponible.");
define("ERR_FILENOTEXISTS_SOURCE", "El archivo de origen no existe.");
define("ERR_LOGININVALID", "Inicio de sesión o contraseña inválidos.");
define("ERR_LOGINNOTCURRENT", "No has iniciado sesión actualmente.");
define("ERR_JSONINVALID", "JSON inválido.");
define("ERR_NOTYETIMPLEMENTED", "Aún no implementado.");
define("ERR_PARAMETERSMISSING", "Faltan parámetros.");
define("ERR_PASSWORDINVALIDNEW", "Contraseña nueva inválida. La contraseña debe tener al menos 8 caracteres.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Contraseña anterior inválida.");
define("ERR_REGISTRATION", "Error de registro.");
define("ERR_SHAREKEYINVALID", "Clave de compartición inválida.");
define("ERR_SPACEKEYINVALID", "Clave de espacio inválida.");
define("ERR_SYSTEMGENERAL", "Error general del sistema.");
define("ERR_SYSTEMJSON", "Error en el archivo del sistema.");
define("ERR_USERNAMEUNAVAILABLE", "Nombre de usuario no disponible.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% no está definido.");

?>
