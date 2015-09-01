/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';
import Navigation from '../Navigation';

@withStyles(styles)
class Header {

  render() {
    return (
      <div className="Header">
        <div className="Header-container">
          <Navigation className="Header-nav" />
          <div className="Header-banner">
            <a href="/"><img className="Header-bannerTitle" src={require('./lolpacks.png')} /></a>
            <p className="Header-bannerDesc">Downloadable League of Legends Item Sets</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Header;
