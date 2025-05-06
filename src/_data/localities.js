const slugify = str =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

module.exports = async function() {
  // Import the events data
  const eventsData = require('../events/events.11tydata.js');
  const { eventsByDateLocality } = await eventsData();

  // Flatten all events across all days and localities
  const allEvents = [];
  for (const day of Object.values(eventsByDateLocality)) {
    for (const group of day) {
      for (const event of group.events) {
        allEvents.push(event);
      }
    }
  }

  // Group events by locality (normalize case to prevent duplicate headings)
  const localityMap = {};
  for (const event of allEvents) {
    let name = event.locality || 'Other';
    // Normalize the display name - use title case for display
    const displayName = name.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    const slug = slugify(name);
    if (!localityMap[slug]) {
      localityMap[slug] = { name: displayName, slug, gigs: [] };
    }
    localityMap[slug].gigs.push(event);
  }

  // Return as an array
  return Object.values(localityMap).sort((a, b) => a.name.localeCompare(b.name));
};