<?php

// actions
define("ACTION_INVALIDATE", "invalidate");

// messages
define("MSG_ABOUTUPDATED", "情報が更新されました。");
define("MSG_BLOCKEDWORDFOUND", "ブロックされた単語が見つかりました。");
define("MSG_DEVICEKEYSNONE", "デバイスキー: なし");
define("MSG_FILEBEAUTIFIED", "ファイルが美化されました。");
define("MSG_FILECOPIED", "ファイルがコピーされました。");
define("MSG_FILEDELETED", "ファイルが削除されました。");
define("MSG_FILERENAMED", "ファイルが名前変更されました。");
define("MSG_FILESAVED", "ファイルが保存されました。");
define("MSG_NOFILESFOUND", "ファイルが見つかりませんでした。");
define("MSG_NOUSERSFOUND", "ユーザーが見つかりませんでした。");
define("MSG_PASSWORDCHANGED", "パスワードが変更されました。");
define("MSG_SHAREKEYSNONE", "共有キー: なし");
define("MSG_SHARESNONE", "共有: なし");
define("MSG_SPACESNONE", "スペース: なし");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "アクティブキー");
define("MSG_ACTIVESHARES", "アクティブシェア");
define("MSG_ALIASGRANTED", "%%ALIAS%% が付与されました。");
define("MSG_ALIASISNOW", "エイリアスは現在 '%%ALIAS%%' です。");
define("MSG_ALIASREINSTATED", "%%ALIAS%% が復活しました。");
define("MSG_ALIASREVOKED", "%%ALIAS%% が取り消されました。");
define("MSG_CURRENTDEVICE", "現在のデバイス");
define("MSG_DEVICEKEYS", "デバイスキー: ");
define("MSG_DIRECTORYOF", "ディレクトリ: ");
define("MSG_LISTOFADMINS", "管理者のリスト:");
define("MSG_LISTOFUSERS", "ユーザーのリスト:");
define("MSG_LOGGEDINAS", "'%%USERNAME%%' としてログインしています。");
define("MSG_NEWKEYCREATED", "新しいキー '%%NEWKEY%%' (%%ALIAS%%) が作成されました。");
define("MSG_OFFLINE", "現在オフラインです。");
define("MSG_ONLINE", "現在オンラインです。");
define("MSG_REGISTRATION", "ユーザー '%%USERNAME%%' が登録されました。以下の情報をメモしておき、他のユーザーとユーザー名とパスワードを共有しないでください。\nユーザー名: %%USERNAME%%\nパスワード: %%PASSWORD%%\nエイリアス: %%ALIAS%%\nユーザーキー: %%USERKEY%%");
define("MSG_SHARES", "シェア:");
define("MSG_SPACENAMEISNOW", "スペースは現在 %%SPACENAME%% です。");
define("MSG_SPACES", "スペース:");
define("MSG_USERNAMEISNOW", "ユーザー名は現在 '%%USERNAME%%' です。");

// errors
define("ERR_DEVICEKEYINVALID", "無効なデバイスキーです。");
define("ERR_GRANTEXISTS", "権限は既に存在します。");
define("ERR_FILEEXISTS_DESTINATION", "宛先ファイルは既に存在します。");
define("ERR_FILENOTEXISTS", "ファイルが見つかりません。");
define("ERR_FILENOTEXISTS_HELP", "ヘルプは利用できません。");
define("ERR_FILENOTEXISTS_SOURCE", "ソースファイルは存在しません。");
define("ERR_LOGININVALID", "無効なログインまたはパスワードです。");
define("ERR_LOGINNOTCURRENT", "現在ログインしていません。");
define("ERR_JSONINVALID", "無効なJSONです。");
define("ERR_NOTYETIMPLEMENTED", "まだ実装されていません。");
define("ERR_PARAMETERSMISSING", "パラメータが不足しています。");
define("ERR_PASSWORDINVALIDNEW", "無効な新しいパスワードです。パスワードは8文字以上でなければなりません。");
define("ERR_PASSWORDINVALIDPREVIOUS", "無効な以前のパスワードです。");
define("ERR_REGISTRATION", "登録エラーです。");
define("ERR_SHAREKEYINVALID", "無効な共有キーです。");
define("ERR_SPACEKEYINVALID", "無効なスペースキーです。");
define("ERR_SYSTEMGENERAL", "システム一般エラーです。");
define("ERR_SYSTEMJSON", "システムファイルエラーです。");
define("ERR_USERNAMEUNAVAILABLE", "ユーザー名は使用できません。");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% は定義されていません。");

?>
