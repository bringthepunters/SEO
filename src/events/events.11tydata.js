const API_BASE = "https://api.lml.live/gigs/query?location=melbourne";

// Helper to get date in Australia/Melbourne timezone as YYYY-MM-DD
function getMelbourneDate(offset = 0) {
  // Use UTC+10:00 for Australia/Melbourne (no DST handling for simplicity)
  const now = new Date();
  // Convert to Melbourne time by adding the offset from UTC
  const melOffset = 10 * 60; // minutes
  const local = new Date(now.getTime() + (now.getTimezoneOffset() + melOffset) * 60000);
  local.setDate(local.getDate() + offset);
  return local.toISOString().split("T")[0];
}

module.exports = async function () {
  const fetch = (await import('node-fetch')).default;

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
        raw: event
      };
    });
  } catch (err) {
    console.error("Failed to fetch events from lml.live API:", err);
  }

  // Group events by date (YYYY-MM-DD)
  const eventsByDate = {};
  for (const d of days) {
    eventsByDate[d] = [];
  }
  for (const event of events) {
    if (eventsByDate[event.date]) {
      eventsByDate[event.date].push(event);
    }
  }

  // Return both the grouped events and the day keys (for column order)
  return {
    eventsByDate,
    dayKeys: days,
    days: days.map(d => ({
      date: d,
      label: new Date(d).toLocaleDateString("en-AU", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
    }))
  };
};