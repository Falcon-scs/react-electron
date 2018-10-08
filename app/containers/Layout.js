// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Layout/index';

import { bindActionCreators } from 'redux';
import { userLogout } from '../actions/User/index';

type Props = {};

class LayoutPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <Home {...this.props} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userLogout }, dispatch);
}

export default connect(null, mapDispatchToProps)(LayoutPage);
