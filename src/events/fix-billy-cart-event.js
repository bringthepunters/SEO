// Script to find and fix the Billy Cart event with invalid date format
const fs = require('fs');
const path = require('path');

// Path to the built event file
const eventPath = path.join(__dirname, '..', '..', '_site', 'events', 'billy-cart', 'index.html');


// Function to fix the file
async function fixBillyCartEvent() {
  try {
    // Check if the file exists
    if (!fs.existsSync(eventPath)) {
      console.log(`File doesn't exist at: ${eventPath}`);
      
      // Try to find the actual file by listing directory
      const eventsDir = path.join(__dirname, '..', '..', '_site', 'events');
      const files = fs.readdirSync(eventsDir);
      const billyCartFile = files.find(file => file.includes('billy-cart'));
      
      if (billyCartFile) {
        console.log(`Found possible Billy Cart event at: ${path.join(eventsDir, billyCartFile)}`);
      } else {
        console.log('Could not find any file matching "billy-cart"');
        return;
      }
    }
    
    // Read the file content
    const htmlContent = fs.readFileSync(eventPath, 'utf8');
    
    // Find the JSON-LD script in the HTML
    const scriptMatch = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    
    if (!scriptMatch) {
      console.log('Could not find JSON-LD script in the file');
      return;
    }
    
    const jsonLd = scriptMatch[1];
    
    // Parse the JSON
    let jsonObj;
    try {
      jsonObj = JSON.parse(jsonLd);
    } catch (error) {
      console.log('Error parsing JSON:', error.message);
      return;
    }
    
    // Check and fix the startDate
    if (jsonObj.startDate && jsonObj.startDate.includes('T+10:00')) {
      console.log(`Found invalid date format: ${jsonObj.startDate}`);
      
      // Fix the date format by adding a default time
      jsonObj.startDate = jsonObj.startDate.replace('T+10:00', 'T00:00+10:00');
      console.log(`Fixed date format: ${jsonObj.startDate}`);
      
      // Replace the JSON-LD in the HTML
      const fixedJsonLd = JSON.stringify(jsonObj, null, 2);
      const fixedHtml = htmlContent.replace(scriptMatch[0], 
        `<script type="application/ld+json">${fixedJsonLd}</script>`);
      
      // Write the fixed HTML back to the file
      fs.writeFileSync(eventPath, fixedHtml, 'utf8');
      console.log('Successfully updated the file');
    } else {
      console.log('StartDate format is already correct or has a different issue');
      console.log(`Current startDate: ${jsonObj.startDate}`);
    }
  } catch (error) {
    console.error('Error fixing Billy Cart event:', error);
  }
}

// Run the function
fixBillyCartEvent().then(() => {
  console.log('Script execution completed');
});