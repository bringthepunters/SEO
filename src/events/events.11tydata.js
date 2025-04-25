const API_BASE = "https://api.lml.live/gigs/query?location=melbourne";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

module.exports = async function () {
  const fetch = (await import('node-fetch')).default;

  // Get today and the next 3 days
  const today = new Date();
  const days = [0, 1, 2, 3].map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d;
  });

  const date_from = formatDate(days[0]);
  const date_to = formatDate(days[3]);

  const API_URL = `${API_BASE}&date_from=${date_from}&date_to=${date_to}`;

  let events = [];
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // Expecting data to be an array of event objects
    events = (Array.isArray(data) ? data : data?.results || []).map(event => ({
      name: event.name || "",
      ticket_link: event.ticketing_link || event.url || "",
      venue: event.venue || "",
      start_time: event.start_time || "",
      address: event.address || "",
      genres: event.genre_tags || event.genres || [],
      date: (event.start_time || "").split("T")[0], // YYYY-MM-DD
      raw: event
    }));
  } catch (err) {
    console.error("Failed to fetch events from lml.live API:", err);
  }

  // Group events by date (YYYY-MM-DD)
  const eventsByDate = {};
  for (const d of days) {
    const key = formatDate(d);
    eventsByDate[key] = [];
  }
  for (const event of events) {
    if (eventsByDate[event.date]) {
      eventsByDate[event.date].push(event);
    }
  }

  // Return both the grouped events and the day keys (for column order)
  return {
    eventsByDate,
    dayKeys: days.map(formatDate),
    days: days.map(d => ({
      date: formatDate(d),
      label: d.toLocaleDateString("en-AU", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    }))
  };
};