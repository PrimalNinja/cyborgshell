<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "تم تحديث المعلومات.");
define("MSG_BLOCKEDWORDFOUND", "تم العثور على كلمة محظورة.");
define("MSG_DEVICEKEYSNONE", "مفاتيح الجهاز: لا شيء");
define("MSG_FILEBEAUTIFIED", "تم تنسيق الملف.");
define("MSG_FILECOPIED", "تم نسخ الملف.");
define("MSG_FILEDELETED", "تم حذف الملف.");
define("MSG_FILERENAMED", "تم إعادة تسمية الملف.");
define("MSG_FILESAVED", "تم حفظ الملف.");
define("MSG_NOFILESFOUND", "لم يتم العثور على أي ملفات.");
define("MSG_NOUSERSFOUND", "لم يتم العثور على أي مستخدمين.");
define("MSG_PASSWORDCHANGED", "تم تغيير كلمة المرور.");
define("MSG_SHAREKEYSNONE", "مفاتيح المشاركة: لا شيء");
define("MSG_SHARESNONE", "المشاركات: لا شيء");
define("MSG_SPACESNONE", "المساحات: لا شيء");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "المفاتيح النشطة");
define("MSG_ACTIVESHARES", "الأسهم النشطة");
define("MSG_ALIASGRANTED", "تم منح %%ALIAS%%.");
define("MSG_ALIASISNOW", "الاسم المستعار الآن هو '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "تم إعادة %%ALIAS%%.");
define("MSG_ALIASREVOKED", "تم إلغاء %%ALIAS%%.");
define("MSG_CURRENTDEVICE", "الجهاز الحالي");
define("MSG_DEVICEKEYS", "مفاتيح الجهاز: ");
define("MSG_DIRECTORYOF", "دليل ");
define("MSG_LISTOFADMINS", "قائمة المسؤولين:");
define("MSG_LISTOFUSERS", "قائمة المستخدمين:");
define("MSG_LOGGEDINAS", "أنت مسجل الدخول كـ '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "تم إنشاء مفتاح جديد '%%NEWKEY%%' (%%ALIAS%%).");
define("MSG_OFFLINE", "أنت الآن غير متصل بالإنترنت.");
define("MSG_ONLINE", "أنت الآن متصل بالإنترنت.");
define("MSG_REGISTRATION", "تم تسجيل المستخدم '%%USERNAME%%'، يرجى ملاحظة المعلومات التالية وعدم مشاركة اسم المستخدم وكلمة المرور مع مستخدمين آخرين.\nاسم المستخدم: %%USERNAME%%\nكلمة المرور: %%PASSWORD%%\nالاسم المستعار: %%ALIAS%%\nمفتاح المستخدم: %%USERKEY%%");
define("MSG_SHARES", "الأسهم:");
define("MSG_SPACENAMEISNOW", "الفضاء الآن هو %%SPACENAME%%.");
define("MSG_SPACES", "الفضاءات:");
define("MSG_USERNAMEISNOW", "اسم المستخدم الآن هو '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "مفتاح الجهاز غير صالح.");
define("ERR_GRANTEXISTS", "الإذن موجود بالفعل.");
define("ERR_FILEEXISTS_DESTINATION", "ملف الوجهة موجود بالفعل.");
define("ERR_FILENOTEXISTS", "الملف غير موجود.");
define("ERR_FILENOTEXISTS_HELP", "المساعدة غير متاحة.");
define("ERR_FILENOTEXISTS_SOURCE", "ملف المصدر غير موجود.");
define("ERR_LOGININVALID", "تسجيل الدخول أو كلمة المرور غير صحيحة.");
define("ERR_LOGINNOTCURRENT", "أنت غير مسجل الدخول حالياً.");
define("ERR_JSONINVALID", "JSON غير صالح.");
define("ERR_NOTYETIMPLEMENTED", "لم يتم التنفيذ بعد.");
define("ERR_PARAMETERSMISSING", "المعلمات مفقودة.");
define("ERR_PASSWORDINVALIDNEW", "كلمة المرور الجديدة غير صالحة. يجب أن تتكون من 8 أحرف على الأقل.");
define("ERR_PASSWORDINVALIDPREVIOUS", "كلمة المرور السابقة غير صالحة.");
define("ERR_REGISTRATION", "خطأ في التسجيل.");
define("ERR_SHAREKEYINVALID", "مفتاح المشاركة غير صالح.");
define("ERR_SPACEKEYINVALID", "مفتاح المساحة غير صالح.");
define("ERR_SYSTEMGENERAL", "خطأ عام في النظام.");
define("ERR_SYSTEMJSON", "خطأ في ملف النظام.");
define("ERR_USERNAMEUNAVAILABLE", "اسم المستخدم غير متاح.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% غير معرف.");

?>
