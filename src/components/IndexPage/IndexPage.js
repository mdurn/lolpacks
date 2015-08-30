/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './IndexPage.css';
import withStyles from '../../decorators/withStyles';
import http from '../../core/http';

//import models from '../../models';

@withStyles(styles)
class IndexPage extends Component {

  constructor() {
    super();
    this.state = {
      champions: <div></div>
    };
  }

  componentDidMount() {
    let self = this;
    http.get('/api/champions.json').then((champions) => {
      let championRows = [];
      let championRow = [];
      champions.forEach((champion, i) => {
        championRow.push(
          <div className="champion">
            <img key={i} className="champion-image" src={'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/' + champion.image.full}/>
            <div className="champion-label-container">
              <div className="champion-label">
                {champion.name}
              </div>
            </div>
          </div>
        );
        if (i % 6 == 5) {
          championRows.push(
            <div key={'row-' + i/6} className="champion-row">{championRow}</div>
          );
          championRow = [];
        }
      });
      if (championRow.length) {
        championRows.push(<div key={'row-' + (champions.length-1)/6} className="champion-row">{championRow}</div>);  
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