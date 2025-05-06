// Script to validate JSON-LD Schema.org markup
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const eventsHtmlPath = path.join(__dirname, '_site', 'events', 'index.html');
const html = fs.readFileSync(eventsHtmlPath, 'utf8');

const dom = new JSDOM(html);
const document = dom.window.document;

// Extract all JSON-LD scripts
const scripts = document.querySelectorAll('script[type="application/ld+json"]');

console.log(`Found ${scripts.length} JSON-LD scripts on the page`);

scripts.forEach((script, index) => {
  console.log(`\nValidating JSON-LD script #${index + 1}:`);
  
  try {
    const jsonContent = script.textContent;
    const jsonObj = JSON.parse(jsonContent);
    console.log('✅ Valid JSON structure');
    
    // Analyze the content for Event schema
    if (jsonObj['@type'] === 'Event') {
      console.log('Event schema detected');
      
      // Check for required properties
      const requiredProps = ['name', 'startDate', 'location'];
      const missingProps = requiredProps.filter(prop => !jsonObj[prop]);
      
      if (missingProps.length > 0) {
        console.log(`❌ Missing required properties: ${missingProps.join(', ')}`);
      } else {
        console.log('✅ All required properties present');
      }
      
      // Validate startDate format (ISO 8601 date)
      if (jsonObj.startDate) {
        try {
          const date = new Date(jsonObj.startDate);
          if (isNaN(date.getTime())) {
            console.log(`❌ Invalid startDate format: ${jsonObj.startDate}`);
          } else {
            console.log(`✅ Valid startDate format: ${jsonObj.startDate}`);
          }
        } catch (e) {
          console.log(`❌ Invalid startDate format: ${jsonObj.startDate}`);
        }
      }
      
      // Check location structure
      if (jsonObj.location) {
        if (typeof jsonObj.location !== 'object') {
          console.log('❌ location must be an object');
        } else if (!jsonObj.location['@type']) {
          console.log('❌ location missing @type property');
        } else if (!jsonObj.location.name) {
          console.log('❌ location missing name property');
        } else {
          console.log('✅ Valid location object structure');
        }
      }
      
      // Check offers structure
      if (jsonObj.offers) {
        if (typeof jsonObj.offers !== 'object') {
          console.log('❌ offers must be an object');
        } else if (!jsonObj.offers['@type']) {
          console.log('❌ offers missing @type property');
        } else if (jsonObj.offers.price && (isNaN(jsonObj.offers.price) && !jsonObj.offers.price.match(/^\d+(\.\d+)?$/))) {
          console.log(`❌ offers.price must be a number or string representing a number, got: ${jsonObj.offers.price}`);
        } else {
          console.log('✅ Valid offers object structure');
        }
      }
      
      // Log all properties for inspection
      console.log('\nAll properties:');
      Object.entries(jsonObj).forEach(([key, value]) => {
        const valueString = typeof value === 'object' ? JSON.stringify(value) : value;
        console.log(`- ${key}: ${valueString}`);
      });
    } else {
      console.log(`Not an Event schema, found: ${jsonObj['@type']}`);
    }
    
  } catch (error) {
    console.log(`❌ Invalid JSON: ${error.message}`);
    console.log(`Raw content: ${script.textContent}`);
  }
});