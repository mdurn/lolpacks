import models from '../models';
import lolproScraper from './lolproScraper';

let _upsertChampionGuide = (guide) => {
  models.ChampionGuide.find({
    name: guide.name
  }, (err, docs) => {
    if (docs.length) {
      let doc = docs[0];
      doc.lolproUri = guide.lolproUri;
      doc.views = guide.views;
      doc.votes = guide.votes;
      doc.save();
    } else {
      models.ChampionGuide.create(guide);
    }
  });
};

let lolproDataLoader = {
  updateChampions: () => {
    return new Promise((resolve, reject) => {
      lolproScraper.champions().then((champions) => {
        champions.forEach((champion) => {
          models.Champion.findOne({name: champion.name}, (err, doc) => {
            doc.lolproUri = champion.lolproUri;
            doc.save();
          });
        });
        resolve();
      });
    });
  },

  updateChampionGuides: () => {
    return new Promise((resolve, reject) => {
      models.Champion.find((err, docs) => {
        for (let doc of docs) {
          lolproScraper.guides(doc.lolproUri).then((guides) => {
            guides.forEach((guide) => {
              guide._championId = doc._id;
              _upsertChampionGuide(guide);
            });
          });
        }
        resolve();
      });
    });
  },

  updateChampionBuild: (championGuide) => {
    return new Promise((resolve, reject) => {
      lolproScraper.build(`${championGuide.lolproUri}/item-build`).then((itemSets) => {
        models.ItemSet.remove({_championGuideId: championGuide._id}, () => {
          itemSets.forEach((set, i) => {
            set._championGuideId = championGuide._id;
            set.index = i;
            models.ItemSet.create(set);
          });
          resolve();
        });
      });
    });
  }
};

export default lolproDataLoader;