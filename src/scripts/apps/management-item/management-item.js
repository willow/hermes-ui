'use strict';

import React from 'react';
import Router  from 'react-router';

import ComponentProvider from 'src/libs/components/component-provider';

import Actions from 'src/aggregates/management-item/actions';

const {Link, RouteHandler} = Router;

export default function () {

  const component = React.createClass({
    render() {
      return (
          <div id="mi-wrapper">
            <RouteHandler/>
          </div>
      );
    }
  });

  return new ComponentProvider(component);
};