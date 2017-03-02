import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import * as constants from './settings/constants';

import HomePage from './components/HomePage';
import FuelSavingsPage from './containers/FuelSavingsPage'; // eslint-disable-line import/no-named-as-default
import AboutPage from './components/AboutPage.js';
import NotFoundPage from './components/NotFoundPage.js';

export default {
  init(container){
    const AppLayoutComponent = container.get(constants.APP_LAYOUT_COMPONENT).dependency;
    const DashboardComponent = container.get(constants.DASHBOARD_COMPONENT).dependency;

    const AgreementListContainerComponent   = container.get(constants.AGREEMENT_LIST_CONTAINER_COMPONENT).dependency;
    const CreateAgreementComponent          = container.get(constants.AGREEMENT_NEW_CREATE_COMPONENT).dependency;
    const AgreementEditContainerComponent   = container.get(constants.AGREEMENT_EDIT_CONTAINER_COMPONENT).dependency;
    const AgreementDetailContainerComponent = container.get(constants.AGREEMENT_DETAIL_CONTAINER_COMPONENT).dependency;

    const LoginComponent = container.get(constants.LOGIN_COMPONENT).dependency;

    const store = container.get(constants.APP_STORE);

    function requireAuth(nextState, replace) {
      if (!store.getState().session.loggedIn) {
        replace({
          pathname: '/login',
          state: {'next-path': nextState.location.pathname}
        });
      }
    }

    return (
      [ // use array for multiple adjacent routes,  https://github.com/ReactTraining/react-router/issues/193#issuecomment-51977965

        <Route path="/" component={AppLayoutComponent} onEnter={requireAuth}>
          <IndexRedirect to="/dashboard"/>
          <Route path="dashboard" component={DashboardComponent}/>

          <Route path="agreements" component={AgreementListContainerComponent}/>
          <Route path="agreements">
            <Route path="step-1" component={CreateAgreementComponent}/>
            <Route path=':agreementId/step-2' component={AgreementEditContainerComponent}/>
          </Route>
        </Route>,

        <Route path="login" component={LoginComponent}/>

      ]
    );
  }
};
