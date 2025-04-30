const eventsData = require("./events.11tydata.js");

module.exports = async function() {
  const data = await eventsData();
  // For each date in dayKeys, create a page
  return data.dayKeys.map(date => ({
    date,
    eventsByLocality: data.eventsByDateLocality[date],
    permalink: `/events/date/${date}/index.html`
  }));
};