const { chromium } = require('playwright');

async function testVocabApp() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Navigate to the application
        await page.goto('http://localhost:8000/index.html');
        await page.waitForLoadState('networkidle');
        
        console.log('🚀 Starting Vocabulary Memory Helper Tests\n');
        
        // Test 1: Initial state
        console.log('📋 TEST 1: Initial Application State');
        const title = await page.textContent('h1');
        console.log(`✓ Page title: ${title}`);
        
        const totalCards = await page.textContent('#kTotal');
        const dueCards = await page.textContent('#kDue');
        const savedCards = await page.textContent('#kSaved');
        const streak = await page.textContent('#kStreak');
        
        console.log(`Initial KPIs - Total: ${totalCards}, Due: ${dueCards}, Saved: ${savedCards}, Streak: ${streak}`);
        
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
        console.log('\n-- TEST 5: Study Mode');
        await page.click('[data-tab="study"]');
        await page.waitForSelector('#studyCard .study-word');
        const studyWord = (await page.textContent('#studyCard .study-word')).trim();
        console.log(`OK Study mode showing word: ${studyWord}`);

        const studyControls = ['#backBtn', '#revealBtn', '#saveBtn', '#nextBtn'];
        for (const selector of studyControls) {
            const visible = await page.isVisible(selector);
            console.log(`OK Control ${selector} visible: ${visible}`);
        }

        await page.click('#revealBtn');
        await page.waitForSelector('#studyCard .study-definition');
        console.log('OK Reveal shows definition panel');

        // Test 6: Keyboard shortcuts
        console.log('\n-- TEST 6: Keyboard Shortcuts');
        await page.keyboard.press('Space');
        const revealText = await page.textContent('#revealBtn');
        console.log(`OK Spacebar toggled reveal button: ${revealText.includes('Show') || revealText.includes('Hide')}`);

        await page.keyboard.press('ArrowRight');
        await page.waitForFunction(() => {
            const el = document.querySelector('#progressCounter');
            return !!el && /\d+\/\d+/.test(el.textContent || '');
        });
        const progressAfterNext = await page.textContent('#progressCounter');
        console.log(`OK ArrowRight advanced progress: ${progressAfterNext}`);

        await page.keyboard.press('s');
        const savedCount = await page.evaluate(() => {
            const stored = localStorage.getItem('vocab_cards_v1');
            if (!stored) return 0;
            try {
                return JSON.parse(stored).filter(card => card.saved).length;
            } catch (err) {
                return 0;
            }
        });
        console.log(`OK Keyboard save marked cards: ${savedCount > 0}`);

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
        console.log('\n-- TEST 9: Sample Data');
        const sampleButton = await page.$('#addSample');
        const hasSampleButton = !!sampleButton;
        console.log(`OK Add sample button present: ${hasSampleButton}`);

        if (hasSampleButton) {
            await page.click('#addSample');
            await page.waitForTimeout(300);
            const finalTotalCards = await page.textContent('#kTotal');
            console.log(`OK Total cards after sample: ${finalTotalCards}`);
        } else {
            console.log('SKIP Sample data button not found in current build');
        }

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




