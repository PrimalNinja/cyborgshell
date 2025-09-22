<?php

// messages
define("MSG_ABOUTUPDATED", "Sobre atualizado.");
define("MSG_BLOCKEDWORDFOUND", "Palavra bloqueada encontrada.");
define("MSG_DEVICEKEYSNONE", "chaves de dispositivo: nenhuma");
define("MSG_FILEBEAUTIFIED", "Arquivo embelezado.");
define("MSG_FILECOPIED", "Arquivo copiado.");
define("MSG_FILEDELETED", "Arquivo deletado.");
define("MSG_FILERENAMED", "Arquivo renomeado.");
define("MSG_FILESAVED", "Arquivo salvo.");
define("MSG_NOFILESFOUND", "Nenhum arquivo encontrado.");
define("MSG_NOUSERSFOUND", "Nenhum usuário encontrado.");
define("MSG_PASSWORDCHANGED", "A senha foi alterada.");
define("MSG_SHAREKEYSNONE", "chaves de compartilhamento: nenhuma");
define("MSG_SHARESNONE", "compartilhamentos: nenhum");
define("MSG_SPACESNONE", "espaços: nenhum");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "chaves ativas");
define("MSG_ACTIVESHARES", "ações ativas");
define("MSG_ALIASGRANTED", "%%ALIAS%% concedido.");
define("MSG_ALIASISNOW", "O alias agora é '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% reintegrado.");
define("MSG_ALIASREVOKED", "%%ALIAS%% revogado.");
define("MSG_CURRENTDEVICE", "dispositivo atual");
define("MSG_DEVICEKEYS", "chaves do dispositivo: ");
define("MSG_DIRECTORYOF", "Diretório de ");
define("MSG_LISTOFADMINS", "Lista de administradores:");
define("MSG_LISTOFUSERS", "Lista de usuários:");
define("MSG_LOGGEDINAS", "Você está logado como '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Nova chave '%%NEWKEY%%' (%%ALIAS%%) criada.");
define("MSG_OFFLINE", "Você está agora offline.");
define("MSG_ONLINE", "Você está agora online.");
define("MSG_REGISTRATION", "Usuário '%%USERNAME%%' registrado, por favor, tome nota das seguintes informações e não compartilhe seu nome de usuário e senha com outros usuários.\nnome de usuário: %%USERNAME%%\nsenha: %%PASSWORD%%\nalias:    %%ALIAS%%\nchave do usuário:  %%USERKEY%%");
define("MSG_SHARES", "ações:");
define("MSG_SPACENAMEISNOW", "Espaço agora é %%SPACENAME%%.");
define("MSG_SPACES", "espaços:");
define("MSG_USERNAMEISNOW", "Nome de usuário agora é '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Chave de dispositivo inválida.");
define("ERR_GRANTEXISTS", "Concessão já existe.");
define("ERR_FILEEXISTS_DESTINATION", "Arquivo de destino já existe.");
define("ERR_FILENOTEXISTS", "Arquivo não encontrado.");
define("ERR_FILENOTEXISTS_HELP", "Ajuda não está disponível.");
define("ERR_FILENOTEXISTS_SOURCE", "Arquivo de origem não existe.");
define("ERR_LOGININVALID", "Login ou senha inválidos.");
define("ERR_LOGINNOTCURRENT", "Você não está logado atualmente.");
define("ERR_JSONINVALID", "JSON inválido.");
define("ERR_NOTYETIMPLEMENTED", "Ainda não implementado.");
define("ERR_PARAMETERSMISSING", "Parâmetros ausentes.");
define("ERR_PASSWORDINVALIDNEW", "Senha nova inválida. A senha deve ter pelo menos 8 caracteres.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Senha anterior inválida.");
define("ERR_REGISTRATION", "Erro de registro.");
define("ERR_SHAREKEYINVALID", "Chave de compartilhamento inválida.");
define("ERR_SPACEKEYINVALID", "Chave de espaço inválida.");
define("ERR_SYSTEMGENERAL", "Erro geral do sistema.");
define("ERR_SYSTEMJSON", "Erro no arquivo do sistema.");
define("ERR_USERNAMEUNAVAILABLE", "Nome de usuário indisponível.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% não está definido.");

?>
