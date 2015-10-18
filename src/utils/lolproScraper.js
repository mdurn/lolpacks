import request from 'request';
import cheerio from 'cheerio';

const lolproBaseUri = 'http://www.lolpro.com';

const ITEM_MAP = {
  'Zeke\'s Herald': 'Zeke\'s Harbinger'
}

let _translateItem = (name) => {
  return ITEM_MAP[name] || name;
}

let lolproScraper = {
  champions: () => {
    return new Promise((resolve, reject) => {
      request(lolproBaseUri, (err, resp, body) => {
        let parser = cheerio.load(body);
        let aTags = parser('.p-base-content li.b-list-item a');
        let champions = [];

        aTags.each((i, elem) => {
          let name = parser(elem).find('.caption.name').text();
          let uri = lolproBaseUri + elem.attribs.href;

          champions.push({name: name, lolproUri: uri});
        });
        resolve(champions);
      });
    });
  },

  guides: (championUri) => {
    return new Promise((resolve, reject) => {
      request(championUri, (err, resp, body) => {
        let parser = cheerio.load(body);
        let guidesContainer = parser('.guides-container')[0];
        let guideEls = parser(guidesContainer).find('a');

        let guides = [];

        parser(guideEls).each((i, elem) => {
          let viewParser = parser('.vote-view-container', elem);
          let name = parser(elem).find('.guide-title').text();
          let uri = elem.attribs.href; 
          let views = viewParser.find('.view-total').text();
          views = Number(views.split(' ')[0].replace(/,/g, ''));
          let votes = Number(viewParser.find('.vote-total').text());

          guides.push({
            name: name,
            lolproUri: uri,
            views: views,
            votes: votes
          });
        });
        resolve(guides);
      });
    });
  },

  build: (buildUri) => {
    return new Promise((resolve, reject) => {
      request(buildUri, (err, resp, body) => {
        let parser = cheerio.load(body);
        var buildEls = parser('h2, h3, .b-list-title', '.tab-item-build');

        let itemSets = [];

        let h2Text = null;
        let h3Text = null;
        let h4Text = null;
        let isNewItemSet = true;

        for (let i = 0; i < buildEls.length; i++) {
          let key = String(i);
          let text = parser(buildEls[key]).text();
          if (buildEls[key].name === 'h2') {
            h2Text = text;
            h3Text = null;
            h4Text = null;
            isNewItemSet = true;
          } else if (buildEls[key].name === 'h3') {
            h3Text = text;
            h4Text = null;
            isNewItemSet = true;
          } else if (buildEls[key].name === 'h4') {
            h4Text = text;
            isNewItemSet = true;
          } else {
            if (isNewItemSet) {
              let name = [h2Text, h3Text, h4Text].filter((val) => { return val; }).join(' - ');
              itemSets.push({
                name: name.trim(),
                itemNames: [_translateItem(text)]
              });
            } else {
              itemSets[itemSets.length - 1].itemNames.push(_translateItem(text));
            }
            isNewItemSet = false;
          }
        }

        resolve(itemSets);
      });
    });
  }
}

export default lolproScraper;
