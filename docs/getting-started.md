# CyborgShell - Getting Started (5 Minutes)

## What Is This?

**CyborgShell = 1980s BASIC + Modern JavaScript + AI + Cloud + Runs Everywhere**

Type code on your phone, continue on Xbox, finish on PC. Same URL, same environment, zero setup.

### Why It's Different

**Browser-Based = Your Privacy**
- Code runs in **your browser**, not on servers
- API keys stored in **your local storage**, never on servers
- Direct API calls from browser to AI providers
- Self-hostable (MIT License): https://github.com/PrimalNinja/cyborgshell

**Complete Privacy Option**
- Self-host CyborgShell internally
- Use Ollama for local AI
- **Zero data leaves your network**
- Perfect for healthcare, legal, financial, classified work

## Two Ways to Code

### Immediate Mode (No Line Numbers)
Type and run instantly:
```javascript
api.print("Hello!");
for(let i=0; i<5; i++) api.print(i);
```

### Program Mode (With Line Numbers)
Store and save:
```javascript
10 api.print("Hello!");
20 for(let i=0; i<5; i++) api.print(i);
run
save myprogram
```

**If you see a line number, it's stored. No line number? Runs immediately.**

## Essential Commands

```bash
# Files
save mycode          # Save current program
load mycode          # Load program
dir                  # List saved files
cls                  # Clear screen
run                  # Execute program

# Editing
list                 # Show program
edit 10              # Edit line 10
new                  # Clear program
```

## AI in 3 Ways

### 1. Quick Questions
```bash
!what is the capital of France?
!how do I sort an array in JavaScript?
```

### 2. Conversations
```bash
chatgpt 
write me a function to calculate fibonacci
now make it recursive
```

### 3. Named Sessions (Keep Context Separate)
```bash
chatgpt 
coding: help me debug this
story: write about robots
coding: continue helping
story: make it dramatic
```

## Your First Program

```bash
# Type this (immediate mode)
10 api.print("My first program!");
20 for(let i=1; i<=5; i++) {
30     api.print("Count: " + i);
40 }

# Run it
run

# Save it
save first

# Load it anytime
load first
run
```

## Your First AI Pipeline

```bash
# Setup 3 files
file 1; 
filename input.txt
file 2; 
filename processed.txt
file 3; 
filename output.txt
file 1;

# Link them with AI
link 1 2 chatgpt openai improve this text
link 2 3 translate Spanish

# Save the pipeline
project save my-first-pipeline

# Use it - edit file 1
file 1; 
edit 10
10 The quick brown fox jumps

# Files 2 and 3 auto-process!
files                # See D (dirty/processed) flag
saveall              # Save all results
```

## Tips

1. **No line number = immediate, with line number = stored**
2. **Commands work on phone, Xbox, PC - identically**
3. **AI sessions keep context - use named sessions for different tasks**
4. **Projects are pipelines - edit input, output auto-generates**
5. **Everything saves to cloud - access from any device**

## What Now?

- Type `help` for full command list
- Type `!teach me about transformers` for AI-powered learning
- Load example: `project load aicoder` then explore
- Read full guide for advanced features

## Philosophy

No installation. No setup. No barriers.

Just **code**.

On your phone at lunch. On Xbox at night. On PC at work.

**Welcome to CyborgShell.** 🚀