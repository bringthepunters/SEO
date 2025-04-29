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

  // Optionally, set input/output directories if you want to further isolate content
  return {
    addAllPagesToCollections: true,
    dir: {
      input: "src",    // Use /src as input directory
      output: "_site"  // Default output directory
    }
  };
};