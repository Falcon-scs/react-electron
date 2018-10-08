// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _get from 'lodash/get';
// components
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tree from 'antd/lib/tree';
import AutoComplete from 'antd/lib/auto-complete';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 1 },
    sm: { span: 1 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

class Hierarchy extends Component<Props, context> {
  props: props;
  context: context;

  state = {
    hierarchy: [
      {
        title: 'Parent 1',
        _id: '0-0',
        code: 'IT',
        children: [
          {
            title: 'leaf',
            code: 'OTP',
            _id: '0-0-0'
          },
          {
            title: 'leaf',
            code: 'OTP',
            _id: '0-0-1'
          },
          {
            title: 'leaf',
            code: 'OTP',
            _id: '0-0-2'
          },
          {
            title: 'leaf',
            code: 'OTP',
            _id: '0-0-3'
          }
        ]
      },
      {
        title: 'Parent 2',
        _id: '0-1',
        code: 'HRF',
        children: [
          {
            title: 'leaf',
            _id: '0-1-0',
            children: [
              {
                title: 'leaf',
                _id: '1-1-0',
                code: 'KSL'
              },
              {
                title: 'leaf',
                _id: '1-1-1',
                code: 'KSL'
              },
              {
                title: 'leaf',
                _id: '1-1-2',
                code: 'KSL'
              },
              {
                title: 'leaf',
                _id: '1-1-3',
                code: 'KSL'
              }
            ]
          },
          {
            title: 'leaf',
            code: 'LSK',
            _id: '0-1-1'
          },
          {
            title: 'leaf',
            code: 'LSK',
            _id: '0-1-2'
          },
          {
            title: 'leaf',
            code: 'LSK',
            _id: '0-1-3'
          }
        ]
      }
    ],
    menu: [],
    add: {
      parent: '',
      value: ''
    },
    validateStatus: 'success',
    help: 'complete all fields',
    loading: false
  }

  sections = [];

  static contextTypes = {
    intl: PropTypes.object
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }
  
  componentDidMount = () => {
    const menu = [];
    this.sections = [];
    this.state.hierarchy.map(node => {
      if (node.children){
        menu.push(this.renderSection(node, this.renderSection))
      }
      else {
        menu.push(<TreeNode title={node.code + ' / ' + node.title} key={node._id} />);
        this.sections.push(node);
      }
    });

    this.setState({ menu });
  }

  renderSection = (node, renderSection) => {
    const children = [];
    if (node.children){
      node.children.map(child => {
        if (child.children) children.push(renderSection(child, renderSection));
        else children.push(<TreeNode title={child.code + ' / ' + child.title} key={child._id} />);
        this.sections.push(child);
      });
    }
    else {
      this.sections.push(node);
      return <TreeNode title={node.code + ' / ' + node.title} key={node._id} />;
    }

    return <TreeNode title={node.code + ' / ' + node.title} key={node._id}>{children}</TreeNode>
  }

  search = key => {
    for (var i=0; i < this.sections.length; i++) {
      if (this.sections[i].name === key) {
          return this.sections[i];
      }
   }
  }

  handleSubmit = (e) => {
    console.log('submit');
    this.setState({ loading: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err){
        this.setState({ loading: false, validateStatus: 'error', help: _get(err, [Object.keys(err)[0], 'errors', 0, 'message']) })
      }
      if (!err) {
        this.setState({ loading: false, validateStatus: 'success', help: '' });
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    return (
      <div className='hierarchy'>
        <Row>
          <Col span={24}>
            <Tree
              showLine
              defaultExpandedKeys={['0-0-0']}
              onSelect={this.onSelect}
            >
              {this.state.menu}
            </Tree>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Spin spinning={this.state.loading}>
              <h3>{this.context.intl.formatMessage({ id: 'fork-new-title' })}</h3>
              <Form onSubmit={this.handleSubmit} hideRequiredMark>
                <FormItem validateStatus={this.state.validateStatus} help={this.state.help} {...formItemLayout} label={null}>  
                  <InputGroup compact>
                    {getFieldDecorator('parent', {
                      rules: [{
                        required: true,
                        message: 'Parent is required.'
                      }],
                    })(
                      <Select showSearch autoFocus allowClear notFoundContent={this.context.intl.formatMessage({ id: 'system-not-found' })} style={{ width: '40%' }} placeholder={this.context.intl.formatMessage({ id: 'parent' })}>
                        <Option value="new">{this.context.intl.formatMessage({ id: 'fork-new-select' })}</Option>
                        {this.sections.map(section => <Option key={section._id} value={section._id}>{section.code + ' / ' + section.title}</Option>)}
                      </Select>
                    )}
                    {getFieldDecorator('title', {
                      rules: [{
                        required: true,
                        message: 'Name is required.',
                      }],
                    })(
                      <Input style={{ width: '40%' }} placeholder={this.context.intl.formatMessage({ id: 'fork-hierarchy-add-placeholder' })} />
                    )}
                    {getFieldDecorator('code', {
                      rules: [{
                        required: true,
                        // validator: (rule, value, cb) => this.search(value),
                        message: 'Code is required.',
                      }],
                    })(
                      <Input style={{ width: '20%' }} placeHolder="Code" />
                    )}
                  </InputGroup>
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
              </Form>
            </Spin>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(Hierarchy);