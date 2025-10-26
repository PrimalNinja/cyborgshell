# CyborgShell Quick Reference

## Philosophy

**80s BASIC immediate/program mode, but JavaScript**

```javascript
api.print("hello");              // Immediate - runs now
10 api.print("hello");           // Program - stored, run with 'run'
```

## Architecture & Security

**Browser-First, Privacy-Focused**
- ✅ Code runs in your browser (client-side)
- ✅ API keys in local storage (never on servers)
- ✅ Direct API calls to providers
- ✅ Self-hostable (MIT): https://github.com/PrimalNinja/cyborgshell
- ✅ Complete air-gap possible (self-host + Ollama)

## Execution Modes

### Immediate Mode (No Line Numbers)
```bash
for(let i=0; i<5; i++) api.print(i);    # Executes immediately
cls; dir; run                            # Chain commands with ;
```

### Program Mode (With Line Numbers)
```bash
10 for(let i=0; i<5; i++) api.print(i); # Stored in editor
20 api.cls();
run                                      # Execute program
list                                     # View program
save mycode                              # Save to cloud
```

## Command Aliases

| Action | Locomotive | Unix | Windows | Amiga |
|--------|-----------|------|---------|-------|
| List | `cat` | `ls` | `dir` | `dir` |
| Delete | `era` | `rm` | `del` | `delete` |
| Rename | - | `mv` | `ren` | `rename` |
| Copy | - | `cp` | `copy` | `copy` |

## AI Features

### Quick AI Access
```bash
!what is the capital of France?
!how do I sort an array in JS?
```

### ChatGPT Command
```bash
chatgpt hello                           # Basic query
chatgpt remember the number 42          # Build context
chatgpt what number did I remember?     # Recall context
```

### Named Sessions
```bash
chatgpt math: solve 2+2                 # Session "math"
chatgpt story: write about robots       # Session "story"
math: multiply by 5                     # Shorthand
story: continue                         # Shorthand
```

### Session Management
```bash
chatgpt sessions                        # List all sessions
chatgpt save math                       # Save session for later
chatgpt load math                       # Load saved session
chatgpt clear                           # Clear default session
chatgpt clear math                      # Clear named session
```

### Multi-AI Services
```bash
chatgpt services                        # List: claude, gemini, openai, ollama
chatgpt service openai                  # Switch to OpenAI
chatgpt service claude                  # Switch to Claude
chatgpt service                         # Show current service
```

### Multi-AI Collaboration
```bash
# ✅ Use named sessions when switching services
analysis: openai analyze this algorithm
analysis: claude now document it beautifully
analysis: gemini translate docs to Japanese
chatgpt save analysis-workflow

# ⚠️ Avoid: switching services in same session (context contamination)
```

### Interactive Mode
```bash
chatgpt                                 # Enter interactive mode
# Now omit 'chatgpt' prefix
remember my name is Julian
what's my name?
x                                       # Exit
```

### Configuration
```bash
csconfig                                # Open configurator
# Options:
# 1. Autorun program
# 2. Configure handler (ai, rpggpt)
# 3. Configure provider (chatgpt → service mapping)
# 4. View service details
# 5. Add/update service (API keys, endpoints)
# 6. Delete service
# B. Backup, D. Deploy
```

### Local AI (Ollama)
```bash
# Configure in csconfig
endpoint: http://localhost:11434/v1/chat/completions
model: llama3.2:latest

# Use for private data, zero cost
chatgpt service ollama
chatgpt analyze this confidential data
```

### RPG Game
```bash
rpggpt                                  # Start interactive fiction
# Session saved as character name
```

## Project Setup

### Always Start Here
```bash
file 10              # Creates files 1-10, goes to file 10
file 1               # Return to file 1
```

**Why?** Transformers auto-load from file 11+. This gives you 10 working files.

## File Management

```bash
file N               # Create N files, go to file N
file X               # Switch to file X
files                # List all files with details
filename name.ext    # Name current file
newfile              # Create one new file
list                 # Show current file
list 10-20           # Show lines 10-20
edit 10              # Edit line 10
```

## Linking (Create Pipelines)

```bash
# Single input
link TARGET SOURCE transformer args
link 2 1 passthrough
link 2 1 chatgpt openai process this

# Multi-input (CRITICAL: NO SPACES between numbers!)
link 3 1,2 chatgpt openai combine       # ✅ Correct: 1,2
link 5 2,3,4 csvmerge no-headers        # ✅ Correct: 2,3,4
link 3 1, 2 chatgpt                     # ❌ WRONG: spaces fail!

# Drop events (batch processing)
link drop ocr                           # Drag files → auto OCR
```

## Project Management

```bash
project save name    # Saves as name.prj (automatic extension)
project load name    # Loads name.prj
project name "Title" # Set display name
```

## Dirty Flags & Saving

```bash
files                # Shows D flag for processed files
saveall              # Save all dirty files at once
```

**Workflow:**
1. Name files: `filename report.txt`
2. Create links and run pipeline
3. Check: `files` (see D flags)
4. Save results: `saveall`

## Transformers

### Data Processing
```bash
link 2 1 passthrough                    # Direct copy
link 2 1 null                           # Discard
link 3 1,2 filejoin                     # Join (default: newline)
link 3 1,2 filejoin ---SEP---           # Custom separator
link 4 1,2,3 csvmerge                   # Merge CSVs (keep headers)
link 4 1,2,3 csvmerge no-headers        # Skip duplicate headers
link 3 1,2 jsonmerge                    # Merge JSON objects
```

### Analysis
```bash
link 2 1 filestats                      # File statistics
link 3 1,2 filediff                     # Line-by-line diff
```

### AI
```bash
link 2 1 chatgpt openai translate to Spanish
link 2 1 chatgpt claude analyze code
link 2 1 chatgpt gemini summarize
link 2 1 chatgpt %PROVIDER% use default

# With sessions (context across links)
link 2 1 chatgpt openai session:calc mean
link 3 2 chatgpt openai session:calc standard deviation

link 2 1 translate Japanese             # Translate
link 2 1 blocker                        # Stop if empty
```

### Output
```bash
link 2 1 speak accent:en-us
link 2 1 speak accent:ja-jp
link 3 1,2 template                     # Template + JSON data
```

## Common Patterns

### Simple Pipeline (A → B → C)
```bash
file 3; file 1
filename input.txt
file 2; filename processed.txt
file 3; filename output.txt

file 2; link 1 2 chatgpt openai process this
file 3; link 2 3 translate Japanese

project save simple-pipeline
```

### Fan-Out (1 → Many)
```bash
file 5; file 1
filename source.txt
file 2; filename output1.txt
file 3; filename output2.txt
file 4; filename output3.txt
file 5; filename output4.txt

file 2; link 1 2 translate Japanese
file 3; link 1 3 translate Chinese
file 4; link 1 4 translate Spanish
file 5; link 1 5 chatgpt openai summarize

project save fan-out
```

### Fan-In (Many → 1)
```bash
file 5; file 1
filename data1.csv
file 2; filename data2.csv
file 3; filename data3.csv
file 4; filename merged.csv
file 5; filename analysis.txt

file 4; link 1,2,3 4 csvmerge
file 5; link 4 5 chatgpt openai analyze

project save fan-in
```

### Quality Gate
```bash
file 5; file 1
filename content.txt
file 2; filename analysis.txt
file 3; filename gate.txt
file 4; filename approved.txt
file 5; filename final.txt

file 2; link 1 2 chatgpt openai rate quality 1-10
file 3; link 2 3 chatgpt openai if score >= 8 output YES else NO or STOP
file 4; link 3 4 blocker
file 5; link 4 5 chatgpt openai polish

project save quality-gate
```

### Multi-AI Workflow
```bash
file 4; file 1
filename code.js
file 2; filename analysis.txt
file 3; filename docs.txt
file 4; filename final.md

file 2; link 1 2 chatgpt openai analyze bugs
file 3; link 1 3 chatgpt claude document clearly
file 4; link 2,3 4 chatgpt gemini create report

project save multi-ai
```

## Workflow Examples

### AI Coder (2 minutes)
```bash
file 3
file 1; filename coder.js
file 2; filename coderai.js
file 3; filename backup.js

file 2; link 1 2 chatgpt %PROVIDER% process prompts starting with #
file 1; link 2 1 passthrough
file 3; link 1 3 passthrough

project save aicoder

file 1; edit 10
10 # make a fibonacci function
run
```

### Translation Hub (2 minutes)
```bash
file 6
file 1; filename brief.txt
file 2; filename story.txt
file 3; filename japanese.txt
file 4; filename chinese.txt
file 5; filename spanish.txt
file 6; filename audio.txt

file 2; link 1 2 chatgpt openai write short story
file 3; link 2 3 translate Japanese
file 4; link 2 4 translate Chinese
file 5; link 2 5 translate Spanish
file 6; link 3 6 speak accent:ja-jp

project save translation-hub

file 1; edit 10
10 # Story about robot learning emotions
```

### Code Reviewer (3 minutes)
```bash
file 4
file 1; filename code.js
file 2; filename review.txt
file 3; filename tests.js
file 4; filename report.md

file 2; link 1 2 chatgpt openai analyze bugs and improvements
file 3; link 1 3 chatgpt openai generate unit tests
file 4; link 2,3 4 chatgpt openai comprehensive report

project save code-review
```

## Debugging

### File Not Updating?
- Check `ln` index (1-based!)
- Verify source is dirty (modified)
- Ensure transformer loaded

### Multi-Input Not Working?
- ALL sources must be dirty
- Use `[1,2,3]` with NO SPACES
- Check transformer supports multi-input

### AI Confused?
```bash
chatgpt clear                           # Clear session
newsession: fresh context               # New session
```

### Service Switch Issues?
```bash
# Use named sessions when switching
o: openai task
c: claude task
g: gemini task
```

## Tips

1. **Line numbers = stored**, no line numbers = immediate
2. **Use named sessions** for different tasks/services
3. **Save session templates** for reusable workflows
4. **Multi-AI collaboration**: each AI for its strengths
5. **Local AI (Ollama)** for private data
6. **%PROVIDER%** makes projects portable
7. **Multi-input = AND gate**: all sources must be dirty
8. **Blocker = quality gate**: stops if empty
9. **saveall** after processing: one command saves all
10. **Cross-platform**: phone, Xbox, PC - same experience

## Remember

- Files are 1-indexed (file 1, not 0)
- **Commas: NO SPACES! `1,2,3` not `1, 2, 3`** ⚠️
- Extensions automatic: `save name` not `name.prj`
- Transformers auto-load from file 11+
- Sessions persist across devices (cloud storage)
- Edit source to trigger cascade
- Works anywhere: phone/Xbox/PC/tablet

## Quick Start

```bash
# Test immediate mode
api.print("Hello from " + navigator.platform);

# Save as program
10 api.print("Hello World");
save hello
run

# AI query
!explain quantum computing simply

# Create pipeline
file 3
file 1; filename input.txt
file 2; filename output.txt
file 2; link 1 2 chatgpt openai improve this
project save pipeline

# Multi-AI workflow
chatgpt analysis: openai analyze this
analysis: claude document it
analysis: gemini translate to Japanese
chatgpt save analysis-flow
```

Happy coding! 🚀

**Yellow on Blue - Amstrad style, JavaScript power, AI native, runs everywhere.**