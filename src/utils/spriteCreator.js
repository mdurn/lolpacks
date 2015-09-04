import mkdirp from 'mkdirp';
import http from 'http';
import fs from 'fs';
import models from '../models';
import sprite from 'node-sprite';
import path from 'path';

let appRoot = path.resolve(__dirname);
let publicPath = `${appRoot}/public`;
let tmpDir = `${appRoot}/tmp/images`;

let _storeChampionImages = () => {
  mkdirp.sync(`${tmpDir}/champions`);

  return new Promise((resolve, reject) => {
    models.Champion.find().sort({key: 1}).exec((err, champions) => {
      let count = 0;
      champions.forEach((champion) => {
        let file = fs.createWriteStream(`${tmpDir}/champions/${champion.key}.png`);
        let request = http.get('http://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/' + champion.image.full, function(response) {
          response.pipe(file);
          if (++count == champions.length) { resolve(); }
        });
      });
    });
  });
};


let spriteCreator = {
  createChampionSprite: () => {
    _storeChampionImages().then(() => {
      sprite.sprite('champions', {path: tmpDir}, function(err, championSprite) {
        let spriteFilePath = `${tmpDir}/${championSprite.name}-${championSprite.shortsum()}.png`;
        fs.rename(spriteFilePath, `${publicPath}/champions.png`);

        championSprite.images.forEach((image) => {
          models.Champion.findOne({key: image.name}, (err, champion) => {
            champion.image.sprite = 'champions.png';
            champion.image.x = image.positionX;
            champion.image.y = image.positionY;
            champion.image.w = image.width;
            champion.image.h = image.height;

            champion.save();
          });
        });
      });
    });
  }
};

export default spriteCreator;
