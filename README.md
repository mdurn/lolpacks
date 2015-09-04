# LoLPacks

http://lolpacks.com

LoLPacks is a source for downloading League of Legends item sets derived from known sources. There are many great resources for League of Legends builds around the web, but many don't yet provide downloads for item sets. These item sets can easily be dropped into a summoner's champion config directories without having to build them manually in the game. As a prototype, the item sets available here are derived from LoLPro, a trusted source for quality builds. Just click on a champion, choose a build from the dropdown, and click the download button. The source of the build is linked below the dropdown.

Champion and item data are pulled from the Riot Games API. That data is used along with champion builds from LoLPro in order to build the downloadable json files dynamically.

The API static champion data is also used to generate a sprite for the full sized champion images. Additionally, the item data from the API is used to display item images for the item sets as well as descriptions when hovering over each item image.

The tech used to build this are Node.js, Express, MongoDB, and React. ES6 (and some ES7) javascript standards are used, using Babel to compile to ES5.

**Installing the JSON files**

After downloading the json file, place it into correct League of Legends *Config* directory. In the *Config* directory, the file can either be placed in *Global/Recommended* to be available for all champions or in the *Recommended* folder of a specific champion. These folders can be created if they are not already there.

*Config Directory On Mac*: Open the */Applications* directory, right click on *League of Legends*, and select "Show Package Contents". Then, go to the *Contents/LOL/Config* directory.

*Config Directory On Windows*: Go to *C:\Riot Games\League of Legends\Config*.

---
*LoLPacks isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.*
