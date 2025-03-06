<?php

// actions
define("ACTION_INVALIDATE", "invalidate");

// messages
define("MSG_ABOUTUPDATED", "关于已更新。");
define("MSG_DEVICEKEYSNONE", "设备密钥：无");
define("MSG_FILEBEAUTIFIED", "文件已美化。");
define("MSG_FILECOPIED", "文件已复制。");
define("MSG_FILEDELETED", "文件已删除。");
define("MSG_FILERENAMED", "文件已重命名。");
define("MSG_FILESAVED", "文件已保存。");
define("MSG_NOFILESFOUND", "未找到文件。");
define("MSG_NOUSERSFOUND", "未找到用户。");
define("MSG_PASSWORDCHANGED", "密码已更改。");
define("MSG_SHAREKEYSNONE", "共享密钥：无");
define("MSG_SHARESNONE", "共享：无");
define("MSG_SPACESNONE", "空间：无");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "活跃密钥");
define("MSG_ACTIVESHARES", "活跃股份");
define("MSG_ALIASGRANTED", "%%ALIAS%% 已授予。");
define("MSG_ALIASISNOW", "别名现在是 '%%ALIAS%%'。");
define("MSG_ALIASREINSTATED", "%%ALIAS%% 已恢复。");
define("MSG_ALIASREVOKED", "%%ALIAS%% 已撤销。");
define("MSG_CURRENTDEVICE", "当前设备");
define("MSG_DEVICEKEYS", "设备密钥: ");
define("MSG_DIRECTORYOF", "目录 ");
define("MSG_LISTOFADMINS", "管理员列表：");
define("MSG_LISTOFUSERS", "用户列表：");
define("MSG_LOGGEDINAS", "您已登录为 '%%USERNAME%%'。");
define("MSG_NEWKEYCREATED", "新密钥 '%%NEWKEY%%' (%%ALIAS%%) 已创建。");
define("MSG_OFFLINE", "您现在处于离线状态。");
define("MSG_ONLINE", "您现在处于在线状态。");
define("MSG_REGISTRATION", "用户 '%%USERNAME%%' 注册成功，请注意以下信息，并且不要与其他用户分享您的用户名和密码。\n用户名: %%USERNAME%%\n密码: %%PASSWORD%%\n别名: %%ALIAS%%\n用户密钥: %%USERKEY%%");
define("MSG_SHARES", "股份：");
define("MSG_SPACENAMEISNOW", "空间现在是 %%SPACENAME%%。");
define("MSG_SPACES", "空间：");
define("MSG_USERNAMEISNOW", "用户名现在是 '%%USERNAME%%'。");

// errors
define("ERR_DEVICEKEYINVALID", "设备密钥无效。");
define("ERR_GRANTEXISTS", "授权已存在。");
define("ERR_FILEEXISTS_DESTINATION", "目标文件已存在。");
define("ERR_FILENOTEXISTS", "文件未找到。");
define("ERR_FILENOTEXISTS_HELP", "帮助不可用。");
define("ERR_FILENOTEXISTS_SOURCE", "源文件不存在。");
define("ERR_LOGININVALID", "登录或密码无效。");
define("ERR_LOGINNOTCURRENT", "您当前未登录。");
define("ERR_JSONINVALID", "无效的 JSON。");
define("ERR_NOTYETIMPLEMENTED", "尚未实现。");
define("ERR_PARAMETERSMISSING", "缺少参数。");
define("ERR_PASSWORDINVALIDNEW", "新密码无效。密码必须至少为 8 个字符。");
define("ERR_PASSWORDINVALIDPREVIOUS", "上一个密码无效。");
define("ERR_REGISTRATION", "注册错误。");
define("ERR_SHAREKEYINVALID", "共享密钥无效。");
define("ERR_SPACEKEYINVALID", "空间密钥无效。");
define("ERR_SYSTEMGENERAL", "系统一般错误。");
define("ERR_SYSTEMJSON", "系统文件错误。");
define("ERR_USERNAMEUNAVAILABLE", "用户名不可用。");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% 未定义。");

?>
