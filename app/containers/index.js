// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from '../components/Dashboard/index';


type Props = {};

class DashboardPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <Home {...this.props} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(() => null, dispatch);
}

export default connect(null)(DashboardPage);
