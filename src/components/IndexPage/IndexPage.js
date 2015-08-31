/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './IndexPage.css';
import ChampionRow from '../ChampionRow';
import withStyles from '../../decorators/withStyles';
import http from '../../core/http';

@withStyles(styles)
class IndexPage extends Component {

  constructor() {
    super();
    this.state = {
      champions: <div></div>,
      selectedChampionId: null
    };
  }

  componentDidMount() {
    let self = this;
    http.get('/api/champions.json').then((champions) => {
      let championRows = [];
      let championRow = [];
      champions.forEach((champion, i) => {
        let rowIndex = Math.floor(i/6);
        championRow.push({ champion: champion, rowIndex: rowIndex });
        if (i % 6 == 5) {
          championRows.push(<ChampionRow key={'row-' + rowIndex} index={rowIndex} data={championRow}/>);
          championRow = [];
        }
      });
      if (championRow.length) {
        let rowIndex = Math.floor((champions.length-1)/6);
        championRows.push(<ChampionRow key={'row-' + rowIndex} index={rowIndex} data={championRow}/>);  
      }

      self.setState({champions: championRows});
    });
  }

  render() {
    return (
      <div className="IndexPage">
        <div className="IndexPage-container">
          <h1>Champions</h1>
          <div>
            { this.state.champions }
          </div>
        </div>
      </div>
    );
  }

}

export default IndexPage;