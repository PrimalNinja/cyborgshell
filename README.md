# CyborgShell - JavaScript Development Environment

Welcome to CyborgShell!

RELEASE CANDIDATE 11

Latest Release Notes.

New Features 18th Aug 2025:

- Transformers that use services can now be configured within csconfig to run in parallel or sequential mode.  This is to satisfy some providers usage limits. Hopefully we don't have to artificially slow the system down more.  So providers that require sequential can be sequential, ones that are ok with parallel can be also, they can be mixed and matched.

- New mandatory first parameter for chatgpt and translate transformers which is the provider. This allows multiple providers to be easily used within an orchestration. If you want to use the configured one, then a placeholder parameter %PROVIDER% can be used.  Note: documentation below is updated to reflect this new parameter.

- Session selection is also added to provider chatgpt on commandlines similar to interactive mode.

	e.g.
	
		link 2 1 chatgpt %PROVIDER% all provided text is a prompt
		link 2 1 chatgpt openai all provided text is a prompt
		link 2 1 chatgpt %PROVIDER% maths: all provided text is a prompt
		link 2 1 chatgpt openai maths: all provided text is a prompt

New Features 29th July 2025:

- The ability to link a transformer to the file drop event.  This allows you to drag files onto the main window and transform 
  them all in a single go. If no drop event is linked then a standard drop new files is there without overwriting what you
  are working on. If a drop event is linked, then a project is automatically setup for the dropped files and run.
  
  To setup a drop event.  link drop <transformer> [<args>]
  
	Use Cases:

		link drop ocr
		link drop chatgpt %PROVIDER% analyse the code and list any bugs or security holes you find, mention the file at the top and function before each bug
		link drop chatgpt %PROVIDER% analyse and document the functions as comments before the functions
		
		btw, don't forget the files dropped all are dirty so afterwards you can save them with the saveall command.

- New transformers:

	speak.xfrm:			arguments: e.g. accent:en-us or accent:en-au
	
		use cases:
		
		link 2 1 translate %PROVIDER% japanese
		link 3 1 speak accent:ja-jp
		
			then type some of your native language into file 1, and you now have a really good translator!
	
New Features 28th July 2025:

- New public demo space, some files that were in the public area have moved to here.

New Features 27th July 2025:

- Provided a new csconfig utility for configuration of handlers, providers and services in particular for AI.
- New transformers:

	ocr.xfrm:			ocr transformer for PDFs and Images
	blocker.xfrm:		if there is no input, return nothing
	passthrough.xfrm:	returns all input


New Features 26th July 2025:

- You can now save your AI API Keys to your local storage on devices where local storage is available.

	config save <identifier> <value>, e.g. 
	
		to configure some AI providers
		
			config save openai-apikey <APIKEY>
			config save openai-endpoint https://api.openai.com/v1/chat/completions
			config save openai-model gpt-4o-mini

			config save ollama-endpoint http://localhost:11434/v1/chat/completions
			config save ollama-model llama3.2:latest

		to select which AI providers to use:
		
			config save chatgpt-provider ollama			// chatgpt transformer uses ollama config
			config save translate-provider ollama		// translate transformer uses ollama config
			config save ai-provider ollama				// ai-provider (the interactive one) uses ollama config
			
			config save ai-handler chatgpt				// this is the interactive js to use chatgpt.js, it uses the ai-provider

		note: you don't need to hardcode API Keys in the JS, it will use what's in your local storage. Take care
			  that you only run trusted programs though that do NOT steal your API Keys.
			  
			  note: prompting for permissions is coming soon, but if you are coding your own transformers or such 
					in your own space, then it's unlikely you will have issues.

	config delete <identifier> to delete your previously saved config option. e.g. to delete your chatgpt API Key,
			config delete chatgpt will do that.

- You can now cd to the new 'local' space with cd local. You can dir it also. For now file functionality is limited
  but you can see your configuration files there.  cd back to home or public or another space to do something useful.

- If you setup an ai-handler, you can use the ! AI prefix within Cyborg Shell. e.g. !what is the meaning of life?
  Simply entering ! by itself if configured with the provided chatgpt.js will display some help for managing chatgpt
  sessions. You can use multiple sessions, load and save them, clear them etc. This allows you to create sessions of 
  knowledge up to a point, save them and restore them as required. Sessions info is saved in your currently selected
  space when you save them.

New Features 25th July 2025:

- To run a js file, simply type the filename. i.e. to run bm.js, simply type 'bm'.
- Transient programs are now loaded into file space 0 so they don't corrupt user editing.
- Commandline history is now implemented allowing for up and down arrows to navigate.
- You can now code transformers so that linked files can be transformed dynamically in realtime.
- Your transformers are loaded as files so you can develop them as per every other file.
- You can now save your current files and links as a project and load a project to restore the files and links.
- If you setup chatgpt.js, you can use chatgpt within Cyborg Shell. e.g. chatgpt give me a random number

- 3 AI transformers provided chatgpt.xfrm, translate.xfrm, null.xfrm

	The AI transformers require an API Key to be useful. You should NOT put any transformers in here on our servers
	if you are putting your own API Keys directly into the code. Better you fetch it from local storage as per these transformers.
	
	You can install ollama locally and modify your copy of transformers to use your own ollama which is also free and
	you control your own local security.  
	
	Also you can use these transformers as a guide to how you may like to create your own.
	
	chatgpt.xfrm:  		this plugin has some commands within: in addition to supporting arguments which become part of a prompt
	============
	
	AI IGNORE - if you place AI IGNORE at the start of the file, AI will not be called while it is there.
	This allows you to have AI IGNORE there while you create your prompts, and then either remove it or slightly modify it
	to trigger the AI to proceed.
	
	The chatgpt plugin has session logic to remember your training data for prompts. You can create and manage different
	knowledge blocks with sessions.
	
	AI SESSION CLEAR - will clear all AI session memory stored on in your browser
	
	AI SESSION CLEAR <sessionname>, e.g. AI SESSION CLEAR database will clear only the database session.
	
	AI SESSION START <sessionname> - start of a session block, multiple blocks can share the same session name to build up knowledge.
	AI SESSION END <sessionname> - end of a session block, multiple blocks can share the same session name to build up knowledge.
	
	AI PROMPT <sessionname> <prompt> - you can place as many AI PROMPT / AI PROMPT END blocks within your file as you like and each will make 
	separate AI calls and substitute the AI PROMPT block with the response.  Prompts may be embedded within session blocks.
	
	AI PROMPT END <sessionname> - indicates the end of the prompt.
	
	null.xfrm:			don't return anything
	=========
	
	translate.xfrm:		if there is any input, transform it, if there is no input, return no output.   It takes the language you want to translate to as an argument.
	===============

- New/Enhanced commands below:

	file <filenumber>, will now create new files up to the specified filenumber if not already
	linkto <sourcefilenumber> <plugin> <arguments>, will now create new files up to the specified filenumber if not already. arguments will be passed to the plugin so you can use the same plugin for different purposes.
	link <targetfilenumber> <sourcefilenumber> <plugin> <arguments>, e.g. link 4 2 null will link a null transformer plugin on file 4 to file 2
	newfile [<filename>], you can now create a new file but go to the file specified without having to go to the new file
	touch <filenumber>, e.g. touch 1 to manually cause all transformers linked to file 1 and cascaded ones to process
	project <projectname>, e.g. project test
	project load <projectname>, e.g. project load test
	project save <projectname>, e.g. project save test
	linkto <filenumber> <transformername>, e.g. linkto 1, chatgpt

	type ai-example1.txt or type ai-example2.txt for examples of transformer chains.
	
New Features 16th June 2025:

- You can now login with login yourusername [press enter], then have the password not visible when typing it in.

New Features 15th June 2025:

- Some support for Mime Types.
- Text and non-Text Mime Types can be listed and edited.
- Images and PDF can be OCRd, type 'ocr' after loaded by dragging (for now). New files will be created with any OCRd text.
- OCR currently is a separate module, but is going to evolve into a plugin facility.

New Features 9th March 2025:

- Files can now be dragged onto the editor from your computer. 
- You can now paste text into the line editor. Files with line numbers on the first line preserve the numbers without are autonumbered.
- Listing files will now show which files are dirty (with a D).
- 'saveall' will save all named files.

Programming API:

- added input command, 
	e.g. api.cls(); api.print('enter your name:'); api.input("", function(str_a) { api.print('hello ' + str_a); api.stop(); });

Julian
