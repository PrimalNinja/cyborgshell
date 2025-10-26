# CyborgShell Architecture & Security

## Overview

CyborgShell is a **browser-first AI platform** with a fundamentally different architecture than traditional cloud AI tools. This document explains how it works and why it matters for your privacy and security.

## Architecture Design

### What Runs Where

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Browser (Client)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • JavaScript Execution                               │  │
│  │  • Transformer Pipeline Processing                    │  │
│  │  • AI API Calls (direct to providers)                 │  │
│  │  • Project Management                                 │  │
│  │  • Local Storage (API keys, sessions, configs)        │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│              (File Operations Only)                          │
│                            ↕                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        CyborgShell Server (Minimal)                   │  │
│  │  • File load/save operations                          │  │
│  │  • Directory listings                                 │  │
│  │  • Optional CORS proxy                                │  │
│  │  • NO code execution                                  │  │
│  │  • NO API key storage                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
              (Direct API Calls from Browser)
                            ↕
        ┌────────────────────────────────────┐
        │     AI Provider APIs               │
        │  • OpenAI                          │
        │  • Anthropic (Claude)              │
        │  • Google (Gemini)                 │
        │  • Ollama (Local)                  │
        └────────────────────────────────────┘
```

### Key Principle: Client-Side Execution

**Your browser does all the work:**
- JavaScript code execution
- Transformer pipeline orchestration
- AI API calls (directly from browser to AI providers)
- Data processing
- Project state management

**The server only handles:**
- Loading files you request
- Saving files you create
- Listing your saved files
- Optional CORS proxy for some providers

## Security Model

### API Key Storage

```
Service details for: claude
 
flavour: claude
apikey: YOUR APIKEY (stored in your local storage*, not the servers)
endpoint: https://api.anthropic.com/v1/messages
model: claude-3-5-sonnet-20241022
parallel: Y
maxtokens: 2000
temperature: 0.7
proxy: proxy/index.php?url=
jsonbearer: Y

* be careful if you deploy your config on a public computer
```

**Your API keys are stored in browser local storage:**
- ✅ Never transmitted to CyborgShell servers *
- ✅ Never stored in CyborgShell databases
- ✅ Persist across sessions on the same browser
- ✅ Can be backed up/deployed to other machines via csconfig

* unless you use the Cyborg Shell's optional CORS proxy server

**Coming Soon: ZOSCII Information Theoretic Security (ITS) Encoding**
- Local storage will use ZOSCII

**Important**: Local storage is tied to the browser/device. If using a public computer, remember to:
1. Use private/incognito mode, OR
2. Clear your config after use: `csconfig` → Delete service details

### Data Flow

**Traditional Cloud AI Platform:**
```
User → Cloud Platform Server → AI Provider
       (stores your API keys)
       (sees all your code/data)
       (executes your code)
```

**CyborgShell:**
```
User → Your Browser → AI Provider
       (your API keys)  (direct call)
       (your code)
       (your execution)

CyborgShell Server: Only touched for file operations
```

### Why This Matters

**Privacy:**
- Your code never passes through CyborgShell servers during execution
- Your API keys never leave your browser *
- Your AI conversations go directly to the provider
- CyborgShell never sees your prompts or responses

* unless you use the Cyborg Shell's optional CORS proxy server

**Security:**
- Reduced attack surface (no server-side execution)
- No centralized API key database to compromise
- You control which AI providers to use
- Audit trail is simpler (file operations only)

**Control:**
- Switch AI providers without changing platform
- Use multiple providers simultaneously
- Control costs directly (your API accounts)
- No vendor lock-in

## The CORS Proxy

### Why It Exists

Browsers have a security feature called CORS (Cross-Origin Resource Sharing) that prevents JavaScript from making requests to different domains. Some AI providers also require authentication tokens in specific formats.

```
proxy: proxy/index.php?url=
jsonbearer: Y
```

### What It Actually Does (Code Review)

The proxy is **minimal PHP code** (~200 lines) included in the GitHub repository. Here's exactly what it does:

**Source/Destination Whitelists:**
```php
$arrSourceWhitelist = array('cyborgshell.com', 'cyborgdesktop.com', 'localhost');
$arrDestinationWhitelist = array(); // Empty = allow all (you can restrict)
```
- Controls which origins can use the proxy
- Controls which destinations are allowed
- Configurable for your security needs

**Bearer Token Extraction:**
```php
// Extract bearer token from JSON body
$objPayload = json_decode($rawBody, true);
$strBearer = isset($objPayload['bearer']) ? $objPayload['bearer'] : null;

// Remove bearer from payload before sending to API
unset($objPayload['bearer']);
unset($objPayload['api_key']);

// Add Authorization header
if (!empty($strBearer)) {
    $arrHeaders[] = 'Authorization: Bearer ' . $strBearer;
}
```

**Process:**
1. Receives request from browser with API key in JSON body
2. Extracts `bearer` or `api_key` field from JSON
3. Removes it from the payload
4. Adds proper `Authorization: Bearer` header
5. Forwards request to AI provider
6. Returns response unchanged

**Security Limits:**
```php
DEFINE('MAXFILESIZE', 1024);    // 1MB max
DEFINE('MAXTIMEOUT', 120);      // 120 second timeout
DEFINE('SSL_VERIFYPEER', false); // Configurable
```

**Logging (Disabled by Default):**
```php
DEFINE('LOG_OUTPUT', 'FALSE');   // OFF by default - only for debugging
DEFINE('FILE_ERRORLOG', './cors-proxy.log');
// Logging only when explicitly enabled for troubleshooting
```

**Important Note:** Set `LOG_OUTPUT` to `TRUE` only when debugging issues, then disable immediately after.

### What It Doesn't Do

- ❌ Does NOT store your API keys (passed through only)
- ❌ Does NOT retain any data (logging disabled by default)
- ❌ Does NOT execute any code from requests
- ❌ Does NOT modify your prompts or responses
- ❌ Does NOT connect to anything except specified destination
- ❌ Does NOT make outbound calls without explicit request

### The Reality of Proxies

**Any proxy sees data in transit** - that's how proxies work. The critical questions are:

1. **What does it do with the data?** (This one: passes through, doesn't store)
2. **Can you verify that?** (Yes: ~200 lines of open source PHP)
3. **Can you trust it?** (Self-host = you control it completely)

**The Truth:** If you're using ANY platform with closed-source code, you're trusting them with your API keys whether they admit it or not. CyborgShell's difference:

✅ **Open Source** - Audit every line of code  
✅ **Self-Hostable** - Run on your infrastructure  
✅ **Transparent** - No hidden data collection  
✅ **Optional** - Eliminate proxy entirely with Ollama  

**Bottom Line:** If someone claims their proxy "never sees" your API keys, they're either lying or don't understand how proxies work. The question is: what do they do with them, and can you verify it?

With CyborgShell: Yes, you can verify. And you can host it yourself.

### Simple Decision Guide

**API key visibility through proxy matters to you?**
→ **Self-host it.** Then you control everything. Problem solved.

**Don't want to deal with any proxy at all?**
→ **Use Ollama.** Zero external calls, zero proxy needed.

**Using cyborgshell.com for convenience?**
→ Our server follows best practices. Code is open source. You decide your trust level.

**Bottom line:** You have options. Choose what fits your security requirements.

### Audit the Proxy Yourself

**GitHub:** https://github.com/PrimalNinja/cyborgshell/proxy/  
**Lines of Code:** ~200  
**Language:** Plain PHP  
**Dependencies:** None (uses cURL)  

You can:
- Read every line of code
- Modify for your requirements
- Host on your own infrastructure
- Replace with your own proxy
- Eliminate entirely (use Ollama local)

### When You Need It

**Requires Proxy:**
- OpenAI (CORS restrictions)
- Claude/Anthropic (bearer token in body)
- Google Gemini (CORS restrictions)

**No Proxy Needed:**
- Ollama (local, no CORS)
- Self-hosted models
- Any API you control with CORS configured

### Self-Hosting the Proxy

When you self-host CyborgShell, the proxy comes with it:

```bash
git clone https://github.com/PrimalNinja/cyborgshell
cd cyborgshell/proxy

# Configure whitelists
vim index.php
# Edit $arrSourceWhitelist and $arrDestinationWhitelist

# Configure logging (disabled by default)
# LOG_OUTPUT = 'FALSE' (default)
# Only enable for debugging, then disable immediately

# Deploy to your web server
# Ensure PHP and cURL are available
```

**Customization Options:**
- Restrict source domains (only your internal network)
- Restrict destination domains (only approved AI providers)
- Adjust file size limits
- Configure timeout values
- Enable/disable logging (OFF by default)
- Customize log location if debugging
- Add additional security checks

**Security Recommendations:**
- Keep `LOG_OUTPUT = 'FALSE'` in production
- Enable logging only for troubleshooting specific issues
- Set restrictive source/destination whitelists
- Use HTTPS for all connections
- Review logs immediately after debugging, then delete
- Consider eliminating proxy entirely (use Ollama local)

## Deployment Scenarios

### Public Cloud (cyborgshell.com)

**Architecture:**
```
User Browser → cyborgshell.com (files) → Cloud AI APIs
            ↓
      Browser Local Storage (API keys)
```

**Best For:**
- Quick start / trying it out
- Multi-device access
- Cloud file storage
- Using multiple AI providers

**Security:**
- API keys in browser only
- Direct API calls to providers
- File operations on CyborgShell servers
- Good for non-sensitive work

**Trust Model:**
- Trust CyborgShell with file operations
- Trust browser local storage for API keys
- Trust AI providers with prompts/data

### Self-Hosted with Cloud AI

**Architecture:**
```
User Browser → Your Server (files) → Cloud AI APIs
            ↓
      Browser Local Storage (API keys)
```

**Best For:**
- Corporate environments
- Custom file storage requirements
- Internal compliance needs
- Control over file data

**Security:**
- You control the server
- API keys still in browser
- Direct API calls to cloud providers
- Files never leave your infrastructure

**Trust Model:**
- Trust your own server
- Trust browser local storage
- Trust AI providers with prompts/data
- No third-party file storage

**Setup:**
```bash
git clone https://github.com/PrimalNinja/cyborgshell
# Host on your Apache/Nginx server
# That's it - it's static HTML/JS
```

### Self-Hosted with Local AI (Air-Gap)

**Architecture:**
```
User Browser → Your Server (files) → Ollama (localhost)
            ↓                      ↓
      Browser Local Storage    Local LLM
      
      NO INTERNET REQUIRED
```

**Best For:**
- Maximum security requirements
- HIPAA/SOC2/Compliance
- Classified/confidential work
- Air-gapped environments
- Zero data exfiltration tolerance

**Security:**
- Complete control of entire stack
- No data leaves your network
- No external API calls
- No cloud dependencies
- Audit trail entirely internal

**Trust Model:**
- Trust only your own infrastructure
- Zero external dependencies
- Complete data sovereignty

**Setup:**
```bash
# 1. Self-host CyborgShell
git clone https://github.com/PrimalNinja/cyborgshell
# Deploy to internal web server

# 2. Install Ollama locally
curl https://ollama.ai/install.sh | sh
ollama run llama3.2

# 3. Configure in browser
csconfig → Add service → ollama
endpoint: http://localhost:11434/v1/chat/completions
model: llama3.2:latest

# 4. Done - Completely air-gapped AI coding environment
```

### Distributed Processing with Ollama (Load Balancing)

**Advanced Architecture:**
```
                    ┌──────────────────────────┐
                    │  Shared File Server      │
                    │  (Network Drive / NAS)   │
                    └──────────────────────────┘
                              ↕
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ PC #1   │          │ PC #2   │          │ PC #3   │
   │ Browser │          │ Browser │          │ Browser │
   │    ↓    │          │    ↓    │          │    ↓    │
   │ Ollama  │          │ Ollama  │          │ Ollama  │
   └─────────┘          └─────────┘          └─────────┘
   
   All processing files in infinite loops
   You edit files remotely → All PCs respond
```

**How It Works:**

1. **Shared Project Storage:**
   ```bash
   # Mount network drive on all PCs
   # e.g., Z:\cyborgshell-projects\
   
   # Each PC accesses same projects
   project load production-pipeline
   ```

2. **Infinite Loop Processing:**
   ```bash
   # On each PC, create auto-processing project
   file 3
   file 1; filename input-queue.txt
   file 2; filename processing.txt
   file 3; filename output-queue.txt
   
   file 2; link 1 2 chatgpt ollama process task
   file 3; link 2 3 passthrough
   
   project save worker-node
   
   # Enable autorun
   csconfig → 1 → worker-node
   # Now this runs on browser refresh
   ```

3. **Remote File Editing:**
   ```bash
   # From your control PC:
   # Edit Z:\cyborgshell-projects\input-queue.txt
   # All connected PCs see the change
   # All trigger their transformers
   # All process in parallel
   ```

4. **Natural Load Balancing:**
   - Multiple PCs watch same input files
   - Each processes independently with Ollama
   - First to complete writes to output
   - Minimal server load (just file I/O)
   - Scales from 1 to infinite workers

**Use Cases:**

**Batch Processing:**
```
1. Create job queue file
2. Multiple PCs monitor queue
3. Each PC processes tasks with local Ollama
4. Results written to shared output
5. Zero cost (no API), fast (parallel), secure (internal)
```

**Render Farm Style:**
```
# Transform 1000 documents
input-queue/doc001.txt → output/doc001-processed.txt
input-queue/doc002.txt → output/doc002-processed.txt
...
# 10 PCs = 100 docs each, all using free Ollama
```

**Continuous Processing:**
```
# Watch folder for new files (drop events)
link drop chatgpt ollama analyze-and-report
# Any PC sees new file → processes → outputs result
```

**Development Pipeline:**
```
# Code review automation
code-submissions/ → review-process/ → approved-code/
# Multiple reviewers (PCs) process independently
# All using local Ollama, all parallel
```

**Benefits:**

✅ **Zero API Costs**: All Ollama local  
✅ **Horizontal Scaling**: Add more PCs = more throughput  
✅ **Fault Tolerant**: One PC down, others continue  
✅ **Minimal Server Load**: Only file I/O, no processing  
✅ **Complete Privacy**: All processing internal  
✅ **Simple Setup**: Just shared drive + CyborgShell + Ollama  
✅ **Natural Distribution**: File-based coordination  

**Monitoring:**

```bash
# Each PC logs its work
files                # See D (dirty) flags for processing
# Check output-queue for results
# Server logs show only file operations
```

This is essentially **MapReduce with AI**, using file systems for coordination and Ollama for zero-cost parallel processing.

### Hybrid (Best of Both Worlds)

**Architecture:**
```
User Browser → Your Server (files) → Ollama (sensitive data)
                                  → OpenAI (general queries)
                                  → Claude (documentation)
                                  → Gemini (translation)
```

**Best For:**
- Organizations with mixed sensitivity data
- Cost optimization (free local for most, paid for special cases)
- Leveraging strengths of different models

**Security:**
- Sensitive data stays on Ollama (local)
- General queries can use cloud
- Granular control per task

**Strategy:**
```bash
# Configure multiple services
csconfig → Add openai, claude, gemini, ollama

# Use appropriately
chatgpt service ollama      # For patient data analysis
chatgpt service openai      # For general coding help
chatgpt service claude      # For documentation
chatgpt service gemini      # For translations
```

## Compliance & Enterprise

### HIPAA (Healthcare)

**Requirements:**
- ✅ Protected Health Information (PHI) must not leave network
- ✅ Access controls and audit trails required
- ✅ Encryption in transit and at rest

**CyborgShell Solution:**
- Self-host CyborgShell internally
- Use Ollama for any PHI-related processing
- No PHI ever transmitted externally
- Server logs only file operations (no content)
- Encryption via HTTPS (your cert)

### SOC 2 (Service Organizations)

**Requirements:**
- ✅ Security controls documented
- ✅ Data flow mapping
- ✅ Access controls
- ✅ Change management

**CyborgShell Solution:**
- Simple data flow (browser → your server → local AI)
- No third-party data processing
- Audit trail limited to file operations
- Open source allows security review

### GDPR (Privacy)

**Requirements:**
- ✅ No unnecessary data collection
- ✅ User control over data
- ✅ Data minimization
- ✅ Right to be forgotten

**CyborgShell Solution:**
- Minimal server-side data (files only)
- User controls all API keys and configs
- No user tracking or analytics in code
- Simple deletion (remove files)

### Classified/Confidential

**Requirements:**
- ✅ Air-gapped environment
- ✅ No external network access
- ✅ Complete audit trail

**CyborgShell Solution:**
- Fully functional without internet
- Self-host + Ollama = complete air-gap
- All processing stays internal
- File-based audit trail

## Technical Details

### Browser Requirements

**Minimum:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Local storage enabled (for API keys)

**No Installation Required:**
- No browser extensions
- No desktop applications
- No mobile apps
- Just URL → Start coding

### Server Requirements (Self-Hosting)

**Minimal:**
- Any web server (Apache, Nginx, IIS)
- PHP (for file functionality and optional CORS proxy)

**No Special Requirements:**
- No database
- No application server
- No containers required (but can use)
- Static HTML/JS + simple file ops

### Network Requirements

**Public Cloud:**
- Internet access for AI provider APIs
- HTTPS for security

**Self-Hosted + Cloud AI:**
- Outbound access to AI providers
- Inbound for users (can be internal only)

**Self-Hosted + Local AI:**
- No internet required at all
- Internal network only
- Can be completely air-gapped

### API Rate Limits

**You Control:**
- Using your own API keys = your rate limits
- No shared pools or quotas
- No throttling by CyborgShell
- Direct relationship with AI providers

**Cost Management:**
- You see charges directly from providers
- No markup or hidden fees
- Monitor via provider dashboards
- Switch providers to optimize costs

## Security Best Practices

### API Key Management

```bash
# DO: Use csconfig to set keys
csconfig → 5 → Add service details
# Keys stored in browser local storage

# DO: Back up your config
csconfig → B → Backup configuration
# Export to file, store securely

# DO: Use different keys per environment
# Dev keys for testing
# Prod keys for production

# DON'T: Share devices with sensitive keys
# Use private/incognito if needed
# Or clear config after use

# DON'T: Commit keys to version control
# Projects (.prj) don't contain keys
# Configs are local to browser
```

### Network Security

```bash
# DO: Use HTTPS for CyborgShell server
# Your certificate, your control

# DO: Use VPN for remote access to internal instance
# Keep internal instances internal

# DO: Firewall rules for Ollama
# Only allow internal network if air-gapped

# DON'T: Expose internal CyborgShell to public internet
# Use VPN or other secure access
```

### Data Classification

```bash
# Strategy:
# Level 1 (Public): Cloud AI OK
# Level 2 (Internal): Self-hosted + Cloud AI OK  
# Level 3 (Confidential): Self-hosted + Ollama only
# Level 4 (Secret): Air-gapped environment

# Enforce with service configuration:
chatgpt service ollama      # For Level 3+
chatgpt service claude      # For Level 1-2
```

## Advantages of This Architecture

### For Users

✅ **Privacy**: Your code, your keys, your control  
✅ **Flexibility**: Switch AI providers anytime  
✅ **Cost**: Your API keys = your pricing  
✅ **Speed**: Direct API calls, no intermediary  
✅ **Offline**: Works with local AI (Ollama)  

### For Organizations

✅ **Security**: Reduced attack surface  
✅ **Compliance**: Air-gap capable  
✅ **Control**: Self-host everything  
✅ **Audit**: Simple data flows  
✅ **Cost**: No platform fees  

### For Developers

✅ **Transparency**: Open source (MIT)  
✅ **Extensibility**: Add your own transformers  
✅ **Portability**: Run anywhere  
✅ **Simplicity**: Static files + file ops  
✅ **Customization**: Fork and modify  

## Source Code

**GitHub**: https://github.com/PrimalNinja/cyborgshell  
**License**: MIT (free, open source)  
**Components**:
- HTML/CSS/JavaScript (client)
- PHP (minimal server for file ops)
- Transformers (JavaScript)
- Example projects

**You Can:**
- Review all code
- Audit security
- Modify for your needs
- Contribute improvements
- Fork for internal use
- Deploy anywhere

## Conclusion

CyborgShell's browser-first architecture provides unique security and privacy benefits:

1. **Your API keys stay local** (browser storage, not servers)
2. **Your code executes in your browser** (not on servers)
3. **Your AI calls go direct** (browser → AI provider)
4. **Complete self-hosting possible** (MIT license)
5. **Air-gap capable** (with Ollama)

Whether you use the public cloud version for convenience, self-host for control, or deploy air-gapped for maximum security - the choice is yours.

**Your code. Your AI. Your control.** 🔒