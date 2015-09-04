import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import riotDataLoader from './utils/riotDataLoader';
import lolproDataLoader from './utils/lolproDataLoader';
import spriteCreator from './utils/SpriteCreator';

const db = mongoose.connection;
var models = {};

const uristring = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/lolpacks_dev';

db.on('error', console.error);

db.once('open', function() {
  let ChampionSchema = new mongoose.Schema({
    riotId: Number,
    key: String,
    name: String,
    image: {
      w: Number,
      full: String,
      sprite: String,
      group: String,
      h: Number,
      y: Number,
      x: Number
    },
    lolproUri: String
  });
  ChampionSchema.plugin(timestamps);
  ChampionSchema.index({key: 1});
  ChampionSchema.index({name: 1});

  let ItemSchema = new mongoose.Schema({
    riotId: Number,
    name: String,
    description: String,
    image: {
      w: Number,
      full: String,
      sprite: String,
      group: String,
      h: Number,
      y: Number,
      x: Number
    },
    gold: {
      total: Number,
      purchaseable: Boolean,
      sell: Number,
      base: Number
    },
    from: [Number]
  });
  ItemSchema.plugin(timestamps);
  ItemSchema.index({riotId: 1});
  ItemSchema.index({name: 1});

  let ChampionGuideSchema = new mongoose.Schema({
    name: String,
    lolproUri: String,
    views: Number,
    votes: Number,
    _championId: mongoose.Schema.Types.ObjectId
  });
  ChampionGuideSchema.plugin(timestamps);
  ChampionGuideSchema.index({_championId: 1});
  ChampionGuideSchema.index({name: 1});

  let ItemSetSchema = new mongoose.Schema({
    name: String,
    index: Number,
    itemNames: [String],
    _championGuideId: mongoose.Schema.Types.ObjectId
  });
  ItemSetSchema.plugin(timestamps);
  ItemSetSchema.index({name: 1});
  ItemSetSchema.index({_championGuideId: 1});

  models.Champion = mongoose.model('Champion', ChampionSchema);
  models.Item = mongoose.model('Item', ItemSchema);
  models.ChampionGuide = mongoose.model('ChampionGuide', ChampionGuideSchema);
  models.ItemSet = mongoose.model('ItemSet', ItemSetSchema);

  if (process.env.REFRESH_MODELS === 'true') {
    riotDataLoader.loadItems();
    riotDataLoader.loadChampions().
      then(lolproDataLoader.updateChampions()).
      then(lolproDataLoader.updateChampionGuides()).
      then(() => {
        models.ChampionGuide.find((err, guides) => {
          let guideCount = 0;
          let delayedUpdate = (guide) => {
            setTimeout(() => {
              lolproDataLoader.updateChampionBuild(guides[guideCount]);
              guideCount++;
              if (guideCount < guides.length) { delayedUpdate(); }
            }, 3000);
          }
          delayedUpdate();
        });
      });
  }

  if (process.env.NODE_ENV === 'production') {
    spriteCreator.createChampionSprite();
  }

  // Create your schemas and models here.
});

mongoose.connect(uristring);

export default models;
