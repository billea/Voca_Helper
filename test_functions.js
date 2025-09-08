// Test functions from the vocabulary app
// Extract key functions for isolated testing

// CSV Parser test
function splitCSVLine(line){
  const out=[]; let cur=''; let inQ=false; 
  for(let i=0;i<line.length;i++){
    const ch=line[i]; const nx=line[i+1];
    if(inQ){ 
      if(ch==='"'){ 
        if(nx==='"'){ cur+='"'; i++; } 
        else { inQ=false; } 
      } else { cur+=ch; } 
    }
    else { 
      if(ch===','){ out.push(cur); cur=''; } 
      else if(ch==='"'){ inQ=true; } 
      else { cur+=ch; } 
    }
  }
  out.push(cur); return out;
}

// Column mapping test
function cleanImport(o){
  const getField = (obj, ...keys) => keys.find(k => obj[k] !== undefined && obj[k] !== '') ? obj[keys.find(k => obj[k] !== undefined && obj[k] !== '')] : '';
  
  return {
    word: getField(o, 'word', 'Word', 'WORD', 'term', 'Term'),
    definition: getField(o, 'definition', 'Definition', 'DEFINITION', 'meaning', 'Meaning', 'desc', 'Description'),
    example: getField(o, 'example', 'Example', 'EXAMPLE', 'sentence', 'Sentence', 'Example Sentences', 'example_sentence'),
    morphology: getField(o, 'morphology', 'Morphology', 'MORPHOLOGY', 'root', 'Root', 'etymology', 'Etymology'),
    synonyms: getField(o, 'synonyms', 'Synonyms', 'SYNONYMS', 'similar', 'Similar'),
    antonyms: getField(o, 'antonyms', 'Antonyms', 'ANTONYMS', 'opposite', 'Opposite'),
    pos: getField(o, 'pos', 'POS', 'part_of_speech', 'Part of Speech', 'type', 'Type', 'category', 'Category')
  };
}

// Text extraction test
function extractVocabFromText(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const vocabList = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Pattern 1: Word - Definition
    let match = line.match(/^([^-:]+)\s*[-:]\s*(.+)$/);
    if (match && match[1].split(' ').length <= 3) {
      vocabList.push({
        word: match[1].trim(),
        definition: match[2].trim(),
        example: '', synonyms: '', antonyms: '', morphology: '', pos: ''
      });
      continue;
    }
    
    // Pattern 2: Word on line, definition next
    if (line.length <= 25 && /^[a-zA-Z'\s-]+$/.test(line) && line.split(' ').length <= 3) {
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (nextLine && nextLine.length > line.length) {
        vocabList.push({
          word: line,
          definition: nextLine,
          example: '', synonyms: '', antonyms: '', morphology: '', pos: ''
        });
        i++; // Skip next line
        continue;
      }
    }
  }
  
  // Fallback: extract likely words
  if (vocabList.length === 0) {
    const words = text.match(/\b[A-Za-z]{4,}\b/g) || [];
    const uniqueWords = [...new Set(words)].slice(0, 20);
    uniqueWords.forEach(word => {
      vocabList.push({
        word: word.toLowerCase(),
        definition: '[Definition needed]',
        example: '', synonyms: '', antonyms: '', morphology: '', pos: ''
      });
    });
  }
  
  return vocabList;
}

// Test CSV parsing
console.log('=== CSV Parser Test ===');
const csvLine = 'word,"definition with, comma","example ""quoted""",synonym';
console.log('Input:', csvLine);
console.log('Output:', splitCSVLine(csvLine));

// Test column mapping
console.log('\n=== Column Mapping Test ===');
const testObj1 = { Word: 'test', Definition: 'meaning', Example: 'sentence' };
const testObj2 = { term: 'test2', meaning: 'another meaning', sentence: 'another sentence' };
console.log('Test 1 (Word/Definition):', cleanImport(testObj1));
console.log('Test 2 (term/meaning):', cleanImport(testObj2));

// Test text extraction
console.log('\n=== Text Extraction Test ===');
const sampleText = `
Ameliorate - to make better or improve
Example: The new policy will ameliorate working conditions.

Capitulate
to surrender or give up

Deleterious: harmful or damaging
`;
console.log('Extracted vocabulary:', extractVocabFromText(sampleText));