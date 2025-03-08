<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "Thông tin đã được cập nhật.");
define("MSG_BLOCKEDWORDFOUND", "Từ bị chặn đã được tìm thấy.");
define("MSG_DEVICEKEYSNONE", "khóa thiết bị: không có");
define("MSG_FILEBEAUTIFIED", "Tệp đã được làm đẹp.");
define("MSG_FILECOPIED", "Tệp đã được sao chép.");
define("MSG_FILEDELETED", "Tệp đã được xóa.");
define("MSG_FILERENAMED", "Tệp đã được đổi tên.");
define("MSG_FILESAVED", "Tệp đã được lưu.");
define("MSG_NOFILESFOUND", "Không tìm thấy tệp nào.");
define("MSG_NOUSERSFOUND", "Không tìm thấy người dùng nào.");
define("MSG_PASSWORDCHANGED", "Mật khẩu đã được thay đổi.");
define("MSG_SHAREKEYSNONE", "khóa chia sẻ: không có");
define("MSG_SHARESNONE", "chia sẻ: không có");
define("MSG_SPACESNONE", "không gian: không có");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "khóa hoạt động");
define("MSG_ACTIVESHARES", "cổ phần hoạt động");
define("MSG_ALIASGRANTED", "%%ALIAS%% đã được cấp.");
define("MSG_ALIASISNOW", "Alias hiện là '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% đã được phục hồi.");
define("MSG_ALIASREVOKED", "%%ALIAS%% đã bị thu hồi.");
define("MSG_CURRENTDEVICE", "thiết bị hiện tại");
define("MSG_DEVICEKEYS", "khóa thiết bị: ");
define("MSG_DIRECTORYOF", "Thư mục của ");
define("MSG_LISTOFADMINS", "Danh sách quản trị viên:");
define("MSG_LISTOFUSERS", "Danh sách người dùng:");
define("MSG_LOGGEDINAS", "Bạn đã đăng nhập với tư cách '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Khóa mới '%%NEWKEY%%' (%%ALIAS%%) đã được tạo.");
define("MSG_OFFLINE", "Bạn hiện đang ngoại tuyến.");
define("MSG_ONLINE", "Bạn hiện đang trực tuyến.");
define("MSG_REGISTRATION", "Người dùng '%%USERNAME%%' đã đăng ký, vui lòng ghi nhớ thông tin sau và không chia sẻ tên người dùng và mật khẩu của bạn với người dùng khác.\ntên người dùng: %%USERNAME%%\nmật khẩu: %%PASSWORD%%\nalias:    %%ALIAS%%\nkhóa người dùng:  %%USERKEY%%");
define("MSG_SHARES", "cổ phần:");
define("MSG_SPACENAMEISNOW", "Không gian hiện là %%SPACENAME%%.");
define("MSG_SPACES", "không gian:");
define("MSG_USERNAMEISNOW", "Tên người dùng hiện là '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Khóa thiết bị không hợp lệ.");
define("ERR_GRANTEXISTS", "Quyền đã tồn tại.");
define("ERR_FILEEXISTS_DESTINATION", "Tập tin đích đã tồn tại.");
define("ERR_FILENOTEXISTS", "Không tìm thấy tập tin.");
define("ERR_FILENOTEXISTS_HELP", "Trợ giúp không khả dụng.");
define("ERR_FILENOTEXISTS_SOURCE", "Tập tin nguồn không tồn tại.");
define("ERR_LOGININVALID", "Đăng nhập hoặc mật khẩu không hợp lệ.");
define("ERR_LOGINNOTCURRENT", "Bạn hiện không đăng nhập.");
define("ERR_JSONINVALID", "JSON không hợp lệ.");
define("ERR_NOTYETIMPLEMENTED", "Chưa được triển khai.");
define("ERR_PARAMETERSMISSING", "Thiếu tham số.");
define("ERR_PASSWORDINVALIDNEW", "Mật khẩu mới không hợp lệ. Mật khẩu phải có ít nhất 8 ký tự.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Mật khẩu trước không hợp lệ.");
define("ERR_REGISTRATION", "Lỗi đăng ký.");
define("ERR_SHAREKEYINVALID", "Khóa chia sẻ không hợp lệ.");
define("ERR_SPACEKEYINVALID", "Khóa không gian không hợp lệ.");
define("ERR_SYSTEMGENERAL", "Lỗi hệ thống chung.");
define("ERR_SYSTEMJSON", "Lỗi tập tin hệ thống.");
define("ERR_USERNAMEUNAVAILABLE", "Tên người dùng không khả dụng.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% không được định nghĩa.");

?>
