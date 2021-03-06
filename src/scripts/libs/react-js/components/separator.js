'use strict';

import React from 'react';

const Separator = React.createClass({
  render() {
    return (
      <div className="separator">
          <span className="separator-body">
            <span className="separator-circle">
              <i className="fa fa-chevron-down"></i>
            </span>
          </span>
      </div>
    )
  }
});

export default Separator;
