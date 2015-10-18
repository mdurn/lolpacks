import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';
import easyzip from 'easy-zip';
import models from '../models';

let EasyZip = easyzip.EasyZip;
let appRoot = path.resolve(__dirname);
let publicPath = `${appRoot}/public`;
let tmpDir = `${appRoot}/tmp/Champions`;

let zipCreator = {
  createBuildsZip: () => {
    mkdirp.sync(tmpDir);

    let championsCount = 0;
    models.Champion.find().sort({key: 1}).exec((err, champions) => {
      champions.forEach((champion) => {
        let championPath = `${tmpDir}/${champion.key}/Recommended`;
        mkdirp.sync(championPath);

        let guidesCount = 0;
        models.ChampionGuide.find({_championId: champion._id}, (err, guides) => {
          guides.forEach((guide) => {

            let json = {
              title: guide.name,
              type: 'custom',
              map: 'any',
              blocks: []
            };

            let setCount = 0;
            models.ItemSet.find({_championGuideId: guide._id}).sort({index: 1}).exec((err, itemSets) => {
              itemSets.forEach((itemSet) => {
                models.Item.find({ name: { $in: itemSet.itemNames }}, (err, items) => {
                  let itemsJson = items.map((item) => { return {'id' : String(item.riotId), 'count' : 1}; });
                  json.blocks.push({
                    type: itemSet.name,
                    items: itemsJson
                  });

                  if (++setCount === itemSets.length) {
                    fs.writeFile(`${championPath}/${guide.name}.json`, JSON.stringify(json), () => {
                      if (++guidesCount === guides.length) {
                        if (++championsCount === champions.length) {
                          let zip = new EasyZip();
                          zip.zipFolder(tmpDir,function(){
                            zip.writeToFile(`${publicPath}/itemsets.zip`);
                          });
                        }
                      }
                    });
                  }
                });
              });
            });
          })
        });
      });
    });
  }
};

export default zipCreator;