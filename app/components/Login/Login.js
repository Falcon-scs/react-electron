// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import { FormattedMessage } from 'react-intl';
import notification from 'antd/lib/notification';
import styles from './Login.scss';
import _get from 'lodash/get';
import LanguageSelector from '../LanguageSelector';
import axios from '../../fetch';
import { convertFormData } from '../../utils/index';

const FormItem = Form.Item;
class Login extends Component<Props, context> {
  props: Props;
  context: context;

  static contextTypes = {
    intl: PropTypes.object,
    socket: PropTypes.object
  };

  state = {
    loading: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        axios.post('oauth/token', convertFormData({
          ...values,
          grant_type: 'password',
          client_id: 'd7f70d91-4b43-79f5-71de-b1ec77c33220',
          client_secret: '7L5yjLEMXH15dYC',
          scope: 'supreme'
        }), {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          }
        }).then(res => {
          this.props.userLogin(res.data, values.remember);
          this.setState({ loading: false });
          if (res.status === 200){
            notification.success({
              message: this.context.intl.formatMessage({ id: 'system-notification-success-login-title' }),
              description: this.context.intl.formatMessage({ id: 'system-notification-success-login-message' }, { name: res.data.user.name.firstname }),
            });
            this.props.history.push('/');
          }
        }).catch(err => {
          this.setState({
            loading: false
          });
          if (_get(err, ['response', 'data', 'errorCode']) === 'AE'){ // Authentication error
            notification.error({
              message: this.context.intl.formatMessage({ id: 'error-authentication' }),
              description: this.context.intl.formatMessage({ id: 'error-userpassword' }),
            });
          }
          else {
            notification.error({
              message: this.context.intl.formatMessage({ id: 'error-network' }),
              description: this.context.intl.formatMessage({ id: 'error-network-desc' }),
            });
          }
        });
      }
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles['page-login']}>
        <Row className={styles['login-container']}>
          <br /><br /><br /><br /><br /><br />
          <Row>
            <Col span={7} offset={3}>
              <h3>
                <FormattedMessage
                  id="login-systemName"
                />
              </h3>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: this.context.intl.formatMessage({ id: 'login-username-error' }) }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={this.context.intl.formatMessage({ id: 'login-username' })} />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: this.context.intl.formatMessage({ id: 'login-password-error' }) }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={this.context.intl.formatMessage({ id: 'login-password' })} />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox>{this.context.intl.formatMessage({ id: 'login-rememberMe' })}</Checkbox>
                  )} <br />
                  <Button type="primary" size="large" loading={this.state.loading} htmlType="submit">
                    {this.context.intl.formatMessage({ id: 'login-loginButton' })}
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <LanguageSelector />
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default Form.create()(Login);
