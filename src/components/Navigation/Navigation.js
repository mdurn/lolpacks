/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';

@withStyles(styles)
class Navigation {

  static propTypes = {
    className: PropTypes.string
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <a className="Navigation-link" href="/" onClick={Link.handleClick}>Home</a>
        <span className="Navigation-spacer"> | </span>
        <a className="Navigation-link" href="/about" onClick={Link.handleClick}>About</a>
      </div>
    );
  }

}

export default Navigation;
