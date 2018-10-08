// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from '../components/Customers/index';


type Props = {};

class CustomersPage extends Component<Props> {
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

export default connect(null)(CustomersPage);
