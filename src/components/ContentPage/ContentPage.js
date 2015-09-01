/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './ContentPage.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class ContentPage {

  static propTypes = {
    path: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    title: PropTypes.string
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    this.context.onSetTitle(this.props.title);
    return (
      <div className="ContentPage">
        <div className="ContentPage-container">
          <div className="ContentPage-content">
            {
              this.props.path === '/' ? null : <h1 className="content-title">- {this.props.title} -</h1>
            }
            
            { this.props.children }

            <div className="jade-content" dangerouslySetInnerHTML={{__html: this.props.content || ''}} />
          </div>
        </div>
      </div>
    );
  }

}

export default ContentPage;
