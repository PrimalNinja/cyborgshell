<?php

// messages
define("MSG_ABOUTUPDATED", "關於已更新。");
define("MSG_BLOCKEDWORDFOUND", "發現被阻擋的詞語。");
define("MSG_DEVICEKEYSNONE", "設備金鑰：無");
define("MSG_FILEBEAUTIFIED", "文件已美化。");
define("MSG_FILECOPIED", "文件已複製。");
define("MSG_FILEDELETED", "文件已刪除。");
define("MSG_FILERENAMED", "文件已重新命名。");
define("MSG_FILESAVED", "文件已保存。");
define("MSG_NOFILESFOUND", "未找到文件。");
define("MSG_NOUSERSFOUND", "未找到用戶。");
define("MSG_PASSWORDCHANGED", "密碼已更改。");
define("MSG_SHAREKEYSNONE", "分享金鑰：無");
define("MSG_SHARESNONE", "分享：無");
define("MSG_SPACESNONE", "空間：無");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "活躍的金鑰");
define("MSG_ACTIVESHARES", "活躍的股份");
define("MSG_ALIASGRANTED", "%%ALIAS%% 已授予。");
define("MSG_ALIASISNOW", "別名現在是 '%%ALIAS%%'。");
define("MSG_ALIASREINSTATED", "%%ALIAS%% 已恢復。");
define("MSG_ALIASREVOKED", "%%ALIAS%% 已撤銷。");
define("MSG_CURRENTDEVICE", "當前設備");
define("MSG_DEVICEKEYS", "設備金鑰: ");
define("MSG_DIRECTORYOF", "目錄 ");
define("MSG_LISTOFADMINS", "管理員列表：");
define("MSG_LISTOFUSERS", "用戶列表：");
define("MSG_LOGGEDINAS", "您已登錄為 '%%USERNAME%%'。");
define("MSG_NEWKEYCREATED", "新金鑰 '%%NEWKEY%%' (%%ALIAS%%) 已創建。");
define("MSG_OFFLINE", "您現在已離線。");
define("MSG_ONLINE", "您現在在線。");
define("MSG_REGISTRATION", "用戶 '%%USERNAME%%' 已註冊，請注意以下信息，並且不要與其他用戶分享您的用戶名和密碼。\n用戶名: %%USERNAME%%\n密碼: %%PASSWORD%%\n別名:    %%ALIAS%%\n用戶金鑰:  %%USERKEY%%");
define("MSG_SHARES", "股份：");
define("MSG_SPACENAMEISNOW", "空間現在是 %%SPACENAME%%。");
define("MSG_SPACES", "空間：");
define("MSG_USERNAMEISNOW", "用戶名現在是 '%%USERNAME%%'。");

// errors
define("ERR_DEVICEKEYINVALID", "裝置金鑰無效。");
define("ERR_GRANTEXISTS", "授權已存在。");
define("ERR_FILEEXISTS_DESTINATION", "目標檔案已存在。");
define("ERR_FILENOTEXISTS", "檔案未找到。");
define("ERR_FILENOTEXISTS_HELP", "無法提供幫助。");
define("ERR_FILENOTEXISTS_SOURCE", "來源檔案不存在。");
define("ERR_LOGININVALID", "登入或密碼無效。");
define("ERR_LOGINNOTCURRENT", "您目前未登入。");
define("ERR_JSONINVALID", "無效的 JSON。");
define("ERR_NOTYETIMPLEMENTED", "尚未實作。");
define("ERR_PARAMETERSMISSING", "缺少參數。");
define("ERR_PASSWORDINVALIDNEW", "新密碼無效。密碼必須至少 8 個字符長。");
define("ERR_PASSWORDINVALIDPREVIOUS", "舊密碼無效。");
define("ERR_REGISTRATION", "註冊錯誤。");
define("ERR_SHAREKEYINVALID", "共享金鑰無效。");
define("ERR_SPACEKEYINVALID", "空間金鑰無效。");
define("ERR_SYSTEMGENERAL", "系統一般錯誤。");
define("ERR_SYSTEMJSON", "系統檔案錯誤。");
define("ERR_USERNAMEUNAVAILABLE", "使用者名稱不可用。");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% 未定義。");

?>
