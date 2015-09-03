/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './ChampionInfo.css';
import withStyles from '../../decorators/withStyles';
import http from '../../core/http';
import jquery from 'jquery';

let $ = jquery;

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
      selectedGuide: { length: 0 },
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
        'items': items
      });
    }

    return {
      'title': championGuide.name,
      'type': 'custom',
      'map': 'any',
      'mode': 'any',
      'blocks': blocks
    };
  }

  _itemMouseOver(e) {
    let x = (e.pageX - e.target.offsetLeft + 24) + 'px';
    let y = (e.pageY - e.target.offsetTop + 24) + 'px';
    $(e.target).find('.championInfo-itemDesc').css({top: y, left: x}).show();
  }

  _itemMouseOut(e) {
    $(e.target).find('.championInfo-itemDesc').hide();
  }

  _itemMouseMove(e) {
    let x = (e.pageX - e.target.offsetLeft + 24) + 'px';
    let y = (e.pageY - e.target.offsetTop + 24) + 'px';
    $(e.target).find('.championInfo-itemDesc').css({top: y, left: x});
  }

  _renderChampionGuides() {
    let self = this;
    let guides = this.state.guides;
    guides = guides.sort((a, b) => { b.views - a.views; });
    let options = guides.map((guide, i) => {
      return <option key={i} value={guide._id}>{guide.name}</option>
    });

    let selectedGuide = this.state.selectedGuide;
    let itemSetsHtml = [];

    let numItemSets = selectedGuide.itemSets ? selectedGuide.itemSets.length : 0;

    for (let i = 0; i < numItemSets; i++) {
      let itemSet = selectedGuide.itemSets[i];
      let itemsHtml = [];

      itemSet.items.forEach((item, j) => {
        let key = i + '-' + j;
        let image = item.image;
        let bgimage = 'url(http://ddragon.leagueoflegends.com/cdn/5.16.1/img/sprite/' + image.sprite + ') ' + -image.x + 'px ' + -image.y + 'px';
        itemsHtml.push(
          <div key={key} className="ChampionInfo-item" style={{background: bgimage}} onMouseOver={self._itemMouseOver} onMouseOut={self._itemMouseOut} onMouseMove={self._itemMouseMove}>
            <div className="championInfo-itemDesc">
              <p className="title">{item.name}</p>
              <div dangerouslySetInnerHTML={{__html: item.description}}></div>
            </div>
          </div>
        );
      });

      itemSetsHtml.push(
        <div key={i} className="ChampionInfo-itemSetContainer">
          <div className="ChampionInfo-setTitle">{itemSet.name}</div>
          <div>{itemsHtml}</div>
        </div>
      );
    }

    return (
      <div>
        <select value={selectedGuide._id} onChange={this._selectedGuideChanged.bind(this)}>
          {options}
        </select>
        <a href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.buildJson))} download={selectedGuide.name + '.json'}><button className="guide-button" type="button">Download Build</button></a>
        <div className="guide-info">
          Source: <a href={selectedGuide.lolproUri} className="guide-source">{selectedGuide.lolproUri}</a>
        </div>
        <div className="guide-sets">
          {itemSetsHtml}
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