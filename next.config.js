const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withSASS = require("@zeit/next-sass");

module.exports = withPlugins([
  [withCSS],
  [withSASS, {
    cssModules: true
  }]
]);
