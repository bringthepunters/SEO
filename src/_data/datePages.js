const eventsData = require("../events/events.11tydata.js");

module.exports = async function() {
  const data = await eventsData();
  return data.dayKeys.map(date => ({
    date,
    eventsByLocality: data.eventsByDateLocality[date]
  }));
};