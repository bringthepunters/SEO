module.exports = function() {
  return {
    timestamp: new Date().toISOString(),
    buildDate: new Date().toLocaleDateString('en-AU'),
    buildTime: new Date().toLocaleTimeString('en-AU')
  };
};