<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "Informacje zaktualizowane.");
define("MSG_BLOCKEDWORDFOUND", "Znaleziono zablokowane słowo.");
define("MSG_DEVICEKEYSNONE", "klucze urządzeń: brak");
define("MSG_FILEBEAUTIFIED", "Plik upiększony.");
define("MSG_FILECOPIED", "Plik skopiowany.");
define("MSG_FILEDELETED", "Plik usunięty.");
define("MSG_FILERENAMED", "Plik przemianowany.");
define("MSG_FILESAVED", "Plik zapisany.");
define("MSG_NOFILESFOUND", "Nie znaleziono plików.");
define("MSG_NOUSERSFOUND", "Nie znaleziono użytkowników.");
define("MSG_PASSWORDCHANGED", "Hasło zostało zmienione.");
define("MSG_SHAREKEYSNONE", "klucze udostępnienia: brak");
define("MSG_SHARESNONE", "udzielenia: brak");
define("MSG_SPACESNONE", "przestrzenie: brak");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "aktywne klucze");
define("MSG_ACTIVESHARES", "aktywne udziały");
define("MSG_ALIASGRANTED", "%%ALIAS%% przyznany.");
define("MSG_ALIASISNOW", "Alias jest teraz '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% przywrócony.");
define("MSG_ALIASREVOKED", "%%ALIAS%% cofnięty.");
define("MSG_CURRENTDEVICE", "aktualne urządzenie");
define("MSG_DEVICEKEYS", "klucze urządzenia: ");
define("MSG_DIRECTORYOF", "Katalog ");
define("MSG_LISTOFADMINS", "Lista administratorów:");
define("MSG_LISTOFUSERS", "Lista użytkowników:");
define("MSG_LOGGEDINAS", "Jesteś zalogowany jako '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nowy klucz '%%NEWKEY%%' (%%ALIAS%%) utworzony.");
define("MSG_OFFLINE", "Jesteś teraz offline.");
define("MSG_ONLINE", "Jesteś teraz online.");
define("MSG_REGISTRATION", "Użytkownik '%%USERNAME%%' zarejestrowany, proszę zanotować następujące informacje i nie dzielić się swoją nazwą użytkownika oraz hasłem z innymi użytkownikami.\nnazwa użytkownika: %%USERNAME%%\nhasło: %%PASSWORD%%\nalias:    %%ALIAS%%\nklucz użytkownika:  %%USERKEY%%");
define("MSG_SHARES", "udziały:");
define("MSG_SPACENAMEISNOW", "Przestrzeń to teraz %%SPACENAME%%.");
define("MSG_SPACES", "przestrzenie:");
define("MSG_USERNAMEISNOW", "Nazwa użytkownika jest teraz '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Nieprawidłowy klucz urządzenia.");
define("ERR_GRANTEXISTS", "Uprawnienie już istnieje.");
define("ERR_FILEEXISTS_DESTINATION", "Plik docelowy już istnieje.");
define("ERR_FILENOTEXISTS", "Plik nie znaleziony.");
define("ERR_FILENOTEXISTS_HELP", "Pomoc jest niedostępna.");
define("ERR_FILENOTEXISTS_SOURCE", "Plik źródłowy nie istnieje.");
define("ERR_LOGININVALID", "Nieprawidłowy login lub hasło.");
define("ERR_LOGINNOTCURRENT", "Nie jesteś aktualnie zalogowany.");
define("ERR_JSONINVALID", "Nieprawidłowy JSON.");
define("ERR_NOTYETIMPLEMENTED", "Jeszcze nie zaimplementowane.");
define("ERR_PARAMETERSMISSING", "Brakujące parametry.");
define("ERR_PASSWORDINVALIDNEW", "Nieprawidłowe nowe hasło. Hasło musi mieć co najmniej 8 znaków.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Nieprawidłowe poprzednie hasło.");
define("ERR_REGISTRATION", "Błąd rejestracji.");
define("ERR_SHAREKEYINVALID", "Nieprawidłowy klucz udostępniania.");
define("ERR_SPACEKEYINVALID", "Nieprawidłowy klucz przestrzeni.");
define("ERR_SYSTEMGENERAL", "Ogólny błąd systemu.");
define("ERR_SYSTEMJSON", "Błąd pliku systemowego.");
define("ERR_USERNAMEUNAVAILABLE", "Nazwa użytkownika niedostępna.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% nie jest zdefiniowane.");

?>
