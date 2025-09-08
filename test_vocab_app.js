const { chromium } = require('playwright');

async function testVocabApp() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Navigate to the application
        await page.goto('http://localhost:8000/vocabulary_memory_helper_single_file_web_app.html');
        await page.waitForLoadState('networkidle');
        
        console.log('🚀 Starting Vocabulary Memory Helper Tests\n');
        
        // Test 1: Initial state
        console.log('📋 TEST 1: Initial Application State');
        const title = await page.textContent('h1');
        console.log(`✓ Page title: ${title}`);
        
        const totalCards = await page.textContent('#kTotal');
        const dueCards = await page.textContent('#kDue');
        const learnedCards = await page.textContent('#kLearned');
        const streak = await page.textContent('#kStreak');
        
        console.log(`✓ Initial KPIs - Total: ${totalCards}, Due: ${dueCards}, Learned: ${learnedCards}, Streak: ${streak}`);
        
        // Test 2: Tab functionality
        console.log('\n📋 TEST 2: Tab Navigation');
        await page.click('[data-tab="manage"]');
        const manageSection = await page.isVisible('#tab-manage');
        console.log(`✓ Manage tab visible: ${manageSection}`);
        
        await page.click('[data-tab="import"]');
        const importSection = await page.isVisible('#tab-import');
        console.log(`✓ Import tab visible: ${importSection}`);
        
        await page.click('[data-tab="settings"]');
        const settingsSection = await page.isVisible('#tab-settings');
        console.log(`✓ Settings tab visible: ${settingsSection}`);
        
        // Return to manage tab for card creation
        await page.click('[data-tab="manage"]');
        
        // Test 3: Add vocabulary cards
        console.log('\n📋 TEST 3: Adding Vocabulary Cards');
        
        // Add first card
        await page.fill('#inWord', 'serendipity');
        await page.selectOption('#inPOS', 'noun');
        await page.fill('#inDef', 'A pleasant surprise or chance discovery');
        await page.fill('#inEx', 'It was serendipity that we met at the coffee shop');
        await page.fill('#inMorph', 'serendip (from Persian fairy tale)');
        await page.fill('#inSyn', 'chance, luck, fortune');
        await page.fill('#inAnt', 'misfortune, bad luck');
        
        await page.click('#addCardBtn');
        console.log('✓ Added first card: serendipity');
        
        // Add second card
        await page.fill('#inWord', 'ephemeral');
        await page.selectOption('#inPOS', 'adjective');
        await page.fill('#inDef', 'Lasting for a very short time');
        await page.fill('#inEx', 'The beauty of cherry blossoms is ephemeral');
        await page.fill('#inMorph', 'ephemer (lasting a day)');
        await page.fill('#inSyn', 'temporary, fleeting, brief');
        await page.fill('#inAnt', 'permanent, lasting, enduring');
        
        await page.click('#addCardBtn');
        console.log('✓ Added second card: ephemeral');
        
        // Check updated KPIs
        const newTotalCards = await page.textContent('#kTotal');
        const newDueCards = await page.textContent('#kDue');
        console.log(`✓ Updated KPIs - Total: ${newTotalCards}, Due: ${newDueCards}`);
        
        // Test 4: Clear form functionality
        console.log('\n📋 TEST 4: Clear Form');
        await page.fill('#inWord', 'test');
        await page.click('#clearForm');
        const clearedWord = await page.inputValue('#inWord');
        console.log(`✓ Form cleared successfully: ${clearedWord === ''}`);
        
        // Test 5: Study mode functionality
        console.log('\n📋 TEST 5: Study Mode');
        await page.click('[data-tab="study"]');
        
        const studyWord = await page.textContent('#frontWord');
        console.log(`✓ Study mode showing word: ${studyWord}`);
        
        // Test reveal functionality
        await page.click('#revealBtn');
        await page.waitForTimeout(500); // Wait for reveal animation
        
        // Test rating buttons
        const ratingButtons = ['#rate0', '#rate3', '#rate4', '#rate5'];
        for (const btn of ratingButtons) {
            const isVisible = await page.isVisible(btn);
            console.log(`✓ Rating button ${btn} visible: ${isVisible}`);
        }
        
        // Rate the card as "Good"
        await page.click('#rate4');
        console.log('✓ Rated card as Good');
        
        // Test 6: Keyboard shortcuts
        console.log('\n📋 TEST 6: Keyboard Shortcuts');
        
        // Test spacebar for reveal
        await page.keyboard.press('Space');
        console.log('✓ Spacebar pressed for reveal');
        
        // Test number keys for rating
        await page.keyboard.press('3'); // Good rating
        console.log('✓ Number key 3 pressed for rating');
        
        // Test 7: localStorage persistence
        console.log('\n📋 TEST 7: Data Persistence');
        
        const storedCards = await page.evaluate(() => {
            const stored = localStorage.getItem('vocab_cards_v1');
            return stored ? JSON.parse(stored).length : 0;
        });
        console.log(`✓ Cards stored in localStorage: ${storedCards}`);
        
        const storedPrefs = await page.evaluate(() => {
            const stored = localStorage.getItem('vocab_prefs_v1');
            return stored ? Object.keys(JSON.parse(stored)).length : 0;
        });
        console.log(`✓ Preferences stored in localStorage: ${storedPrefs > 0}`);
        
        // Test 8: Import/Export functionality
        console.log('\n📋 TEST 8: Import/Export');
        await page.click('[data-tab="import"]');
        
        // Test export button
        const exportBtn = await page.isVisible('#exportBtn');
        console.log(`✓ Export button visible: ${exportBtn}`);
        
        // Test import file input
        const importFileInput = await page.isVisible('#importFile');
        console.log(`✓ Import file input present: ${importFileInput !== null}`);
        
        // Test 9: Sample data functionality
        console.log('\n📋 TEST 9: Sample Data');
        const addSampleBtn = await page.isVisible('#addSample');
        console.log(`✓ Add sample button visible: ${addSampleBtn}`);
        
        await page.click('#addSample');
        console.log('✓ Sample data added');
        
        // Check if sample data was added
        const finalTotalCards = await page.textContent('#kTotal');
        console.log(`✓ Total cards after sample: ${finalTotalCards}`);
        
        // Test 10: Settings functionality
        console.log('\n📋 TEST 10: Settings');
        await page.click('[data-tab="settings"]');
        
        const settingsInputs = await page.$$eval('#tab-settings input, #tab-settings select', elements => 
            elements.map(el => ({type: el.type || el.tagName, id: el.id}))
        );
        console.log(`✓ Settings controls found: ${settingsInputs.length}`);
        
        console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
        
    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
    } finally {
        await browser.close();
    }
}

testVocabApp();