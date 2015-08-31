# LoLPacks

http://lolpacks.herokuapp.com


- LolPacks is a source for downloading League of Legends item sets derived from known sources. There are many great resources for League of Legends builds around the web, but many don't yet provide downloads for item sets. These item sets can easily be dropped into a summoner's champion config directories without having to build them manually in the game. As a prototype, the item sets available here are derived from LoLPro, a trusted source for quality builds.

- Champion and item data are pulled from the Riot Games API. That data is used along with champion builds from LoLPro in order to build the downloadable json files.

- The tech used to build this are Node.js, Express, MongoDB, and React. ES6 (and some ES7) javascript standards are used, using Babel to compile to ES5.