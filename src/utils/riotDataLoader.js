import riotApi from './riotApi';
import models from '../models';

let _updateOrCreateChampion = (champion) => {
  models.Champion.find({
    key: champion.key
  }, (err, docs) => {
    if (docs.length) {
      let doc = docs[0];
      doc.name = champion.name;
      doc.image = champion.image;
      doc.save();
    } else {
      models.Champion.create({
        riotId: champion.id,
        key: champion.key,
        name: champion.name,
        image: champion.image
      });
    }
  });
};

let _updateOrCreateItem = (item) => {
  item.from = item.from || [];
  models.Item.find({
    riotId: item.id
  }, (err, docs) => {
    if (docs.length) {
      let doc = docs[0];
      doc.name = item.name;
      doc.description = item.description;
      doc.image = item.image;
      doc.gold = item.gold;
      doc.from = item.from.map(function(id) { return Number(id); });
      doc.save();
    } else {
      models.Item.create({
        riotId: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        gold: item.gold,
        from: item.from.map(function(id) { return Number(id); })
      });
    }
  });
};


let riotDataLoader = {
  loadChampions: () => {
    return new Promise((resolve, reject) => {
      let cb = (respBody) => {
        let data = respBody.data;
        for (let champion in data) {
          if (data.hasOwnProperty(champion)) {
            _updateOrCreateChampion(data[champion]);
          }
        }
        resolve();
      };

      riotApi.champions(cb);
    });
  },

  loadItems: () => {
    return new Promise((resolve, reject) => {
      let cb = (respBody) => {
        let data = respBody.data;
        for (let item in data) {
          if (data.hasOwnProperty(item)) {
            _updateOrCreateItem(data[item]);
          }
        }
        resolve();
      };

      riotApi.items(cb);
    });
  }
};

export default riotDataLoader;
