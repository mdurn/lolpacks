import request from 'request';
const API_KEY = process.env.RIOT_API_KEY;

let riotApi = {
  items: (cb) => {
    let base = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item';
    let params = `?api_key=${API_KEY}&itemListData=from,gold,image`;
    request(`${base}${params}`, (err, resp, body) => {
      if (typeof(cb) === 'function') { cb(JSON.parse(body)); }
    });
  },

  champions: (cb) => {
    let base = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion';
    let params = `?api_key=${API_KEY}&champData=image`;
    request(`${base}${params}`, (err, resp, body) => {
      if (typeof(cb) === 'function') { cb(JSON.parse(body)); }
    });
  }
};

export default riotApi;