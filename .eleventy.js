// .eleventy.js
module.exports = function(eleventyConfig) {
  // Exclude internal documentation files from the build output
  eleventyConfig.ignores.add("ONBOARDING.md");
  eleventyConfig.ignores.add("PROJECT_PLAN.md");
  eleventyConfig.ignores.add("SMOKE_TESTS.md");
  eleventyConfig.ignores.add("stories.txt");
  eleventyConfig.ignores.add("approach.md");

  // Optionally, set input/output directories if you want to further isolate content
  return {
    dir: {
      input: ".",      // Project root as input
      output: "_site"  // Default output directory
    }
  };
};