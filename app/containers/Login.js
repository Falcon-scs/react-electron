// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from '../components/Login/Login';

import * as userActions from '../actions/User/index';

type Props = {};

class LoginPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <Home {...this.props} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(userActions, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginPage);
