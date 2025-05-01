// .eleventy.js
module.exports = function(eleventyConfig) {
  // Exclude internal documentation files from the build output
  eleventyConfig.ignores.add("ONBOARDING.md");
  eleventyConfig.ignores.add("PROJECT_PLAN.md");
  eleventyConfig.ignores.add("SMOKE_TESTS.md");
  eleventyConfig.ignores.add("stories.txt");
  eleventyConfig.ignores.add("approach.md");

  // Add a collection for events
  eleventyConfig.addCollection("events", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/events/*.md");
  });

  // Add a collection for all API events (for detail pages)
  eleventyConfig.addCollection("allEvents", async function(collectionApi) {
    // Import the event data from the 11ty data file
    const eventsData = require("./src/events/events.11tydata.js");
    const data = await eventsData();
    // Flatten all events into a single array
    let all = [];
    // Support both old and new data structures for compatibility
    if (data.eventsByDateLocality) {
      for (const day of data.dayKeys) {
        if (data.eventsByDateLocality[day]) {
          for (const group of data.eventsByDateLocality[day]) {
            all = all.concat(group.events);
          }
        }
      }
    } else if (data.eventsByDate) {
      for (const day of data.dayKeys) {
        if (data.eventsByDate[day]) {
          all = all.concat(data.eventsByDate[day]);
        }
      }
    }
    return all;
  });

  // Add a collection for all genres and their events
  eleventyConfig.addCollection("genres", async function(collectionApi) {
    // Get all API events
    const eventsData = require("./src/events/events.11tydata.js");
    const data = await eventsData();
    let all = [];
    if (data.eventsByDateLocality) {
      for (const day of data.dayKeys) {
        if (data.eventsByDateLocality[day]) {
          for (const group of data.eventsByDateLocality[day]) {
            all = all.concat(group.events);
          }
        }
      }
    } else if (data.eventsByDate) {
      for (const day of data.dayKeys) {
        if (data.eventsByDate[day]) {
          all = all.concat(data.eventsByDate[day]);
        }
      }
    }
    // Build genre map: { genreSlug: { name, slug, events: [] } }
    const genreMap = {};
    for (const event of all) {
      if (Array.isArray(event.genres)) {
        for (const genre of event.genres) {
          const slug = genre
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          if (!genreMap[slug]) {
            genreMap[slug] = { name: genre, slug, events: [] };
          }
          genreMap[slug].events.push(event);
        }
      }
    }
    // Return as array for pagination/templates
    return Object.values(genreMap);
  });
// Ensure logo.png is copied to the site root for correct referencing
  eleventyConfig.addPassthroughCopy({ "public/logo.png": "logo.png" });
  
  // Copy Google Search Console verification file to site root
  eleventyConfig.addPassthroughCopy({ "googlea29830ca421c283c.html": "googlea29830ca421c283c.html" });

  // Add a filter to humanize dates in Melbourne timezone
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("humanDateLabel", function(dateString) {
    // Parse date in Melbourne timezone
    const melTz = "Australia/Melbourne";
    const now = DateTime.now().setZone(melTz).startOf("day");
    const date = DateTime.fromISO(dateString, { zone: melTz }).startOf("day");
    const diff = date.diff(now, "days").toObject().days;

    // "tonight" = today, "tomorrow" = tomorrow
    if (diff === 0) return "tonight";
    if (diff === 1) return "tomorrow";

    // "this weekend" = next Fri/Sat/Sun
    const weekday = date.weekday; // 5=Fri, 6=Sat, 7=Sun
    const isThisWeekend = (weekday >= 5 && weekday <= 7) &&
      (date >= now && date <= now.plus({ days: 6 }));
    if (isThisWeekend) return "this weekend";

    // Otherwise, return formatted date (e.g., "Wed 30 Apr")
    return date.toFormat("ccc d LLL");
  });

  // Add a filter to get today's date in Melbourne timezone as "yyyy-MM-dd"
  eleventyConfig.addFilter("todayMelbourne", function() {
    return DateTime.now().setZone("Australia/Melbourne").toFormat("yyyy-MM-dd");
  });

  // Add a filter to get the day name in Melbourne timezone from a date string
  eleventyConfig.addFilter("dayNameMelbourne", function(dateString) {
    if (!dateString) return "";
    return DateTime.fromISO(dateString, { zone: "Australia/Melbourne" }).toFormat("cccc");
  });

  // Optionally, set input/output directories if you want to further isolate content
  return {
    addAllPagesToCollections: true,
    dir: {
      input: "src",    // Use /src as input directory
      output: "_site"  // Default output directory
    }
  };
};