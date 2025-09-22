<?php

// messages
define("MSG_ABOUTUPDATED", "درباره به روز شد.");
define("MSG_BLOCKEDWORDFOUND", "کلمه مسدود شده پیدا شد.");
define("MSG_DEVICEKEYSNONE", "devicekeys: هیچ");
define("MSG_FILEBEAUTIFIED", "فایل زیبا شد.");
define("MSG_FILECOPIED", "فایل کپی شد.");
define("MSG_FILEDELETED", "فایل حذف شد.");
define("MSG_FILERENAMED", "فایل تغییر نام داد.");
define("MSG_FILESAVED", "فایل ذخیره شد.");
define("MSG_NOFILESFOUND", "هیچ فایلی پیدا نشد.");
define("MSG_NOUSERSFOUND", "هیچ کاربری پیدا نشد.");
define("MSG_PASSWORDCHANGED", "رمز عبور تغییر یافت.");
define("MSG_SHAREKEYSNONE", "sharekeys: هیچ");
define("MSG_SHARESNONE", "shares: هیچ");
define("MSG_SPACESNONE", "spaces: هیچ");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "کلیدهای فعال");
define("MSG_ACTIVESHARES", "سهام‌های فعال");
define("MSG_ALIASGRANTED", "%%ALIAS%% اعطا شد.");
define("MSG_ALIASISNOW", "نام مستعار اکنون '%%ALIAS%%' است.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% دوباره فعال شد.");
define("MSG_ALIASREVOKED", "%%ALIAS%% لغو شد.");
define("MSG_CURRENTDEVICE", "دستگاه فعلی");
define("MSG_DEVICEKEYS", "کلیدهای دستگاه: ");
define("MSG_DIRECTORYOF", "فهرست ");
define("MSG_LISTOFADMINS", "فهرست مدیران:");
define("MSG_LISTOFUSERS", "فهرست کاربران:");
define("MSG_LOGGEDINAS", "شما به عنوان '%%USERNAME%%' وارد شده‌اید.");
define("MSG_NEWKEYCREATED", "کلید جدید '%%NEWKEY%%' (%%ALIAS%%) ایجاد شد.");
define("MSG_OFFLINE", "شما اکنون آفلاین هستید.");
define("MSG_ONLINE", "شما اکنون آنلاین هستید.");
define("MSG_REGISTRATION", "کاربر '%%USERNAME%%' ثبت‌نام شد، لطفاً به اطلاعات زیر توجه کنید و نام کاربری و رمز عبور خود را با دیگر کاربران به اشتراک نگذارید.\nنام کاربری: %%USERNAME%%\nرمز عبور: %%PASSWORD%%\nنام مستعار:    %%ALIAS%%\nکلید کاربر:  %%USERKEY%%");
define("MSG_SHARES", "سهام:");
define("MSG_SPACENAMEISNOW", "فضا اکنون %%SPACENAME%% است.");
define("MSG_SPACES", "فضاها:");
define("MSG_USERNAMEISNOW", "نام کاربری اکنون '%%USERNAME%%' است.");

// errors
define("ERR_DEVICEKEYINVALID", "کلید دستگاه نامعتبر است.");
define("ERR_GRANTEXISTS", "مجوز قبلاً وجود دارد.");
define("ERR_FILEEXISTS_DESTINATION", "فایل مقصد قبلاً وجود دارد.");
define("ERR_FILENOTEXISTS", "فایل پیدا نشد.");
define("ERR_FILENOTEXISTS_HELP", "کمک در دسترس نیست.");
define("ERR_FILENOTEXISTS_SOURCE", "فایل منبع وجود ندارد.");
define("ERR_LOGININVALID", "ورود یا رمز عبور نامعتبر است.");
define("ERR_LOGINNOTCURRENT", "شما در حال حاضر وارد نشده‌اید.");
define("ERR_JSONINVALID", "JSON نامعتبر است.");
define("ERR_NOTYETIMPLEMENTED", "هنوز پیاده‌سازی نشده است.");
define("ERR_PARAMETERSMISSING", "پارامترها گم شده‌اند.");
define("ERR_PASSWORDINVALIDNEW", "رمز عبور جدید نامعتبر است. رمز عبور باید حداقل 8 کاراکتر باشد.");
define("ERR_PASSWORDINVALIDPREVIOUS", "رمز عبور قبلی نامعتبر است.");
define("ERR_REGISTRATION", "خطای ثبت‌نام.");
define("ERR_SHAREKEYINVALID", "کلید اشتراک نامعتبر است.");
define("ERR_SPACEKEYINVALID", "کلید فضای نامعتبر است.");
define("ERR_SYSTEMGENERAL", "خطای عمومی سیستم.");
define("ERR_SYSTEMJSON", "خطای فایل سیستم.");
define("ERR_USERNAMEUNAVAILABLE", "نام کاربری در دسترس نیست.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% تعریف نشده است.");

?>
