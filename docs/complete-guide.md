# CyborgShell Complete Guide

## What is CyborgShell?

**CyborgShell: AI-Agent-First command-line experience complete with full multi-file JavaScript development environment, cloud storage, and AI transformers.**

Instant On! Zero Friction! Instant Productivity!

CyborgShell enables humans, AI-Agents such as manus.im to navigate to cyborgshell.com, read the online help, and collaborate on tasks without getting a degree in computer science.

CyborgShell brings back the beloved immediate/program mode interaction from 1980s computing but powered by modern JavaScript, cloud storage, AI capabilities, and running on any device with a browser.

Simple enough for children to use and AI-Agents alike.

CyborgShell is command-line based, but it does allow you to develop any type of application that you may conceive from AI orchestrations, to business software to full-blown GUI environments.

### Architecture: Browser-First, Privacy-Focused

**CyborgShell is a browser-based AI platform.** Unlike traditional cloud AI tools, CyborgShell runs primarily in your browser with minimal server-side components:

#### What Runs Where
- **Browser (Client-Side)**: All code execution, AI API calls, project processing, transformer pipelines
- **Server (Minimal)**: File operations only (load, save, directory listings)

#### Security & Privacy Benefits

**Your API Keys Stay Local**
```
Service details for: claude
apikey: YOUR APIKEY (stored in your local storage*, not the servers)
endpoint: https://api.anthropic.com/v1/messages
model: claude-3-5-sonnet-20241022

* be careful if you deploy your config on a public computer
```

✅ API keys stored in **browser local storage**  
✅ Keys **never sent to CyborgShell servers**  
✅ You control which AI services to use  
✅ Direct API calls from your browser to AI providers  

#### Self-Hosting & Complete Privacy

**Open Source (MIT License)**
- Download from: https://github.com/PrimalNinja/cyborgshell
- Host internally within your home or organization
- Complete control over the entire stack
- No external dependencies required

**Complete Air-Gap Mode**
```bash
# Self-hosted CyborgShell + Ollama
1. Host CyborgShell on internal network
2. Run Ollama locally
3. Configure: endpoint: http://localhost:11434/v1/chat/completions
4. Result: Zero data leaves your network
```

✅ **No internet required** for local AI  
✅ **Zero data exfiltration** - all processing internal  
✅ **Complete organizational security**  
✅ **HIPAA/SOC2/Compliance-friendly**  

#### Proxy for CORS & Bearer Tokens

Some AI providers require special handling:

```
proxy: proxy/index.php?url=
jsonbearer: Y
```

**Why?** Browser security (CORS) prevents direct API calls to some services. The optional proxy:
- Handles CORS headers
- Manages bearer token formatting (some APIs require tokens in JSON body, not headers)
- Logging disabled by default (LOG_OUTPUT = 'FALSE')
- ~200 lines of auditable PHP code
- Included in GitHub repository for complete auditability

**What the Proxy Does:**
- ✅ Extracts bearer token from JSON body
- ✅ Removes it from the payload
- ✅ Adds proper Authorization: Bearer header
- ✅ Forwards request to AI provider
- ✅ Returns response unchanged

**What the Proxy Does NOT Do:**
- ❌ Store API keys (passed through only)
- ❌ Retain any data (logging disabled by default)
- ❌ Execute code from requests
- ❌ Modify prompts or responses
- ❌ Make outbound calls without explicit request

**Providers needing proxy**: Claude, Gemini, OpenAI (depending on configuration)  
**Providers working direct**: Ollama (local), self-hosted models

**Important Note:** Any proxy sees data in transit—that's how proxies work. The critical questions are:
1. **What does it do with the data?** (This one: passes through, doesn't store)
2. **Can you verify that?** (Yes: ~200 lines of open source PHP)
3. **Can you trust it?** (Self-host = you control it completely)

**If proxy visibility matters to you:** Self-host CyborgShell. Then you control the entire infrastructure.  
**If you don't want any proxy:** Use Ollama. Zero external calls, zero proxy needed.

### The Heritage (based on the 80s BASIC experience, instant on with zero friction)

- **UX Model**: Command-line based immediate/program mode and optional self-developed GUIs
- **Commands**: based on Unix/Windows/Amiga/CPM tropes
- **Colors**: Classic colours
- **Language**: Full Modern JavaScript immediately runnable
- **Architecture**: Browser-first with optional self-hosting
- **AI**: Native transformer integration with YOUR choice of providers
- **Platform**: Phone, tablet, Xbox One, PC, Mac, Chromebook - anywhere
- **Security**: Client-side execution, local API keys, self-hostable
- **Philosophy**: No barriers between you and computing

## Getting Started

### Two Execution Modes

CyborgShell operates exactly like 80s BASIC with two distinct modes:

#### Immediate Mode (No Line Numbers)
Commands execute instantly, like a REPL:

```javascript
// Type and execute immediately
api.print("Hello World");
for(let i=0; i<5; i++) api.print(i);
cls
dir
```

#### Program Mode (With Line Numbers)
Lines are stored in the editor and can be saved:

```javascript
// Store in editor
10 api.print("Hello World");
20 for(let i=0; i<5; i++) {
30     api.print(i);
40 }

// Then execute
run
list
save myprogram
```

**Key Rule: Line numbers = stored program, no line numbers = immediate execution**

### The API Object

When writing JavaScript code, use the `api` object for shell operations:

```javascript
api.cls();              // Clear screen (programmatic)
api.print("text");      // Output text
// More methods available
```

Shell commands work in immediate mode without the api prefix:

```bash
cls                     # Clear screen (interactive)
dir                     # List files
file 1                  # Switch to file 1
run                     # Execute program
```

### Command Aliases (Multi-Platform Friendly)

CyborgShell supports commands from multiple classic systems:

| Action | Locomotive BASIC | Unix | Windows | Amiga |
|--------|-----------------|------|---------|-------|
| List files | `cat` | `ls` | `dir` | `dir` |
| Copy | - | `cp` | `copy` | `copy` |
| Delete | `era` | `rm` | `del` | `delete` |
| Rename | - | `mv` | `ren` | `rename` |

Use whatever feels natural - they all work!

### Basic Workflow

```javascript
// Quick test (immediate mode)
for(let i=0; i<3; i++) api.print(i);

// Looks good, save it (program mode)
10 for(let i=0; i<3; i++)
20 {
30   api.print(i);
40 }
run
save test.js

// Load and run later
load test.js
run

or simply type 'test'

// Edit a line
edit 10
10 for(let i=0; i<10; i++)  // change 10 to 20, then press enter
run
```

### Cross-Platform Reality

**Same experience everywhere:**

```javascript
// On your phone at lunch
10 api.print("coded at restaurant");
20 // more code...
save restaurant-app.js

// On Xbox One at home
load restaurant-app.js
run
// Continue coding with controller

// On work PC next day
load restaurant-app.js
// Same code, same environment
```

No installation, no setup, no environment configuration. Just go to cyborgshell.com and code.

**Note on Cloud Storage:** By default CyborgShell has a concept of a public area for those who don't want to login or register. This allows you to quickly use file storage for quick tests—everyone shares this same public space so be considerate. If you register, you'll gain your own private space and the ability to share with others. The benefits of logging in on your own devices is frictionless movement between devices - your space is always there waiting.

## AI Features

CyborgShell has native AI integration with multiple providers and sophisticated session management.

### The `!` Shorthand

Quick AI queries without typing `chatgpt`:

```bash
!what is the capital of Australia?
!how do I sort an array in JavaScript?
!explain quantum computing in simple terms
```

### Interactive Mode

For extended conversations, enter interactive mode:

```bash
chatgpt or simply !
# Now in interactive mode
# Can omit 'chatgpt' prefix
remember my name is Julian
what's my name?
x    # Exit interactive mode
```

### Multiple AI Services

Configure and switch between different AI providers:

```bash
# View available services (with configured endpoints)
chatgpt
services
# Shows: claude, gemini, ollama, openai

# Switch service
chatgpt
service gemini
chatgpt
service claude
chatgpt
service openai

# Check current service
chatgpt
service
# Shows: Provider: openai, Endpoint: ..., Model: gpt-4
```

### ChatGPT Command

Full AI interface with session support:

```bash
chatgpt 
remember the number 42
what number did I tell you to remember?
```

### Named Sessions

Create separate conversation contexts:

```bash
# Session "math" for calculations
chatgpt 
math: solve 2+2
math: what is the square root of that?

# Session "story" for creative writing
chatgpt 
story: write about a robot
story: continue the story

# Shorthand (omit "chatgpt")
!math: multiply by 5
!story: make it dramatic
```

### Session Management

```bash
# View active sessions
chatgpt
sessions
# Shows: math (4 entries, 1 KB), story (6 entries, 2 KB)

# Save sessions for later
chatgpt
save math
save story

# Load on different device or later
chatgpt
load math
math: continue calculation

# Clear a session
chatgpt
clear math

# Clear default session
chatgpt
clear
```

### Multi-AI Collaboration

**Critical Best Practice**: When switching services, use named sessions to avoid context contamination:

```bash
# ❌ Don't: Switch services in same session
chatgpt
how are you?           			# OpenAI responds
service gemini
how are you?           			# Gemini may adopt OpenAI's identity from context!

# ✅ Do: Use named sessions when switching
chatgpt 
openai-chat: how are you?
service gemini
gemini-chat: how are you?    # Clean context

# ✅ Or: Use new session names for different services
service openai
o: analyze this code
service claude  
c: now document it
service gemini
g: translate to Japanese
```

### Multi-AI Workflow Patterns

Leverage each AI's strengths on the same task:

#### Code Review Workflow
```bash
# OpenAI for technical analysis
review: openai analyze this C# code for bugs

# Claude for documentation
review: claude write clear documentation for this

# Gemini for translation
review: gemini translate docs to Spanish

# Save the workflow
chatgpt
save code-review-workflow
```

#### Content Creation Pipeline
```bash
article: gemini research and outline "AI in healthcare"
article: openai write detailed content from outline  
article: claude polish and improve clarity
chatgpt
save article-pipeline
```

#### Data Analysis (with local AI)
```bash
# Use Ollama locally for private data
data: ollama analyze this confidential financial data
# Then use cloud AI for suggestions
data: openai suggest investment strategies based on analysis
data: claude write the client report
chatgpt
save analysis-workflow
```

#### Load and Reuse Templates
```bash
# Later, on any project:
chatgpt
load code-review-workflow
review: [paste new code]          # Full context and workflow restored!
```

### Configuration (csconfig)

Configure AI providers and system settings:

```bash
csconfig

# Options:
# 1. Configure an autorun program
# 2. Configure a handler  
# 3. Configure a provider
# 4. View service details
# 5. Add/update service details
# 6. Delete service details
# B. Backup configuration
# D. Deploy configuration
```

#### Configure AI Service

```bash
# Example: Configure local Ollama
csconfig
> 5
> Service name: ollama
> flavour: chatgpt
> endpoint: http://localhost:11434/v1/chat/completions
> model: llama3.2:latest
> maxtokens: 2000
> temperature: 0.7
> parallel: Y
> proxy: (leave blank for local)
> jsonbearer: N
```

#### Configure Provider

Map which service a provider uses:

```bash
csconfig
> 3
> Provider name: chatgpt
> Service: openai

# Now chatgpt transformer uses OpenAI
# Or use different service for different tasks:
# - chatgpt → openai (problem solving)
# - translate → claude (translations)
```

#### Autorun Program

Set a program to run on startup:

```bash
csconfig
> 1
> Program name: desktop
# Now 'desktop' runs every time you start CyborgShell
```

### Local AI Support

Run AI models locally with Ollama:

**Benefits:**
- ✅ Zero API costs
- ✅ Complete privacy
- ✅ Works offline
- ✅ No rate limits
- ✅ Perfect for classified/confidential data

```bash
# Install Ollama
# https://ollama.ai

# Run a model
ollama run llama3.2

# Configure in CyborgShell
csconfig > 5 > ollama
endpoint: http://localhost:11434/v1/chat/completions
model: llama3.2:latest

# Use it
chatgpt 
service ollama
analyze this private data
```

**GPU Requirements for Production:**
- Recommended: NVIDIA RTX 4090 (≈ USD $2,000 / AUD $4,000) with 24GB+ VRAM
- Minimum: Any discrete GPU (NVIDIA RTX, Apple M-series)
- CPU-only: Supported but significantly slower, not recommended for production

## Deployment Scenarios

CyborgShell's browser-first architecture enables multiple deployment strategies:

### Scenario 1: Public Cloud (cyborgshell.com)
```
User Browser → cyborgshell.com (file ops) → AI Provider APIs
                                       ↓
                                Local Storage (API keys)
```
**Use Case**: Quick start, multi-device access, cloud storage  
**Security**: API keys in browser, direct API calls to providers  
**Internet**: Required for AI providers, file sync  

### Scenario 2: Self-Hosted + Cloud AI
```
User Browser → Your Server (file ops) → Cloud AI APIs
                                   ↓
                            Local Storage (API keys)
```
**Use Case**: Corporate deployment with cloud AI  
**Security**: Full control of server, API keys stay client-side  
**Internet**: Required for AI providers only  
**Setup**: Clone from GitHub, host on internal/external server  

### Scenario 3: Self-Hosted + Local AI (Complete Privacy)
```
User Browser → Your Server (file ops) → Ollama (localhost)
              (Internal Network)     ↓
                            No Internet Required
```
**Use Case**: Maximum security, HIPAA/SOC2, air-gapped environments  
**Security**: Zero external data transmission  
**Internet**: Not required for AI operations  
**Perfect For**: Healthcare, legal, financial, classified work  

### Scenario 4: Hybrid (Best of Both)
```
User Browser → Your Server (file ops) → Ollama (private data)
                                   → OpenAI (general queries)
                                   → Claude (documentation)
```
**Use Case**: Private data stays local, leverage cloud for general tasks  
**Security**: Sensitive data never leaves network  
**Flexibility**: Choose provider per task  

### Scenario 5: Distributed Processing (Horizontal Scaling)
```
Shared Space
    ↓
PC #1 (Ollama) + PC #2 (Ollama) + PC #3 (Ollama) + ... + PC #N
    ↓
All process files in parallel, infinite loops
```

**Use Case**: Batch processing, render farms, massive throughput  
**Security**: All internal, zero external data  
**Cost**: $0 (all Ollama local)  
**Scaling**: Add more PCs = linear throughput increase  
**Coordination**: File-based (Shared Space)  

**Benefits:**
- Minimal server load (only file I/O)
- Natural load balancing (first available PC processes)
- Fault tolerant (one PC down, others continue)
- Horizontal scaling (1 to infinite workers)
- MapReduce-style AI processing with zero cost

**Example Use Cases:**
- Transform 1000 documents: 10 PCs = 100 each
- Continuous code review: Multiple PCs monitor queue
- Batch data analysis: Parallel processing of datasets
- Render farm: Generate reports, charts, visualizations

### Setting Up Self-Hosted

```bash
# 1. Download source
git clone https://github.com/PrimalNinja/cyborgshell
cd cyborgshell

# 2. Host on web server (Apache, Nginx, etc.)
# Files are static HTML/JS - no special requirements
# PHP server-side is primarily used for hosting a virtual filesystem and user-authentication

# 3. Configure AI services in browser
# Navigate to your-server.com
csconfig
# Add your API keys (stored in browser local storage)

# 4. For complete air-gap: Install Ollama
# On same machine or internal network
ollama run llama3.2
# Configure endpoint: http://localhost:11434/v1/chat/completions

# 5. Done!
# All code runs in browser
# All AI processing stays internal
```

### Enterprise Considerations

**Compliance Benefits:**
- ✅ **HIPAA**: Use Ollama locally, no PHI leaves network
- ✅ **SOC2**: Self-host, control all data flows
- ✅ **GDPR**: No user data sent to third parties
- ✅ **Classified**: Air-gapped deployment possible

**Audit Trail:**
- Server logs: File operations only
- Browser storage: User's API keys and configs
- Network traffic: Direct to AI providers (or none with Ollama)

**Backup Strategy:**
- Projects saved as JSON files
- Sessions saved in local storage
- Standard file system backup for server
- Export/import capabilities built-in

### Built-in AI Applications

#### rpggpt - Interactive Fiction

Text-based RPG with persistent story state:

```bash
rpggpt
# Enter game description
> As a deep-sea explorer, you've discovered an underwater city
# Enter character name
> Kenji

# AI generates story
> You descend into the depths...

# Play the game
explore the temple
look at the orb
take the artifact

# Session is saved as character name
chatgpt sessions
# Shows: kenji (8 entries, 15 KB)
```

## File and Project Management

### The File System

CyborgShell uses a multi-file editor with numbered files:

```bash
file 1                  # Switch to file 1
file 5                  # Create files 1-5 and go to file 5
files                   # List all files
filename mycode.js      # Name current file
newfile                 # Create one new file
```

### File Operations

```bash
list                    # Show current file
list 10-20              # Show lines 10-20
edit 10                 # Edit line 10
renum                   # Renumber program
new                     # Clear current file
run                     # Execute current file
```

### Saving and Loading

```bash
save myprogram          # Save current file
load myprogram          # Load file
dir                     # List saved programs
dir *.js                # List with wildcard
type myprogram.js       # View without loading
del myprogram           # Delete file
copy oldname newname    # Copy file
ren oldname newname     # Rename file
```

### Spaces (Directories)

```bash
space                   # Show current space
spaces                  # List all spaces
space myproject         # Change to space
```

## Project Creation

CyborgShell projects are JSON files that define transformer pipelines - directed acyclic graphs (DAGs) where files are nodes and transformers are edges.

### Mental Model

```
Files 1-10:   Your working files (inputs, outputs, data)
Files 11+:    Transformers (auto-loaded when referenced)
```

When a source file becomes "dirty" (modified), all linked transformers execute automatically in cascade.

### Setup Pattern

Always start with this:

```bash
file 10              # Creates files 1-10, goes to file 10
file 1               # Return to file 1
```

### Basic Commands

```bash
# File management
file N               # Create N files, go to file N
file X               # Switch to file X
files                # List all files with details
filename name.ext    # Name current file

# Linking (creates transformer connections)
link TARGET SOURCE transformer args
link 2 1 passthrough
link 3 1,2 chatgpt openai combine    # Multi-input: NO SPACES in "1,2"

# Project management
project save name    # Saves as name.prj
project load name    # Loads name.prj
project name "Title" # Set display name

# Saving processed files
files                # Check for D (dirty) flag
saveall              # Save all dirty files at once
```

### Simple Example: AI Coder

```bash
# Setup
file 3
file 1
filename coder.js
file 2
filename coderai.js
file 3
filename backup.js
file 1

# Create links
link 2 1 chatgpt %PROVIDER% process the file prompts start with # or // #
link 3 1 passthrough
link 1 2 passthrough

# Save project
project save aicoder

# Use it
file 1
edit 10
10 # make a fibonacci function in JS, use api.print('x'); to output, use 1 parameter for api.print
# AI processes automatically
run
# Original saved in backup.js
```

## Available Transformers

### AI Transformers
- **chatgpt.xfrm** - AI processing (args: `"service prompt"` or `"service session:id prompt"`)
  - Services: `openai`, `claude`, `gemini`, `ollama`, or `%PROVIDER%` for configured default
  - Sessions maintain context across calls
  - Scan mode: looks for `AI PROMPT START/END` blocks in source
- **translate.xfrm** - Translate text (args: target language)

### Data Processing
- **blocker.xfrm** - Stops cascade if input is empty or contains "NO" or "STOP" (quality gate)
- **null.xfrm** - Discards input, outputs nothing
- **passthrough.xfrm** - Direct copy, handles both .raw and .cd, renumbers multi-input

### File Transformers
- **csvmerge.xfrm** - Merge CSVs, skip duplicate headers (args: `no-headers`)
- **filediff.xfrm** - Line-by-line diff of two files
- **filejoin.xfrm** - Concatenate with separator (args: separator, default `%NL%`)
- **filestats.xfrm** - Statistics (size, lines, words) for single/multiple files
- **jsonmerge.xfrm** - Merge JSON objects (later sources override)
- **template.xfrm** - Template substitution using JSON dictionaries

### Other
- **speak.xfrm** - Text-to-speech (args: `accent:locale` e.g., `accent:en-au`)

## Design Patterns

### 1. Linear Pipeline
Simple A → B → C flow:
```
File 1: input.txt (ln: null)
File 2: processed.txt (ln: 1, pl: chatgpt.xfrm)
File 3: output.txt (ln: 2, pl: translate.xfrm)
```

### 2. Fan-Out (Broadcast)
One source, multiple outputs:
```
File 1: source.txt (ln: null)
File 2: english.txt (ln: 1, pl: passthrough.xfrm)
File 3: japanese.txt (ln: 1, pl: translate.xfrm, arg: "Japanese")
File 4: chinese.txt (ln: 1, pl: translate.xfrm, arg: "Chinese")
```

### 3. Fan-In (Merge)
Multiple sources, one output:
```
File 1: data1.csv (ln: null)
File 2: data2.csv (ln: null)
File 3: data3.csv (ln: null)
File 4: merged.csv (ln: "1,2,3", pl: csvmerge.xfrm)
```

### 4. Quality Gate
Conditional processing:
```
File 1: content.txt (ln: null)
File 2: analysis.txt (ln: 1, pl: chatgpt.xfrm, arg: "openai analyze quality 1-10")
File 3: gate.txt (ln: 2, pl: chatgpt.xfrm, arg: "openai if score >= 8 output YES else NO or STOP")
File 4: final.txt (ln: 3, pl: blocker.xfrm)
```

### 5. Multi-Stage Processing
Complex DAG with multiple paths:
```
File 1: input → File 2: process1 → File 5: merge
                                  ↗
File 3: input → File 4: process2 ↗
```

### 6. Backup Pattern
Preserve original while processing:
```
File 1: working.js (ln: 2, pl: passthrough.xfrm)
File 2: ai-processor.js (ln: 1, pl: chatgpt.xfrm)
File 3: backup.js (ln: 1, pl: passthrough.xfrm)
```

### Multi-Input Rules

**Critical**: Multi-input links require ALL source files to be dirty before executing:

```bash
# Create link
link 4 1,2,3 csvmerge    # NO SPACES in "1,2,3"!

# Trigger cascade - MUST edit ALL sources
file 1
edit 10
10 change1
file 2
edit 10
10 change2
file 3 
edit 10
10 change3
# NOW file 4 processes
```

### The Dirty Flag System

Files marked with "D" have been processed but not saved to disk:

```bash
files
# Output:
#   1 *D input.txt (modified)
#   2  D output.txt (processed)
#   3    backup.txt (unchanged)

saveall              # Saves ALL dirty files
```

### Workflow Tips

1. **Plan First**: Count total files needed
2. **Name as You Create**: `file 1, filename input.txt`
3. **Build Incrementally**: Test each link before adding next
4. **Save Checkpoints**: `project save myproject-v1`, `v2`, etc.
5. **Use %PROVIDER%**: Makes projects portable across AI services
6. **Use saveall**: One command saves all processed files

## Advanced Techniques

### ChatGPT Transformer Arguments

```bash
# Basic
link 2 1 chatgpt openai translate to Spanish
link 2 1 chatgpt claude analyze this code
link 2 1 chatgpt %PROVIDER% use configured default

# With sessions (maintains context)
link 2 1 chatgpt openai session:analysis calculate mean
link 3 2 chatgpt openai session:analysis what was standard deviation?
```

### Template-Driven Generation

```bash
file 3
file 1
filename template.html    # HTML with {{placeholders}}
file 2
filename data.json       # JSON dictionary
file 3
filename output.html
file 1

link 3 1,2 template

project save report-generator
```

### Multi-Stage Refinement

```bash
file 6
file 1
filename draft.txt
file 2
filename improve1.txt
file 3
filename improve2.txt
file 4
filename improve3.txt
file 5
filename final.txt
file 6
filename backup.txt
file 1

link 2 1 chatgpt openai improve clarity
link 3 2 chatgpt openai improve grammar
link 4 3 chatgpt openai improve structure
link 5 4 chatgpt openai final polish
link 6 1 passthrough    # Preserve original

project save refinement-pipeline
```

### Editing Transformers Live

You can edit transformer code and test immediately:

```bash
# Load transformer
file 11    # Transformers auto-load from file 11+
list       # View transformer code

# Edit it
edit 50
50 // modify transformer logic

# Save
save chatgpt.xfrm

# Touch input file to trigger
touch 1 // trigger
# Transformer runs with your changes!
```

## Example Projects

### Translation Hub
```bash
file 6
file 1
filename brief.txt
file 2
filename story.txt
file 3
filename japanese.txt
file 4
filename chinese.txt
file 5
filename spanish.txt
file 6
filename audio.txt
file 1

link 2 1 chatgpt openai write a short story
link 3 2 translate Japanese
link 4 2 translate Chinese
link 5 2 translate Spanish
link 6 3 speak accent:ja-jp

project save translation-hub

file 1
edit 10
10 # Write a story about a robot learning emotions
```

### Code Reviewer
```bash
file 4
file 1
filename code.js
file 2
filename review.txt
file 3
filename tests.js
file 4
filename report.md
file 1

link 2 1 chatgpt openai analyze for bugs and improvements
link 3 1 chatgpt openai generate unit tests
link 4 2,3 chatgpt openai create comprehensive review report

project save code-review
```

### Data Pipeline
```bash
file 6
file 1
filename data1.csv
file 2
filename data2.csv
file 3
filename data3.csv
file 4
filename merged.csv
file 5
filename stats.txt
file 6
filename insights.txt
file 1

link 4 1,2,3 csvmerge
link 5 4 filestats
link 6 4,5 chatgpt openai analyze the data

project save data-pipeline
```

## Tips & Tricks

### JavaScript Chaining

Since JavaScript is first-class, you can chain commands:

```bash
# Both work:
file 1
filename input.txt

# Or chain with semicolons:
filename input.txt
edit 10
10 console.log("hi");
```

### Command Combinations

```bash
# Clear screen and run
cls
run

# Switch file, list it, run it
file 2
list
run

# Quick edit pattern
file 1
edit 10
10 # improve this code
run
```

### Session Templates

Create reusable AI workflows:

```bash
# Build a perfect code review session
review: openai you are an expert code reviewer
review: focus on security, performance, and readability
review: provide specific line-by-line feedback
review: suggest improvements with examples
chatgpt save review-template

# Use on any code
chatgpt load review-template
review: [paste code here]
```

### Multi-Device Continuity

```bash
# On phone (morning commute)
project load webapp
chatgpt design: plan the user interface
chatgpt save design

# On PC (at work)
chatgpt load design
design: now implement the dashboard component
file 1
edit 10
10 # implement the design we discussed
run

# On Xbox One (evening)
chatgpt load design
design: refine the color scheme
```

## Debugging

### Links Not Working?
```bash
files                # Check file numbers (1-based!)
file 2
list         # Is target empty?
file 1
edit 10      # Make source dirty
10 test
```

### Multi-Input Not Triggering?
```bash
# ALL source files must be dirty
file 1
edit 10
10 change1
file 2
edit 10
10 change2
# Now link 3 1,2 transformer will fire
```

### AI Context Issues?
```bash
# Clear session if AI seems confused
chatgpt clear

# Or start fresh session
newsession: your prompt here
```

### Transformer Not Loading?
```bash
files                # Check it's listed
# Transformers auto-load from file 11+
# No manual loading needed
```

## Best Practices

1. **Immediate Mode for Testing**: Quick experiments without cluttering your program
2. **Use Named Sessions**: Different AI conversations for different tasks
3. **Save Session Templates**: Reusable AI workflows
4. **Multi-AI Collaboration**: Each AI for its strengths
5. **Local AI for Privacy**: Ollama for confidential data
6. **New Sessions When Switching Services**: Avoid context contamination
7. **Use %PROVIDER%**: Projects work across different AI services
8. **Comment Your Intentions**: File 1 for project notes
9. **Save Checkpoints**: Version your projects
10. **Use saveall**: One command for all processed files

## Remember

- Files are 1-indexed (file 1, not file 0)
- **Commas in links have NO SPACES: `1,2,3` not `1, 2, 3`**
- Line numbers = program mode, no line numbers = immediate mode
- Extensions are automatic: `save name` not `name.js`
- Transformers auto-load from file 11+
- Edit source to trigger cascade
- Sessions persist across service switches
- Save sessions for templates and continuity
- Works identically on phone, Xbox One, PC, tablet

## Philosophy

CyborgShell is about **removing barriers** between you and programming:

- No installation or setup
- No environment configuration  
- No platform limitations
- No context switching between tools
- No friction between idea and execution

Whether you're on your phone waiting for lunch, on your Xbox One relaxing, or on your work PC - the experience is identical. The same commands, the same projects, the same AI capabilities.

It's computing the way it should be: **immediate, accessible, universal.**

Happy coding! 🚀