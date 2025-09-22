<?php

// messages
define("MSG_ABOUTUPDATED", "Hakkında güncellendi.");
define("MSG_BLOCKEDWORDFOUND", "Engellenmiş kelime bulundu.");
define("MSG_DEVICEKEYSNONE", "cihaz anahtarları: yok");
define("MSG_FILEBEAUTIFIED", "Dosya güzelleştirildi.");
define("MSG_FILECOPIED", "Dosya kopyalandı.");
define("MSG_FILEDELETED", "Dosya silindi.");
define("MSG_FILERENAMED", "Dosya yeniden adlandırıldı.");
define("MSG_FILESAVED", "Dosya kaydedildi.");
define("MSG_NOFILESFOUND", "Hiç dosya bulunamadı.");
define("MSG_NOUSERSFOUND", "Hiç kullanıcı bulunamadı.");
define("MSG_PASSWORDCHANGED", "Şifre değiştirildi.");
define("MSG_SHAREKEYSNONE", "paylaşım anahtarları: yok");
define("MSG_SHARESNONE", "paylaşımlar: yok");
define("MSG_SPACESNONE", "alanlar: yok");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "aktif anahtarlar");
define("MSG_ACTIVESHARES", "aktif paylar");
define("MSG_ALIASGRANTED", "%%ALIAS%% verildi.");
define("MSG_ALIASISNOW", "Takma ad artık '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% yeniden verildi.");
define("MSG_ALIASREVOKED", "%%ALIAS%% iptal edildi.");
define("MSG_CURRENTDEVICE", "mevcut cihaz");
define("MSG_DEVICEKEYS", "cihaz anahtarları: ");
define("MSG_DIRECTORYOF", "Klasör ");
define("MSG_LISTOFADMINS", "Yönetici listesi:");
define("MSG_LISTOFUSERS", "Kullanıcı listesi:");
define("MSG_LOGGEDINAS", "'%%USERNAME%%' olarak giriş yaptınız.");
define("MSG_NEWKEYCREATED", "Yeni anahtar '%%NEWKEY%%' (%%ALIAS%%) oluşturuldu.");
define("MSG_OFFLINE", "Artık çevrimdışı.");
define("MSG_ONLINE", "Artık çevrimiçi.");
define("MSG_REGISTRATION", "'%%USERNAME%%' kullanıcısı kaydedildi, lütfen aşağıdaki bilgileri not edin ve kullanıcı adınızı ve şifrenizi diğer kullanıcılarla paylaşmayın.\nKullanıcı adı: %%USERNAME%%\nŞifre: %%PASSWORD%%\nTakma ad: %%ALIAS%%\nKullanıcı anahtarı: %%USERKEY%%");
define("MSG_SHARES", "paylar:");
define("MSG_SPACENAMEISNOW", "Alan artık %%SPACENAME%%.");
define("MSG_SPACES", "alanlar:");
define("MSG_USERNAMEISNOW", "Kullanıcı adı artık '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Geçersiz cihaz anahtarı.");
define("ERR_GRANTEXISTS", "İzin zaten mevcut.");
define("ERR_FILEEXISTS_DESTINATION", "Hedef dosya zaten mevcut.");
define("ERR_FILENOTEXISTS", "Dosya bulunamadı.");
define("ERR_FILENOTEXISTS_HELP", "Yardım mevcut değil.");
define("ERR_FILENOTEXISTS_SOURCE", "Kaynak dosya mevcut değil.");
define("ERR_LOGININVALID", "Geçersiz giriş veya şifre.");
define("ERR_LOGINNOTCURRENT", "Şu anda giriş yapmamışsınız.");
define("ERR_JSONINVALID", "Geçersiz JSON.");
define("ERR_NOTYETIMPLEMENTED", "Henüz uygulanmadı.");
define("ERR_PARAMETERSMISSING", "Eksik parametreler.");
define("ERR_PASSWORDINVALIDNEW", "Geçersiz yeni şifre. Şifre en az 8 karakter uzunluğunda olmalıdır.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Geçersiz önceki şifre.");
define("ERR_REGISTRATION", "Kayıt hatası.");
define("ERR_SHAREKEYINVALID", "Geçersiz paylaşım anahtarı.");
define("ERR_SPACEKEYINVALID", "Geçersiz alan anahtarı.");
define("ERR_SYSTEMGENERAL", "Sistem genel hatası.");
define("ERR_SYSTEMJSON", "Sistem dosyası hatası.");
define("ERR_USERNAMEUNAVAILABLE", "Kullanıcı adı mevcut değil.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% tanımlı değil.");

?>
