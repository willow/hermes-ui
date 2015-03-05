'use strict';

import React from 'react';
import Sidebar from './sidebar/sidebar';
import Header from './header/header';

import Router from 'react-router';

var {RouteHandler} = Router;

var AppLayout = React.createClass({

  render: function () {
    return (
        <div id="page-wrapper">
          <Sidebar />
          <div id="main-wrapper">
            <Header />
            <div id="content-wrapper">
              <RouteHandler/>
            </div>
          </div>
        </div>
    );
  }
});

export default AppLayout;
