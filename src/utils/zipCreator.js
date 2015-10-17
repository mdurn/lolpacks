import mkdirp from 'mkdirp';
import fs from 'fs';
import models from '../models';
import path from 'path';

let appRoot = path.resolve(__dirname);
let publicPath = `${appRoot}/public`;
let tmpDir = `${appRoot}/tmp/Champions`;

let zipCreator = {
  createBuildsZip: () => {
    mkdirp.sync(tmpDir);

    models.Champion.find().sort({key: 1}).exec((err, champions) => {
      champions.forEach((champion) => {
        mkdirp.sync(`tmpDir/${champion.key}/Recommended`);
        //let file = fs.createWriteStream(`${tmpDir}/${champion.key}`);
      });
    });
  }
};

export default zipCreator;