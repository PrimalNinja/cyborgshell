<?php

// messages
define("MSG_ABOUTUPDATED", "המידע עודכן.");
define("MSG_BLOCKEDWORDFOUND", "נמצאה מילה חסומה.");
define("MSG_DEVICEKEYSNONE", "מפתחות מכשירים: אין");
define("MSG_FILEBEAUTIFIED", "הקובץ עוצב.");
define("MSG_FILECOPIED", "הקובץ הועתק.");
define("MSG_FILEDELETED", "הקובץ נמחק.");
define("MSG_FILERENAMED", "הקובץ שונה שם.");
define("MSG_FILESAVED", "הקובץ נשמר.");
define("MSG_NOFILESFOUND", "לא נמצאו קבצים.");
define("MSG_NOUSERSFOUND", "לא נמצאו משתמשים.");
define("MSG_PASSWORDCHANGED", "הסיסמה שונתה.");
define("MSG_SHAREKEYSNONE", "מפתחות שיתוף: אין");
define("MSG_SHARESNONE", "שיתופים: אין");
define("MSG_SPACESNONE", "מרחבים: אין");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "מפתחות פעילים");
define("MSG_ACTIVESHARES", "מניות פעילות");
define("MSG_ALIASGRANTED", "%%ALIAS%% הוענק.");
define("MSG_ALIASISNOW", "הכינוי הוא עכשיו '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% הוחזר.");
define("MSG_ALIASREVOKED", "%%ALIAS%% נשלל.");
define("MSG_CURRENTDEVICE", "התקן נוכחי");
define("MSG_DEVICEKEYS", "מפתחות התקן: ");
define("MSG_DIRECTORYOF", "ספרייה של ");
define("MSG_LISTOFADMINS", "רשימת מנהלים:");
define("MSG_LISTOFUSERS", "רשימת משתמשים:");
define("MSG_LOGGEDINAS", "אתה מחובר כ'%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "מפתח חדש '%%NEWKEY%%' (%%ALIAS%%) נוצר.");
define("MSG_OFFLINE", "אתה עכשיו לא מחובר.");
define("MSG_ONLINE", "אתה עכשיו מחובר.");
define("MSG_REGISTRATION", "המשתמש '%%USERNAME%%' נרשם, אנא שים לב למידע הבא ואל תשתף את שם המשתמש והסיסמה שלך עם משתמשים אחרים.\nשם משתמש: %%USERNAME%%\nsיסמה: %%PASSWORD%%\נכיון:    %%ALIAS%%\nמפתח משתמש:  %%USERKEY%%");
define("MSG_SHARES", "מניות:");
define("MSG_SPACENAMEISNOW", "המרחב הוא עכשיו %%SPACENAME%%.");
define("MSG_SPACES", "מרחבים:");
define("MSG_USERNAMEISNOW", "שם המשתמש הוא עכשיו '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "מפתח מכשיר לא תקף.");
define("ERR_GRANTEXISTS", "ההענקה כבר קיימת.");
define("ERR_FILEEXISTS_DESTINATION", "קובץ היעד כבר קיים.");
define("ERR_FILENOTEXISTS", "הקובץ לא נמצא.");
define("ERR_FILENOTEXISTS_HELP", "עזרה אינה זמינה.");
define("ERR_FILENOTEXISTS_SOURCE", "קובץ המקור אינו קיים.");
define("ERR_LOGININVALID", "שם משתמש או סיסמה לא תקפים.");
define("ERR_LOGINNOTCURRENT", "אתה לא מחובר כרגע.");
define("ERR_JSONINVALID", "JSON לא תקף.");
define("ERR_NOTYETIMPLEMENTED", "עדיין לא יושם.");
define("ERR_PARAMETERSMISSING", "פרמטרים חסרים.");
define("ERR_PASSWORDINVALIDNEW", "סיסמה חדשה לא תקפה. הסיסמה חייבת להיות באורך של לפחות 8 תווים.");
define("ERR_PASSWORDINVALIDPREVIOUS", "סיסמה קודמת לא תקפה.");
define("ERR_REGISTRATION", "שגיאת רישום.");
define("ERR_SHAREKEYINVALID", "מפתח שיתוף לא תקף.");
define("ERR_SPACEKEYINVALID", "מפתח מרחב לא תקף.");
define("ERR_SYSTEMGENERAL", "שגיאה כללית במערכת.");
define("ERR_SYSTEMJSON", "שגיאת קובץ במערכת.");
define("ERR_USERNAMEUNAVAILABLE", "שם המשתמש אינו זמין.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% אינו מוגדר.");

?>
