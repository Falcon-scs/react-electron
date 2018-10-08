// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from '../components/Hierarchy/index';


type Props = {};

class HierarchyPage extends Component<Props> {
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

export default connect(null)(HierarchyPage);
