/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import ReactDOM from 'react-dom/server';
import router from './router';
import models from './models';
import globals from './constants/globals';

const server = global.server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content'));

server.get('/api/champions.json', (req, res) => {
  models.Champion.find().sort({name: 1}).exec((err, docs) => {
    res.json(docs);
  });
});

server.get('/api/championguides.json', (req, res) => {
  let _guides = [];
  models.ChampionGuide.find({_championId: req.query.id}).sort({views: -1}).exec((err, guides) => {
    let guideCount = 0;
    guides.forEach((guide, i) => {
      models.ItemSet.find({_championGuideId: guide._id}).sort({index: 1}).exec((err, itemSets) => {
        let mappedItemSets = { length: itemSets.length };
        let itemSetCount = 0;

        itemSets.forEach((itemSet, j) => {
          let key = String(itemSet.index);
          models.Item.find({ name: { $in: itemSet.itemNames }}, (err, items) => {
            mappedItemSets[key] = {
              name: itemSet.name,
              index: itemSet.index,
              items: items,
              length: items.length
            };

            itemSetCount++;
            if (itemSetCount === itemSets.length) {
              _guides.push({
                _id: guide._id.valueOf(),
                name: guide.name,
                lolproUri: guide.lolproUri,
                views: guide.views,
                votes: guide.votes,
                _championId: guide._championId,
                itemSets: mappedItemSets
              });

              guideCount++;
              if (guideCount === guides.length) {
                res.json(_guides);
              }
            }
          });
        });
      });
    });
  });
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
const templateFile = path.join(__dirname, 'templates/index.html');
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', globals: globals };
    const css = [];
    const context = {
      onInsertCss: value => css.push(value),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404
    };

    await router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = template(data);
    res.status(statusCode).send(html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
