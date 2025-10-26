# CyborgShell Project Creation Guide

## Overview

CyborgShell projects are JSON files that define transformer pipelines - directed acyclic graphs (DAGs) where files are nodes and transformers are edges. When a source file becomes "dirty" (modified), all linked transformers execute automatically in cascade.

## Project File Structure

```json
{
  "projectName": "my-project",
  "files": [
    {
      "fn": "filename.txt",           // Filename
      "mt": "text/plain",             // MIME type
      "mte": "text",                  // Editor type (text/hex)
      "ln": 1,                        // Linked to file index (null if none)
      "pl": "transformer.xfrm",       // Plugin/transformer name
      "arg": "arguments here",        // Transformer arguments
      "fl": "",                       // File flavour
      "st": ""                        // Status
    }
  ]
}
```

## Key Concepts

### File Indexing
- Files are indexed starting at **1** (not 0!)
- File 0 is reserved for "Run Space"
- Use `ln: null` for source files with no input
- Use `ln: 2` to link to file index 2

### Multi-Input Links
- Single input: `"ln": 2`
- Multiple inputs: `"ln": "2,3,4"`
- All input files must be dirty before transformer executes

### Transformer Placement
- Transformers should be included as files in the project
- Use `"mt": "text/javascript transformer"` for transformer files
- Set `"ln": null` for transformer files

## Available Transformers

### AI Transformers
- **chatgpt.xfrm** - AI processing (args: `"service prompt"` or `"service session:id prompt"`)
  - Services: `openai`, `claude`, `gemini`, or `%PROVIDER%` for configured default
  - Sessions maintain context across calls
  - Scan mode: looks for `AI PROMPT START/END` blocks in source
- **translate.xfrm** - Translate text (args: target language)

### Data Processing
- **blocker.xfrm** - Stops cascade if input is empty
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
File 3: gate.txt (ln: 2, pl: chatgpt.xfrm, arg: "openai if score >= 8 output YES else NO")
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

## Example Projects

### Example 1: AI Coder (aicoder.prj)
AI-assisted code generation with automatic backup.

**Flow:**
```
#1 coder.js (write code/prompts) → passthrough → #3 coderbackup.js (safety backup)
    ↓
chatgpt (AI processes)
    ↓ 
#2 coderai.js
    ↓
passthrough → back to coder.js
```

**Usage:**
1. Type `10 # make a fibonacci function` in coder.js
2. AI generates code
3. Type `run` to execute
4. Original preserved in coderbackup.js

### Example 2: Multi-Language Translation (aitranslate.prj)
Generate content and translate to multiple languages simultaneously.

**Flow:**
```
#1 aitest_prompt.txt (user prompt)
    ↓
chatgpt
    ↓
#2 aitest_story.txt (AI-generated story)
    ↓ 
blocker (quality check)
    ↓ 
#3 aitest_english.txt (validated content)
    ├→ translate → #4 aitest_chinese.txt
    ├→ translate → #5 aitest_indonesian.txt
    ├→ translate → #6 aitest_japanese.txt
    └→ translate → #7 aitest_tagalog.txt
```

### Example 3: Statistical Analysis Pipeline (stat-analysis.prj)
Multi-stage research workflow with quality gate.

**Flow:**
```
#1 data-input (user request)
    ↓
chatgpt
    ↓
#2 raw-dataset (AI generated data)
    ├→ basic-statistics ────┐
    ├→ outlier-analysis     │
    ├→ frequency-distribution│
    └→ regression-analysis ─┼→ latex-statistics → # comprehensive-report
                            │                              ↓
                            └→ # JS-code                passthrough
                                                           ↓
                                                    # quality-assessment
                                                           ↓
                                                      quality-gate
                                                           ↓
                                                    # final-publication
```

**Quality Gate:** Report only publishes if AI self-assessment scores ≥8/10.

## Command-Line Project Creation

### Setup Pattern

Before creating links, set up your file structure:

```
file 10              # Creates files 1-10, goes to file 10
file 1               # Return to file 1
```

This creates 10 empty working files. Transformers will automatically load from file 11 onward when referenced.

**Mental Model:**
- Files 1-10: Your working files (data, inputs, outputs)
- Files 11+: Transformers (automatically loaded when used)

### Project Management Commands

```bash
project save myproject     # Saves as myproject.prj
project load myproject     # Loads myproject.prj
```

Note: `.prj` extension is automatic - don't include it in the name.

### Example: Creating AI Coder Project

```bash
# Setup
file 3
file 1

# Name files
filename coder.js
file 2
filename coderai.js
file 3
filename coderbackup.js
file 1
files

# Create links
link 2 1 chatgpt %PROVIDER% process the file prompts start with # or // #
link 3 1 passthrough
link 1 2 passthrough
files

# Save
project save aicoder
```

### Example: Creating Translation Pipeline

```bash
# Setup files
file 7
file 1

# Name them
filename aitest_prompt.txt
file 2
filename aitest_story.txt
file 3
filename aitest_english.txt
file 4
filename aitest_chinese.txt
file 5
filename aitest_japanese.txt
file 6
filename aitest_indonesian.txt
file 7
filename aitest_tagalog.txt
file 1
files

# Create links
link 2 1 chatgpt %PROVIDER%
link 3 2 blocker
link 4 3 translate Chinese
link 5 3 translate Japanese
link 6 3 translate Indonesian
link 7 3 translate Tagalog
files

# Save
project save aitranslate
```

### Example: Creating Code Review Pipeline

```bash
# Setup
file 5
file 1

# Name files
filename source-code.js
file 2
filename code-analysis.txt
file 3
filename suggestions.txt
file 4
filename test-cases.js
file 5
filename review-report.md
file 1
files

# Create links
link 2 1 chatgpt openai analyze this code for bugs, security issues, and code smells
link 3 1 chatgpt openai suggest improvements for readability, performance, and maintainability
link 4 1 chatgpt openai generate comprehensive unit tests using pytest
link 5 2,3,4 chatgpt openai compile a comprehensive code review report with the analysis, suggestions, and test coverage
files

# Save
project save code-review
```

### Example: Creating Document Merge Project

```bash
# Setup
file 7
file 1

# Name files
filename version-a.txt
file 2
filename version-b.txt
file 3
filename version-c.txt
file 4
filename diff-a-b.txt
file 5
filename diff-b-c.txt
file 6
filename merged-all.txt
file 7
filename conflict-resolution.txt

# Create links (multi-input)
file 4
link 1,2 4 filediff
file 5
link 2,3 5 filediff
file 6
link 1,2,3 6 filejoin %NL%%NL%--- NEXT VERSION ---%NL%%NL%
file 7
link 4,5 7 chatgpt openai analyze these diffs and suggest how to resolve conflicts, then create a merged version

# Save
project save document-merge
```

### Example: Creating Quality Gate Pipeline

```bash
# Setup
file 7
file 1

# Name files
filename raw-data.csv
file 2
filename validation-report.txt
file 3
filename stats-summary.txt
file 4
filename cleaned-data.csv
file 5
filename quality-check.txt
file 6
filename approved-data.csv
file 7
filename final-report.md

# Create pipeline with quality gate
file 2
link 1 2 chatgpt openai analyze this CSV for data quality issues: missing values, duplicates, outliers, format errors
file 3
link 1 3 filestats
file 4
link 1 4 chatgpt openai clean the data: remove duplicates, fill missing values appropriately, fix formatting
file 5
link 4 5 chatgpt openai verify the cleaned data quality and assign a score 1-10
file 6
link 5 6 blocker
file 7
link 2,3,5 7 chatgpt openai create a data quality report with validation results, statistics, and final quality score

# Save
project save data-validation
```

### Tips for Command-Line Creation

1. **Plan your file count**: Count total files needed (inputs + outputs + intermediates)
2. **Use file X to pre-create**: `file 15` creates 15 files instantly
3. **Name as you go**: Switch to each file and use `filename` command
4. **Link from target**: Go to the target file, then create the link
5. **Multi-input links**: Use commas without spaces: `link 1,2,3 5 transformer`
6. **Test incrementally**: Create a few links, test, then continue
7. **Save often**: Use `project save` after major changes

### Quick Reference

```bash
# File Management
file N                    # Create N files, go to file N
file X                    # Switch to file X
files                     # List all files (shows D for dirty)
filename name.ext         # Name current file

# Linking
link SOURCE TARGET plugin args       # Single input
link SRC1,SRC2 TARGET plugin args    # Multi-input (NO SPACES!)

# Projects
project save name         # Save as name.prj
project load name         # Load name.prj
project name "My Project" # Set project display name

# Saving
saveall                   # Save all dirty (D) files at once

# Viewing
list                      # Show current file content
type filename             # View file without loading
```

### Dirty Flags & Workflow

When transformers process files, they're marked as **D** (dirty):

```
Files:
  1 *D input.txt 50 bytes/5 lines
  2  D output.txt 120 bytes/10 lines
* current file, D dirty file
```

**Workflow:**
1. Name files: `filename report.txt`
2. Build links and save project: `project save myproject`
3. Edit input → pipeline runs → files marked D
4. Check results: `files` (see D flags)
5. Save everything: `saveall`

This means after processing completes, one `saveall` command saves all results!

## Best Practices

### 1. Include Required Transformers
Don't forget to add transformer files to your project:
```json
{
  "fn": "chatgpt.xfrm",
  "mt": "text/javascript transformer",
  "mte": "text",
  "ln": null,
  "pl": "",
  "arg": "",
  "fl": "",
  "st": ""
}
```

### 2. The Provider Variable
Use the `%PROVIDER%` variable if you only have a single provider:
```json
"arg": "%PROVIDER% translate this text"
```

### 3. Name Files Descriptively
Use clear, hierarchical names:
- `input-raw.txt`
- `processed-stage1.txt`
- `output-final.txt`

### 4. Leverage Sessions for Context
Use ChatGPT sessions to maintain conversation context:
```json
"arg": "openai session:analysis calculate statistics"
```
Later:
```json
"arg": "openai session:analysis what was the mean?"
```

### 5. Create Backup Chains
Always preserve source material:
```
source → processor (ln: backup)
      → backup (ln: source, pl: passthrough.xfrm)
```

### 6. Use Blocker for Validation
Add blockers after quality checks:
```
content → validator → blocker → publication
```

### 7. Fan-Out for Parallel Processing
Process once, output many ways:
```
source → translate (Japanese)
      → translate (Chinese)
      → translate (Spanish)
      → speak (en-us)
```

## Common Patterns

### Research Pipeline
```
1. data-input.txt
2. analysis.txt (ln: 1, chatgpt: "analyze data")
3. visualization.txt (ln: 2, chatgpt: "create R code")
4. report.txt (ln: "2,3", chatgpt: "write report")
```

### Content Creation
```
1. brief.txt
2. draft.txt (ln: 1, chatgpt: "write article")
3. edited.txt (ln: 2, chatgpt: "improve clarity")
4. final.txt (ln: 3, chatgpt: "format for publication")
```

### Data Processing
```
1. raw1.csv
2. raw2.csv
3. raw3.csv
4. merged.csv (ln: "1,2,3", csvmerge)
5. stats.txt (ln: 4, filestats)
6. analysis.txt (ln: 5, chatgpt: "interpret statistics")
```

### Code Generation
```
1. requirements.txt
2. code.js (ln: 1, chatgpt: "generate JS code")
3. tests.js (ln: 2, chatgpt: "create unit tests")
4. docs.md (ln: 2, chatgpt: "document code")
```

## Debugging Tips

### File Not Updating?
- Check `ln` index is correct (remember: 1-based!)
- Verify source file is "dirty" (modified)
- Ensure transformer file is included in project

### Multi-Input Not Working?
- All source files must be dirty
- Use string syntax: `"ln": "2,3,4"`
- Check transformer supports multi-input

### Transformer Error?
- View console logs (transformer prints debug info)
- Check transformer is loaded as plugin
- Verify arguments are correctly formatted

### Cascade Not Triggering?
- Edit a source file to mark it dirty
- Check for circular dependencies
- Verify `ln` points to existing file

## Advanced Techniques

### Dynamic Provider Selection
```json
"arg": "%PROVIDER% process this"
```
Configure provider using csconfig

### Conditional Logic with Sessions
Use persistent sessions for stateful processing:
```json
"arg": "openai session:validator validate input then remember result"
```

### Template-Driven Generation
```
File 1: template.html (HTML with {{placeholders}})
File 2: data.json (JSON dictionary)
File 3: output.html (ln: "1,2", template.xfrm)
```

### Multi-Stage Refinement
```
draft → improve1 → improve2 → improve3 → final
  ↓       ↓          ↓          ↓          ↓
backup1 backup2  backup3   backup4   backup5
```

## File Formats

### Supported MIME Types
- `text/plain` - Plain text
- `text/javascript` - JavaScript code
- `text/csv` - CSV data
- `application/json` - JSON data
- `text/html` - HTML documents
- `image/png`, `image/jpeg` - Images (for OCR)
- `application/pdf` - PDF documents (for OCR)

### Editor Types
- `text` - Text editor with line numbers
- `hex` - Hexadecimal editor for binary files

## Tips for AI Prompts

### Be Specific
```
Bad:  "openai process this"
Good: "openai extract key insights and summarize in 3 bullet points"
```

### Use Multi-Step Prompts
```
"openai first validate the data structure, then calculate statistics"
```

### Reference File Context
```
"openai use the data from the previous analysis to generate visualizations"
```

### Chain Reasoning
```
File 1 → "openai analyze problem"
File 2 → "openai propose solutions based on analysis"
File 3 → "openai select best solution and explain"
```

## Additional Example Projects

### Example 4: Code Review Pipeline (code-review-pipeline.prj)
Automated code analysis with parallel review tracks.

**Flow:**
```
source-code.js
    ├→ code-analysis.txt (bugs, security)
    ├→ suggestions.txt (improvements)
    └→ test-cases.js (unit tests)
         ↓
    review-report.md (combines all three)
```

### Example 5: Document Merge & Compare (document-merge-compare.prj)
Three-way diff and intelligent conflict resolution.

**Flow:**
```
version-a.txt ────┐
                  ├→ diff-a-b.txt ──┐
version-b.txt ────┤                 ├→ conflict-resolution.txt
                  ├→ diff-b-c.txt ──┘
version-c.txt ────┘
```

### Example 6: Multi-Format Content (content-multiformat.prj)
Single brief → multiple platform-optimized outputs.

**Flow:**
```
content-brief.txt
    ├→ blog-post.md
    ├→ twitter-thread.txt
    ├→ linkedin-post.txt
    ├→ email-newsletter.html
    ├→ video-script.txt
    └→ infographic-data.json
```

### Example 7: Data Validation Pipeline (data-validation-pipeline.prj)
Quality-gated data cleaning workflow.

**Flow:**
```
raw-data.csv
    ├→ validation-report.txt
    ├→ stats-summary.txt
    └→ cleaned-data.csv → quality-check.txt → blocker → approved-data.csv
                                                              ↓
                                                    final-report.md
```

### Example 8: API Documentation Generator (api-docs-generator.prj)
Generate complete API docs from endpoint definitions.

**Flow:**
```
api-endpoints.json
    ↓
openapi-spec.json
    ├→ markdown-docs.md ──────┐
    ├→ postman-collection.json│
    ├→ client-sdk-csharp.cs ───┼→ integration-guide.md
    └→ client-sdk-javascript.js┘
```

### Example 9: Learning Material Generator (learning-material-generator.prj)
Comprehensive educational content from a single topic.

**Flow:**
```
topic.txt
    ├→ lesson-plan.md ────────┐
    ├→ study-notes.md ────────┤
    ├→ practice-exercises.txt ├→ teacher-guide.md
    ├→ quiz.json ─────────────┤
    └→ visual-aids.txt ───────┘
```

### Example 10: Story Development (story-development-pipeline.prj)
Multi-stage creative writing with revision cycle.

**Flow:**
```
story-premise.txt
    ├→ character-profiles.md ──┐
    ├→ world-building.md ──────┼→ plot-outline.md
    └────────────────────────┘      ↓
                            chapter-1, 2, 3 drafts
                                     ↓
                              full-draft.txt
                                     ↓
                            editorial-notes.txt
                                     ↓
                            revised-draft.txt
                                     ↓
                                synopsis.txt
```

### Example 11: Template Report Generator (template-report-generator.prj)
Data-driven HTML reports with AI insights.

**Flow:**
```
report-template.html ──────┐
                           │
company-data.json ────┐    │
financial-data.json ──┼→ merged-data.json ──┼→ generated-report.html ──┐
performance-data.json ┘         ↓                                        │
                          insights.txt ──────────────────────────────────┤
                                                                          ↓
                                                                  final-report.html
```

## Conclusion

CyborgShell projects enable powerful AI-driven workflows through declarative pipeline definitions. Master these patterns to build sophisticated automation ranging from simple translations to complex research pipelines with quality gates and multi-stage processing.

Remember: Files are nodes, transformers are edges, and dirty flags trigger cascading updates through your DAG. Build wisely! 🚀