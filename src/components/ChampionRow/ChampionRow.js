/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './ChampionRow.css';
import ChampionInfo from '../ChampionInfo';
import withStyles from '../../decorators/withStyles';
import jQuery from 'jquery';

let $ = jQuery;


@withStyles(styles)
class ChampionRow extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
  };

  constructor() {
    super();
    this.state = {
      selectedChampionId: null
    };
  }

  _championClick(championId, e) {
    let self = this;
    let divId = '#ChampionInfo-' + self.props.index;
    this.setState({selectedChampionId: championId});

    $('.champion').removeClass('champion-selected');
    $(e.currentTarget).addClass('champion-selected');

    $('.ChampionInfo:visible').not(divId).slideUp();
    $(divId).not(':visible').slideDown();
  }

  _renderChampionRow() {
    let self = this;
    let championRow = [];
    this.props.data.forEach((col, i) => {
      championRow.push(
        <div key={i} className="champion" onClick={self._championClick.bind(this, col.champion._id)}>
          <div className="champion-image" style={{backgroundPositionX: -col.champion.image.x + 'px', backgroundPositionY: -col.champion.image.y + 'px'}}></div>
          <div className="champion-label-container">
            <div className="champion-label">
              {col.champion.name}
            </div>
          </div>
        </div>
      );
    });

    return championRow;
  }

  render() {
    return (
      <div className="champion-row">
        {this._renderChampionRow()}
        <ChampionInfo index={this.props.index} championId={this.state.selectedChampionId} />
      </div>
    );
  }

}

export default ChampionRow;