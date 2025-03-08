<?php

// actions
define("ACTION_INVALIDATE", "invalidate");
define("ACTION_LTR", "ltr");
define("ACTION_RTL", "rtl");

// messages
define("MSG_ABOUTUPDATED", "Η ενημέρωση ολοκληρώθηκε.");
define("MSG_BLOCKEDWORDFOUND", "Βρέθηκε αποκλεισμένη λέξη.");
define("MSG_DEVICEKEYSNONE", "κλειδιά συσκευής: κανένα");
define("MSG_FILEBEAUTIFIED", "Το αρχείο έχει ομορφυνθεί.");
define("MSG_FILECOPIED", "Το αρχείο έχει αντιγραφεί.");
define("MSG_FILEDELETED", "Το αρχείο έχει διαγραφεί.");
define("MSG_FILERENAMED", "Το αρχείο έχει μετονομαστεί.");
define("MSG_FILESAVED", "Το αρχείο έχει αποθηκευτεί.");
define("MSG_NOFILESFOUND", "Δεν βρέθηκαν αρχεία.");
define("MSG_NOUSERSFOUND", "Δεν βρέθηκαν χρήστες.");
define("MSG_PASSWORDCHANGED", "Ο κωδικός πρόσβασης έχει αλλάξει.");
define("MSG_SHAREKEYSNONE", "κλειδιά κοινής χρήσης: κανένα");
define("MSG_SHARESNONE", "κοινές χρήσεις: καμία");
define("MSG_SPACESNONE", "χώροι: κανένας");

// messages with placeholders / fragments
define("MSG_ACTIVEKEYS", "ενεργά κλειδιά");
define("MSG_ACTIVESHARES", "ενεργά μερίδια");
define("MSG_ALIASGRANTED", "%%ALIAS%% παραχωρήθηκε.");
define("MSG_ALIASISNOW", "Το ψευδώνυμο είναι τώρα '%%ALIAS%%'.");
define("MSG_ALIASREINSTATED", "%%ALIAS%% αποκαταστάθηκε.");
define("MSG_ALIASREVOKED", "%%ALIAS%% ανακλήθηκε.");
define("MSG_CURRENTDEVICE", "τρέχουσα συσκευή");
define("MSG_DEVICEKEYS", "κλειδιά συσκευής: ");
define("MSG_DIRECTORYOF", "Κατάλογος του ");
define("MSG_LISTOFADMINS", "Λίστα διαχειριστών:");
define("MSG_LISTOFUSERS", "Λίστα χρηστών:");
define("MSG_LOGGEDINAS", "Είστε συνδεδεμένος ως '%%USERNAME%%'.");
define("MSG_NEWKEYCREATED", "Νέο κλειδί '%%NEWKEY%%' (%%ALIAS%%) δημιουργήθηκε.");
define("MSG_OFFLINE", "Είστε τώρα εκτός σύνδεσης.");
define("MSG_ONLINE", "Είστε τώρα συνδεδεμένος.");
define("MSG_REGISTRATION", "Ο χρήστης '%%USERNAME%%' εγγράφηκε, παρακαλώ σημειώστε τις παρακάτω πληροφορίες και μην μοιράζεστε το όνομα χρήστη και τον κωδικό σας με άλλους χρήστες.\nόνομα χρήστη: %%USERNAME%%\nκωδικός: %%PASSWORD%%\nψευδώνυμο: %%ALIAS%%\nκλειδί χρήστη:  %%USERKEY%%");
define("MSG_SHARES", "μερίδια:");
define("MSG_SPACENAMEISNOW", "Ο χώρος είναι τώρα %%SPACENAME%%.");
define("MSG_SPACES", "χώροι:");
define("MSG_USERNAMEISNOW", "Το όνομα χρήστη είναι τώρα '%%USERNAME%%'.");

// errors
define("ERR_DEVICEKEYINVALID", "Μη έγκυρο κλειδί συσκευής.");
define("ERR_GRANTEXISTS", "Η άδεια υπάρχει ήδη.");
define("ERR_FILEEXISTS_DESTINATION", "Το αρχείο προορισμού υπάρχει ήδη.");
define("ERR_FILENOTEXISTS", "Το αρχείο δεν βρέθηκε.");
define("ERR_FILENOTEXISTS_HELP", "Η βοήθεια δεν είναι διαθέσιμη.");
define("ERR_FILENOTEXISTS_SOURCE", "Το αρχείο προέλευσης δεν υπάρχει.");
define("ERR_LOGININVALID", "Μη έγκυρη σύνδεση ή κωδικός.");
define("ERR_LOGINNOTCURRENT", "Δεν είστε συνδεδεμένος αυτή τη στιγμή.");
define("ERR_JSONINVALID", "Μη έγκυρο JSON.");
define("ERR_NOTYETIMPLEMENTED", "Δεν έχει υλοποιηθεί ακόμη.");
define("ERR_PARAMETERSMISSING", "Λείπουν παράμετροι.");
define("ERR_PASSWORDINVALIDNEW", "Μη έγκυρος νέος κωδικός. Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.");
define("ERR_PASSWORDINVALIDPREVIOUS", "Μη έγκυρος προηγούμενος κωδικός.");
define("ERR_REGISTRATION", "Σφάλμα εγγραφής.");
define("ERR_SHAREKEYINVALID", "Μη έγκυρο κλειδί κοινής χρήσης.");
define("ERR_SPACEKEYINVALID", "Μη έγκυρο κλειδί χώρου.");
define("ERR_SYSTEMGENERAL", "Γενικό σφάλμα συστήματος.");
define("ERR_SYSTEMJSON", "Σφάλμα αρχείου συστήματος.");
define("ERR_USERNAMEUNAVAILABLE", "Το όνομα χρήστη δεν είναι διαθέσιμο.");

// errors with placeholders / fragments
define("ERR_COMMANDNOTDEFINED", "%%COMMAND%% δεν είναι καθορισμένο.");

?>
