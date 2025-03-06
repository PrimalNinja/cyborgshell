<?php

// actions
define("ACTION_INVALIDATE", "invalidate");

// messages
define("MSG_ABOUTUPDATED", "Информация обновлена.");
define("MSG_DEVICEKEYSNONE", "ключи устройств: нет");
define("MSG_FILEBEAUTIFIED", "Файл оформлен.");
define("MSG_FILECOPIED", "Файл скопирован.");
define("MSG_FILEDELETED", "Файл удален.");
define("MSG_FILERENAMED", "Файл переименован.");
define("MSG_FILESAVED", "Файл сохранен.");
define("MSG_NOFILESFOUND", "Файлы не найдены.");
define("MSG_NOUSERSFOUND", "Пользователи не найдены.");
define("MSG_PASSWORDCHANGED", "Пароль был изменен.");
define("MSG_SHAREKEYSNONE", "ключи для совместного использования: нет");
define("MSG_SHARESNONE", "совместное использование: нет");
define("MSG_SPACESNONE", "пространства: нет");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "активные ключи");
define("MSG_ACTIVESHARES", "активные акции");
define("MSG_ALIASGRANTED", "%%ALIAS%% предоставлено.");
define("MSG_ALIASISNOW", "Псевдоним теперь '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% восстановлен.");
define("MSG_ALIASREVOKED", "%%ALIAS%% отозван.");
define("MSG_CURRENTDEVICE", "текущее устройство");
define("MSG_DEVICEKEYS", "ключи устройства: ");
define("MSG_DIRECTORYOF", "Каталог ");
define("MSG_LISTOFADMINS", "Список администраторов:");
define("MSG_LISTOFUSERS", "Список пользователей:");
define("MSG_LOGGEDINAS", "Вы вошли как '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Новый ключ '%%NEWKEY%%' (%%ALIAS%%) создан.");
define("MSG_OFFLINE", "Вы сейчас оффлайн.");
define("MSG_ONLINE", "Вы сейчас онлайн.");
define("MSG_REGISTRATION", "Пользователь '%%USERNAME%%' зарегистрирован, пожалуйста, обратите внимание на следующую информацию и не делитесь своим именем пользователя и паролем с другими пользователями.\nимя пользователя: %%USERNAME%%\nпароль: %%PASSWORD%%\nпсевдоним:    %%ALIAS%%\nключ пользователя:  %%USERKEY%%");
define("MSG_SHARES", "акции:");
define("MSG_SPACENAMEISNOW", "Пространство теперь %%SPACENAME%%.");
define("MSG_SPACES", "пространства:");
define("MSG_USERNAMEISNOW", "Имя пользователя теперь '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Недействительный ключ устройства.");
define("ERR_GRANTEXISTS", "Разрешение уже существует.");
define("ERR_FILEEXISTS_DESTINATION", "Файл назначения уже существует.");
define("ERR_FILENOTEXISTS", "Файл не найден.");
define("ERR_FILENOTEXISTS_HELP", "Помощь недоступна.");
define("ERR_FILENOTEXISTS_SOURCE", "Исходный файл не существует.");
define("ERR_LOGININVALID", "Недействительный логин или пароль.");
define("ERR_LOGINNOTCURRENT", "Вы в данный момент не вошли в систему.");
define("ERR_JSONINVALID", "Недействительный JSON.");
define("ERR_NOTYETIMPLEMENTED", "Еще не реализовано.");
define("ERR_PARAMETERSMISSING", "Отсутствуют параметры.");
define("ERR_PASSWORDINVALIDNEW", "Недействительный новый пароль. Пароль должен содержать не менее 8 символов.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Недействительный предыдущий пароль.");
define("ERR_REGISTRATION", "Ошибка регистрации.");
define("ERR_SHAREKEYINVALID", "Недействительный ключ общего доступа.");
define("ERR_SPACEKEYINVALID", "Недействительный ключ пространства.");
define("ERR_SYSTEMGENERAL", "Общая ошибка системы.");
define("ERR_SYSTEMJSON", "Ошибка системного файла.");
define("ERR_USERNAMEUNAVAILABLE", "Имя пользователя недоступно.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% не определена.");

?>
