# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vocabulary memory helper application designed as a single-file offline web app using spaced repetition (SM-2 algorithm) for language learning. The project helps children and learners memorize vocabulary efficiently through clean UI, local storage, and evidence-based learning techniques.

## Architecture

### Single-File Architecture
The main application is contained in `vocabulary_memory_helper_single_file_web_app.html` which includes:
- **HTML Structure**: Tab-based interface (Study, Manage, Import/Export, Settings, Quiz)
- **CSS Styling**: Inline dark theme with gradient backgrounds and responsive design
- **JavaScript Logic**: Complete application logic including:
  - SM-2 spaced repetition algorithm
  - Local storage persistence
  - CSV/JSON import/export
  - Text-to-speech (TTS) functionality
  - Quiz generation with multiple choice questions
  - Bulk operations support

### Core Components
- **Study System**: Implements SM-2 algorithm with ratings (Again/Hard/Good/Easy)
- **Card Management**: CRUD operations for vocabulary cards with filtering and search
- **Import/Export**: Supports CSV and JSON formats with flexible header mapping
- **Quiz Mode**: Multiple choice questions for synonyms, antonyms, and definitions
- **Statistics**: KPI dashboard showing progress metrics and card categorization

### Data Model
```javascript
Card = {
  id: string,           // generated uid
  word: string,
  definition: string,
  example: string,
  morphology: string,   // root/prefix/suffix
  synonyms: string,     // comma-separated
  antonyms: string,     // comma-separated
  pos: string,          // part of speech
  ef: number,           // SM-2 easiness factor (default 2.5)
  interval: number,     // days until next review
  reps: number,         // successful repetitions
  due: number,          // next due timestamp (ms)
  created: number,      // created timestamp (ms)
  seen: boolean         // has been introduced yet
}
```

## Development Commands

### Testing
```bash
# Run basic functionality tests using Playwright
node test_vocab_app.js

# Validate specific features
node validate_functionality.js

# Test execution with manual verification
node test_execution_report.js

# Manual browser testing
python -m http.server 8000
# Then open browser to http://localhost:8000/vocabulary_memory_helper_single_file_web_app.html
```

### Data Processing
```bash
# Fill definitions from dictionary API (requires internet)
python fill_definitions_fast.py input.xlsx output.xlsx

# Process synonym/antonym data
python fill_syn_ant.py

# Process vocabulary from images (requires OCR setup)
python -m pip install tesseract
python vocab_from_image_processor.py
```

### File Serving for Development
```bash
# Start local server for testing
python -m http.server 8000

# Alternative with Node.js
npx serve .

# Test the app
open http://localhost:8000/vocabulary_memory_helper_single_file_web_app.html
```

## Testing Strategy

### Test Files Available
- `test_*.html` - Individual feature tests (bulk deletion, quiz functionality, session management)
- `test_vocab_app.js` - Playwright automation tests
- `validate_functionality.js` - Core feature validation
- `browser_test.html` - Manual testing interface

### Test Categories
1. **Core Functionality**: Add/edit/delete cards, study flow, spaced repetition
2. **Import/Export**: CSV/JSON parsing, data validation, format handling
3. **Quiz System**: Question generation, scoring, answer validation
4. **UI/UX**: Tab navigation, keyboard shortcuts, responsive design
5. **Data Persistence**: LocalStorage operations, backup/restore

## Data Formats

### CSV Import Format
```
word,definition,example,morphology,synonyms,antonyms,pos
benevolent,kind and wanting to do good,The benevolent teacher helped everyone.,bene (good),kind,generous,adjective
```

### JSON Import Format
```json
[
  {
    "word": "benevolent",
    "definition": "kind and wanting to do good",
    "example": "The benevolent teacher helped everyone.",
    "morphology": "bene (good)",
    "synonyms": "kind,generous",
    "antonyms": "unkind,mean",
    "pos": "adjective"
  }
]
```

## Bulk Deletion Feature Implementation

When implementing bulk deletion functionality:

1. **UI Components**: Add checkboxes to card list items in manage tab
2. **Selection Logic**: Track selected cards with Set or Array
3. **Batch Operations**: Implement `deleteSelectedCards()` function
4. **Confirmation**: Add confirmation dialog for irreversible actions
5. **State Management**: Update KPI counters and refresh displays
6. **Storage**: Ensure localStorage is updated atomically

Key considerations:
- Use `card.id` as unique identifier for selections
- Implement "Select All" / "Deselect All" functionality
- Provide visual feedback for selected items
- Handle edge cases (no selection, all cards selected)
- Maintain data consistency across tabs and statistics

## External APIs Used

- **dictionaryapi.dev**: Free dictionary API for definitions/examples
- **Datamuse API**: Synonym and antonym lookup service
- **Web Speech API**: Text-to-speech functionality (browser native)

## Deployment

The app is designed for simple deployment:
- **Single File**: Copy `vocabulary_memory_helper_single_file_web_app.html` to any web server
- **Netlify**: Drag and drop the HTML file
- **GitHub Pages**: Commit and enable Pages
- **Local Use**: Double-click the HTML file to run offline

## Storage

- **LocalStorage Keys**: `vocab_cards_v1`, `vocab_prefs_v1`
- **Backup**: Built-in JSON export/import for data portability
- **Cross-device**: Optional Firebase sync (not currently implemented)

## Performance Considerations

- Cards are loaded into memory on startup
- Large datasets (>1000 cards) may need pagination
- Quiz questions are generated on-demand
- Image processing for OCR imports can be memory intensive