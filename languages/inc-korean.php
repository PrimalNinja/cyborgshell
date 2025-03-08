<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "정보가 업데이트되었습니다.");
define("MSG_BLOCKEDWORDFOUND", "차단된 단어가 발견되었습니다.");
define("MSG_DEVICEKEYSNONE", "장치 키: 없음");
define("MSG_FILEBEAUTIFIED", "파일이 아름답게 꾸며졌습니다.");
define("MSG_FILECOPIED", "파일이 복사되었습니다.");
define("MSG_FILEDELETED", "파일이 삭제되었습니다.");
define("MSG_FILERENAMED", "파일의 이름이 변경되었습니다.");
define("MSG_FILESAVED", "파일이 저장되었습니다.");
define("MSG_NOFILESFOUND", "파일이 발견되지 않았습니다.");
define("MSG_NOUSERSFOUND", "사용자가 발견되지 않았습니다.");
define("MSG_PASSWORDCHANGED", "비밀번호가 변경되었습니다.");
define("MSG_SHAREKEYSNONE", "공유 키: 없음");
define("MSG_SHARESNONE", "공유: 없음");
define("MSG_SPACESNONE", "공간: 없음");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "활성 키");
define("MSG_ACTIVESHARES", "활성 주식");
define("MSG_ALIASGRANTED", "%%ALIAS%%이(가) 부여되었습니다.");
define("MSG_ALIASISNOW", "별명이 이제 '%%ALIAS%%'입니다.");
define("MSG_ALIASREINSTATED", "%%ALIAS%%이(가) 복원되었습니다.");
define("MSG_ALIASREVOKED", "%%ALIAS%%이(가) 철회되었습니다.");
define("MSG_CURRENTDEVICE", "현재 장치");
define("MSG_DEVICEKEYS", "장치 키: ");
define("MSG_DIRECTORYOF", "디렉토리 ");
define("MSG_LISTOFADMINS", "관리자 목록:");
define("MSG_LISTOFUSERS", "사용자 목록:");
define("MSG_LOGGEDINAS", "'%%USERNAME%%'로 로그인했습니다.");
define("MSG_NEWKEYCREATED", "새 키 '%%NEWKEY%%' (%%ALIAS%%)가 생성되었습니다.");
define("MSG_OFFLINE", "현재 오프라인입니다.");
define("MSG_ONLINE", "현재 온라인입니다.");
define("MSG_REGISTRATION", "사용자 '%%USERNAME%%'가 등록되었습니다. 다음 정보를 기록하고 사용자 이름과 비밀번호를 다른 사용자와 공유하지 마십시오.\n사용자 이름: %%USERNAME%%\n비밀번호: %%PASSWORD%%\n별명:    %%ALIAS%%\n사용자 키:  %%USERKEY%%");
define("MSG_SHARES", "주식:");
define("MSG_SPACENAMEISNOW", "공간 이름이 이제 %%SPACENAME%%입니다.");
define("MSG_SPACES", "공간:");
define("MSG_USERNAMEISNOW", "사용자 이름이 이제 '%%USERNAME%%'입니다.");

// errors
define("ERR_DEVICEKEYINVALID", "유효하지 않은 장치 키입니다.");
define("ERR_GRANTEXISTS", "권한이 이미 존재합니다.");
define("ERR_FILEEXISTS_DESTINATION", "대상 파일이 이미 존재합니다.");
define("ERR_FILENOTEXISTS", "파일을 찾을 수 없습니다.");
define("ERR_FILENOTEXISTS_HELP", "도움말을 사용할 수 없습니다.");
define("ERR_FILENOTEXISTS_SOURCE", "원본 파일이 존재하지 않습니다.");
define("ERR_LOGININVALID", "유효하지 않은 로그인 또는 비밀번호입니다.");
define("ERR_LOGINNOTCURRENT", "현재 로그인되어 있지 않습니다.");
define("ERR_JSONINVALID", "유효하지 않은 JSON입니다.");
define("ERR_NOTYETIMPLEMENTED", "아직 구현되지 않았습니다.");
define("ERR_PARAMETERSMISSING", "필요한 매개변수가 누락되었습니다.");
define("ERR_PASSWORDINVALIDNEW", "유효하지 않은 새 비밀번호입니다. 비밀번호는 최소 8자 이상이어야 합니다.");
define("ERR_PASSWORDINVALIDPREVIOUS", "유효하지 않은 이전 비밀번호입니다.");
define("ERR_REGISTRATION", "등록 오류입니다.");
define("ERR_SHAREKEYINVALID", "유효하지 않은 공유 키입니다.");
define("ERR_SPACEKEYINVALID", "유효하지 않은 공간 키입니다.");
define("ERR_SYSTEMGENERAL", "시스템 일반 오류입니다.");
define("ERR_SYSTEMJSON", "시스템 파일 오류입니다.");
define("ERR_USERNAMEUNAVAILABLE", "사용자 이름이 사용 불가능합니다.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%%가 정의되지 않았습니다.");

?>
