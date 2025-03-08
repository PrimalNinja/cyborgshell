<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "ข้อมูลได้รับการอัปเดตแล้ว.");
define("MSG_BLOCKEDWORDFOUND", "พบคำที่ถูกบล็อก.");
define("MSG_DEVICEKEYSNONE", "devicekeys: ไม่มี");
define("MSG_FILEBEAUTIFIED", "ไฟล์ได้รับการปรับปรุงรูปแบบแล้ว.");
define("MSG_FILECOPIED", "ไฟล์ถูกคัดลอกแล้ว.");
define("MSG_FILEDELETED", "ไฟล์ถูกลบแล้ว.");
define("MSG_FILERENAMED", "ไฟล์ถูกเปลี่ยนชื่อแล้ว.");
define("MSG_FILESAVED", "ไฟล์ถูกบันทึกแล้ว.");
define("MSG_NOFILESFOUND", "ไม่พบไฟล์.");
define("MSG_NOUSERSFOUND", "ไม่พบผู้ใช้.");
define("MSG_PASSWORDCHANGED", "รหัสผ่านได้ถูกเปลี่ยนแล้ว.");
define("MSG_SHAREKEYSNONE", "sharekeys: ไม่มี");
define("MSG_SHARESNONE", "shares: ไม่มี");
define("MSG_SPACESNONE", "spaces: ไม่มี");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "คีย์ที่ใช้งานอยู่");
define("MSG_ACTIVESHARES", "หุ้นที่ใช้งานอยู่");
define("MSG_ALIASGRANTED", "%%ALIAS%% ได้รับอนุญาตแล้ว.");
define("MSG_ALIASISNOW", "ชื่อเล่นตอนนี้คือ '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% ได้รับการฟื้นฟู.");
define("MSG_ALIASREVOKED", "%%ALIAS%% ถูกเพิกถอน.");
define("MSG_CURRENTDEVICE", "อุปกรณ์ปัจจุบัน");
define("MSG_DEVICEKEYS", "คีย์อุปกรณ์: ");
define("MSG_DIRECTORYOF", "ไดเรกทอรีของ ");
define("MSG_LISTOFADMINS", "รายชื่อผู้ดูแลระบบ:");
define("MSG_LISTOFUSERS", "รายชื่อผู้ใช้:");
define("MSG_LOGGEDINAS", "คุณเข้าสู่ระบบในฐานะ '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "คีย์ใหม่ '%%NEWKEY%%' (%%ALIAS%%) ถูกสร้างขึ้น.");
define("MSG_OFFLINE", "คุณอยู่ในสถานะออฟไลน์แล้ว.");
define("MSG_ONLINE", "คุณอยู่ในสถานะออนไลน์แล้ว.");
define("MSG_REGISTRATION", "ผู้ใช้ '%%USERNAME%%' ได้ลงทะเบียนแล้ว กรุณาจดบันทึกข้อมูลต่อไปนี้และไม่แชร์ชื่อผู้ใช้และรหัสผ่านของคุณกับผู้ใช้อื่น.\nชื่อผู้ใช้: %%USERNAME%%\nรหัสผ่าน: %%PASSWORD%%\nชื่อเล่น:    %%ALIAS%%\nคีย์ผู้ใช้:  %%USERKEY%%");
define("MSG_SHARES", "หุ้น:");
define("MSG_SPACENAMEISNOW", "พื้นที่ตอนนี้คือ %%SPACENAME%%.");
define("MSG_SPACES", "พื้นที่:");
define("MSG_USERNAMEISNOW", "ชื่อผู้ใช้ตอนนี้คือ '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "คีย์อุปกรณ์ไม่ถูกต้อง.");
define("ERR_GRANTEXISTS", "สิทธิ์มีอยู่แล้ว.");
define("ERR_FILEEXISTS_DESTINATION", "ไฟล์ปลายทางมีอยู่แล้ว.");
define("ERR_FILENOTEXISTS", "ไม่พบไฟล์.");
define("ERR_FILENOTEXISTS_HELP", "ไม่มีความช่วยเหลือ.");
define("ERR_FILENOTEXISTS_SOURCE", "ไฟล์ต้นทางไม่มีอยู่.");
define("ERR_LOGININVALID", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.");
define("ERR_LOGINNOTCURRENT", "คุณไม่ได้เข้าสู่ระบบในขณะนี้.");
define("ERR_JSONINVALID", "JSON ไม่ถูกต้อง.");
define("ERR_NOTYETIMPLEMENTED", "ยังไม่ได้ดำเนินการ.");
define("ERR_PARAMETERSMISSING", "ขาดพารามิเตอร์.");
define("ERR_PASSWORDINVALIDNEW", "รหัสผ่านใหม่ไม่ถูกต้อง. รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร.");
define("ERR_PASSWORDINVALIDPREVIOUS", "รหัสผ่านก่อนหน้านี้ไม่ถูกต้อง.");
define("ERR_REGISTRATION", "เกิดข้อผิดพลาดในการลงทะเบียน.");
define("ERR_SHAREKEYINVALID", "คีย์แชร์ไม่ถูกต้อง.");
define("ERR_SPACEKEYINVALID", "คีย์พื้นที่ไม่ถูกต้อง.");
define("ERR_SYSTEMGENERAL", "ข้อผิดพลาดทั่วไปของระบบ.");
define("ERR_SYSTEMJSON", "ข้อผิดพลาดไฟล์ระบบ.");
define("ERR_USERNAMEUNAVAILABLE", "ชื่อผู้ใช้ไม่สามารถใช้งานได้.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% ไม่ได้ถูกกำหนด.");

?>
