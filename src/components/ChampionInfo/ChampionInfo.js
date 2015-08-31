/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './ChampionInfo.css';
import withStyles from '../../decorators/withStyles';
import http from '../../core/http';

@withStyles(styles)
class ChampionInfo extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    championId: PropTypes.string
  };

  constructor() {
    super();
    this.state = {
      guides: [],
      selectedGuide: {},
      buildJson: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    let self = this;
    if (nextProps.championId) {
      http.get(`/api/championguides.json?id=${nextProps.championId}`).
        then((championGuides) => {
          self.setState({
            guides: championGuides,
            selectedGuide: championGuides[0],
            buildJson: this._buildJson(championGuides[0])
          });
        });
    }
  }

  _selectedGuideChanged(e) {
    let filteredGuides = this.state.guides.filter((guide) => {
      return guide._id === e.target.value;
    });

    this.setState({
      selectedGuide: filteredGuides[0],
      buildJson: this._buildJson(filteredGuides[0])
    });
  }

  _buildJson(championGuide) {
    let blocks = [];

    for (var i = 0; i < championGuide.itemSets.length; i++) {
      let itemSet = championGuide.itemSets[String(i)];
      let items = itemSet.items.map((item) => { return {'id' : String(item.riotId), 'count' : 1}; });

      blocks.push({
        'type': itemSet.name,
        'recMath': false,
        'minSummonerLevel': -1,
        'maxSummonerLevel': -1,
        'showIfSummonerSpell': '',
        'hideIfSummonerSpell': '',
        'items': items
      });
    }

    return {
      'title': championGuide.name,
      'type': 'custom',
      'map': 'any',
      'mode': 'any',
      'priority': false,
      'sortrank': 0,
      'blocks': blocks
    };
  }

  _renderChampionGuides() {
    let options = [];
    let guides = this.state.guides;
    guides.forEach((guide, i) => {
      options.push(
        <option key={i} value={guide._id}>{guide.name}</option>
      );
    });

    return (
      <div>
        <select value={this.state.selectedGuide._id} onChange={this._selectedGuideChanged.bind(this)}>
          {options}
        </select>
        <a href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.buildJson))} download={this.state.selectedGuide.name + '.json'}><button className="guide-button" type="button">Download Build</button></a>
        <div className="guide-info">
          Source: <a href={this.state.selectedGuide.lolproUri} className="guide-source">{this.state.selectedGuide.lolproUri}</a>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div id={'ChampionInfo-' + this.props.index} className="ChampionInfo">
        <div className="ChampionInfo-container">
          {this._renderChampionGuides()}
        </div>
      </div>
    );
  }

}

export default ChampionInfo;