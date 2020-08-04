const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withSASS = require("@zeit/next-sass");
require('dotenv').config({ path: '.env' });

const nextConfig = {
	env: {
		API_HOST: process.env.API_HOST
	}
}
module.exports = withPlugins([
  [withCSS],
  [withSASS, {
    cssModules: true
  }]
], nextConfig);
