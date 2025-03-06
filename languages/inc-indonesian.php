<?php

// actions
define("ACTION_INVALIDATE", "invalidate");

// messages
define("MSG_ABOUTUPDATED", "Tentang telah diperbarui.");
define("MSG_DEVICEKEYSNONE", "kunci perangkat: tidak ada");
define("MSG_FILEBEAUTIFIED", "File telah diperindah.");
define("MSG_FILECOPIED", "File telah disalin.");
define("MSG_FILEDELETED", "File telah dihapus.");
define("MSG_FILERENAMED", "File telah dinamai ulang.");
define("MSG_FILESAVED", "File telah disimpan.");
define("MSG_NOFILESFOUND", "Tidak ada file yang ditemukan.");
define("MSG_NOUSERSFOUND", "Tidak ada pengguna yang ditemukan.");
define("MSG_PASSWORDCHANGED", "Kata sandi telah diubah.");
define("MSG_SHAREKEYSNONE", "kunci berbagi: tidak ada");
define("MSG_SHARESNONE", "berbagi: tidak ada");
define("MSG_SPACESNONE", "ruang: tidak ada");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "kunci aktif");
define("MSG_ACTIVESHARES", "saham aktif");
define("MSG_ALIASGRANTED", "%%ALIAS%% diberikan.");
define("MSG_ALIASISNOW", "Alias sekarang adalah '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% dipulihkan.");
define("MSG_ALIASREVOKED", "%%ALIAS%% dicabut.");
define("MSG_CURRENTDEVICE", "perangkat saat ini");
define("MSG_DEVICEKEYS", "kunci perangkat: ");
define("MSG_DIRECTORYOF", "Direktori dari ");
define("MSG_LISTOFADMINS", "Daftar admin:");
define("MSG_LISTOFUSERS", "Daftar pengguna:");
define("MSG_LOGGEDINAS", "Anda telah masuk sebagai '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Kunci baru '%%NEWKEY%%' (%%ALIAS%%) dibuat.");
define("MSG_OFFLINE", "Anda sekarang offline.");
define("MSG_ONLINE", "Anda sekarang online.");
define("MSG_REGISTRATION", "Pengguna '%%USERNAME%%' terdaftar, harap catat informasi berikut dan jangan bagikan nama pengguna dan kata sandi Anda dengan pengguna lain.\nnama pengguna: %%USERNAME%%\nkata sandi: %%PASSWORD%%\nalias:    %%ALIAS%%\nkunci pengguna:  %%USERKEY%%");
define("MSG_SHARES", "saham:");
define("MSG_SPACENAMEISNOW", "Ruang sekarang adalah %%SPACENAME%%.");
define("MSG_SPACES", "ruang:");
define("MSG_USERNAMEISNOW", "Nama pengguna sekarang adalah '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Kunci perangkat tidak valid.");
define("ERR_GRANTEXISTS", "Izin sudah ada.");
define("ERR_FILEEXISTS_DESTINATION", "File tujuan sudah ada.");
define("ERR_FILENOTEXISTS", "File tidak ditemukan.");
define("ERR_FILENOTEXISTS_HELP", "Bantuan tidak tersedia.");
define("ERR_FILENOTEXISTS_SOURCE", "File sumber tidak ada.");
define("ERR_LOGININVALID", "Login atau kata sandi tidak valid.");
define("ERR_LOGINNOTCURRENT", "Anda tidak sedang login.");
define("ERR_JSONINVALID", "JSON tidak valid.");
define("ERR_NOTYETIMPLEMENTED", "Belum diimplementasikan.");
define("ERR_PARAMETERSMISSING", "Parameter yang hilang.");
define("ERR_PASSWORDINVALIDNEW", "Kata sandi baru tidak valid. Kata sandi harus terdiri dari minimal 8 karakter.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Kata sandi sebelumnya tidak valid.");
define("ERR_REGISTRATION", "Kesalahan pendaftaran.");
define("ERR_SHAREKEYINVALID", "Kunci berbagi tidak valid.");
define("ERR_SPACEKEYINVALID", "Kunci ruang tidak valid.");
define("ERR_SYSTEMGENERAL", "Kesalahan umum sistem.");
define("ERR_SYSTEMJSON", "Kesalahan file sistem.");
define("ERR_USERNAMEUNAVAILABLE", "Nama pengguna tidak tersedia.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% tidak didefinisikan.");

?>
