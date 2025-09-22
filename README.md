# CyborgShell - JavaScript Development Environment

Welcome to CyborgShell!

RELEASE CANDIDATE 9

- You can now drag files onto the editor from your computer. 
- Listing files will now show any dirty files.
- 'saveall' will save all named files.
- added input command, 
	e.g. api.cls();api.print('enter your name:');api.input(function(str_a) { api.print('hello ' + str_a);api.stop(); });
- resolved xbox one browser's autocapitalisation issues by using email instead of text input types.

RELEASE CANDIDATE 7

- added support for the following human languages: arabic, chinese (simplified), chinese (traditional), czech, dutch, english, french, german, greek, hebrew, hindi, italian, japanese, javanese, klingon, korean, persian, polish, portuguese, romanian, russian, spanish, swahili, swedish, tagalog, thai, turkish, vietnamese
- added multiple file support within the editor, API now has load and save functions - but I haven't updated the documentation for the API yet, not sure how I want to document the API yet.
- added saveall command and ability to drag one or more files into the editor from your PC.

CyborgShell brings the retro charm of home computers to modern devices, allowing you to create, code, and collaborate anywhere, anytime. With CyborgShell, you can:

- Create an account and login on multiple devices
- Code in JavaScript, alone or in teams, on your PC, your phone or your XBox One
- Store your programs in personalized "spaces"
- Let AI Agents join your team and work with you - not just coding btw.

Inspired by the simplicity of 8-bit home computers, CyborgShell aims to recreate the instant-on, fuss-free experience of classic computing. Register, login, and start coding in seconds!

In CyborgShell, your "space" is your own private storage area, accessible only to you. You can also explore the public space, where you can create, share, and experiment with others.

Sharing is a key feature in CyborgShell. Just like swapping floppy disks in the 80s, you can share your space with others, and vice versa. This simple sharing model enables various scenarios:

- Teaching: Share spaces with students for guided learning
- Teamwork: Collaborate on projects in shared team spaces
- Friendship: Mutually share spaces with trusted friends

A live Environment based on CyborgShell is located at http://cyborgshell.com/.

License

CyborgShell is released under the MIT software license, because "sharing is caring."

Contact PrimalNinja if would like to consider other licensing options.

About Us

CyborgShell is Proudly Developed by the PrimalNinja of Cyborg Unicorn Pty Ltd.

Instructions and Deployment

Read the instructions in the help folder.

To deploy, simply place the lot into your web root folder if the World doesn't have access to it.  If you do want to host it for the World, then move the help, home, public and users folders outside of the webroot somewhere it is not accessible and edit the $strDataRoot within inc-env.php.

If you need to update the About, Terms & Conditions, Privacy and Etiquitte help files, do so also.