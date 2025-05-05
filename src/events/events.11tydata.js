const API_BASE = "https://api.lml.live/gigs/query?location=melbourne";

// Helper to get date in Australia/Melbourne timezone as YYYY-MM-DD
function getMelbourneDate(offset = 0) {
  // Use Intl.DateTimeFormat to get the current date in Melbourne timezone
  // This handles DST automatically without requiring external libraries
  const now = new Date();
  
  // Format the date in Melbourne timezone
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Get components and build YYYY-MM-DD format
  const parts = formatter.formatToParts(now);
  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;
  
  // Create a date string and then add the offset
  const dateParts = [year, month, day].join('-');
  
  // Handle the offset by creating a new date and adjusting it
  const baseDate = new Date(`${dateParts}T00:00:00+10:00`); // Use any timezone, we'll format again
  baseDate.setDate(baseDate.getDate() + offset);
  
  // Format the offset date
  const offsetFormatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const offsetParts = offsetFormatter.formatToParts(baseDate);
  const offsetYear = offsetParts.find(part => part.type === 'year').value;
  const offsetMonth = offsetParts.find(part => part.type === 'month').value;
  const offsetDay = offsetParts.find(part => part.type === 'day').value;
  
  return `${offsetYear}-${offsetMonth}-${offsetDay}`;
}

const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const fetch = (await import('node-fetch')).default;

  // --- Load and parse loc-postcodes.csv ---
  const postcodeToLocality = {};
  try {
    const csvPath = path.join(__dirname, '..', '..', 'loc-postcodes.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n').map(l => l.trim()).filter(Boolean);
    // Skip header, handle possible quotes
    for (let i = 1; i < lines.length; i++) {
      const [postcodeRaw, ...localityParts] = lines[i].split(',');
      const postcode = postcodeRaw.replace(/[^0-9]/g, '');
      const locality = localityParts.join(',').replace(/(^"|"$)/g, '').trim();
      if (postcode && locality) {
        postcodeToLocality[postcode] = locality;
      }
    }
  } catch (err) {
    console.error("Failed to read loc-postcodes.csv:", err);
  }

  // Get today and the next 3 days in Melbourne time
  const days = [0, 1, 2, 3].map(getMelbourneDate);

  const date_from = days[0];
  const date_to = days[3];

  const API_URL = `${API_BASE}&date_from=${date_from}&date_to=${date_to}`;

  let events = [];
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // API returns an array of event objects
    // Track slugs to ensure uniqueness
    const slugCounts = {};
    events = (Array.isArray(data) ? data : []).map(event => {
      // Extract postcode from address (4 consecutive digits)
      let postcode = '';
      let locality = '';
      if (event.venue?.address) {
        // Try to extract postcode (4 digits at end of string)
        const match = event.venue.address.match(/(\d{4})(?!.*\d{4})/);
        if (match) postcode = match[1];
        // Map postcode to locality
        if (postcodeToLocality[postcode]) {
          locality = postcodeToLocality[postcode];
        } else {
          // Fallback: try to extract locality name from address (e.g., "Fitzroy VIC 3065" or "Fitzroy 3065")
          const locMatch = event.venue.address.match(/,\s*([A-Za-z\s]+)\s+VIC\s*\d{4}/i) ||
                           event.venue.address.match(/,\s*([A-Za-z\s]+)\s+\d{4}/i) ||
                           event.venue.address.match(/([A-Za-z\s]+)\s+VIC\s*\d{4}/i) ||
                           event.venue.address.match(/([A-Za-z\s]+)\s+\d{4}/i);
          if (locMatch && locMatch[1]) {
            locality = locMatch[1].trim().toUpperCase();
          }
        }
      }
      if (!locality) {
        locality = "Other";
      }
      // Generate a base slug from the event name
      let baseSlug = (event.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      // Append start_time to ensure uniqueness
      const timePart = event.start_time ? "-" + event.start_time.replace(/[^0-9a-zA-Z]/g, "") : "";
      let slug = baseSlug + timePart;
      // If still not unique, append a count
      if (slugCounts[slug]) {
        slugCounts[slug]++;
        slug += "-" + slugCounts[slug];
      } else {
        slugCounts[slug] = 1;
      }
      return {
        name: event.name || "",
        id: event.id || "",
        slug,
        ticket_link: event.ticketing_url || "",
        venue: event.venue?.name || "",
        venue_location_url: event.venue?.location_url || "",
        address: event.venue?.address || "",
        start_time: event.start_time || "",
        end_time: event.end_time || "",
        formatted_time: event.start_time || "",
        genres: event.genre_tags || [],
        date: event.date || "",
        information: event.information || "",
        price: event.price || "",
        sets: event.sets || [],
        locality,
        postcode,
        raw: event
      };
    });
  } catch (err) {
    console.error("Failed to fetch events from lml.live API:", err);
  }

  // Group events by date (YYYY-MM-DD) and then by locality
  const eventsByDate = {};
  for (const d of days) {
    eventsByDate[d] = {};
  }
  
  // Debug: Log some events data to check format
  console.log("Days format:", days);
  console.log("First 5 events date format:", events.slice(0, 5).map(e => ({
    name: e.name,
    date: e.date,
    locality: e.locality,
    venue: e.venue
  })));
  console.log("Total events:", events.length);
  
  let matchingDateCount = 0;
  let nonMatchingDateCount = 0;
  
  for (const event of events) {
    // Check if the event date is one of our expected dates
    if (days.includes(event.date)) {
      matchingDateCount++;
      const loc = event.locality || "Other";
      if (!eventsByDate[event.date][loc]) {
        eventsByDate[event.date][loc] = [];
      }
      eventsByDate[event.date][loc].push(event);
    } else {
      nonMatchingDateCount++;
      console.log("Event with non-matching date:", event.name, event.date, "Expected one of:", days);
    }
  }
  
  console.log("Events with matching dates:", matchingDateCount);
  console.log("Events with non-matching dates:", nonMatchingDateCount);

  // For each day, create an array of { locality, events } sorted by locality name
  const eventsByDateLocality = {};
  for (const d of days) {
    const locs = Object.keys(eventsByDate[d]).sort((a, b) => a.localeCompare(b));
    eventsByDateLocality[d] = locs.map(loc => ({
      locality: loc,
      events: eventsByDate[d][loc]
    }));
    console.log(`Day ${d} has ${locs.length} localities with events:`,
      eventsByDateLocality[d].map(g => `${g.locality}: ${g.events.length} events`));
  }

  // Return grouped events by date and locality, and the day keys (for column order)
  return {
    eventsByDateLocality,
    dayKeys: days,
    days: days.map(d => ({
      date: d,
      label: new Date(d).toLocaleDateString("en-AU", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
    }))
  };
};