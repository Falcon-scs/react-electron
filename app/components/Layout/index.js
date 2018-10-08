import PropTypes from 'prop-types';
import React from 'react';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import styles from './style.css';

const { Header, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;


export default class LayoutComponent extends React.Component<props, context> {
    props: props;
    context: context;

    state = {
    collapsed: false,
    };

    static contextTypes = {
        intl: PropTypes.object,
        router: PropTypes.object
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    logout = e => {
        e.preventDefault();
        this.props.userLogout();
    }

    navigateMenu = ({ keyPath }) => this.context.router.history.push('/' + keyPath.reverse().join('/'));

    render() {
        return (
        <Layout style={{ height: '100%' }}>
            <Sider
                className={styles.optimumMenu}
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
            >
            <div className={this.state.collapsed ? styles.logoCollapsed : styles.logo} />
            <Menu theme="dark" onClick={this.navigateMenu} mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="/">
                    <Icon type="dashboard" />
                    <span>{this.context.intl.formatMessage({ id: 'menu-dashboard' })}</span>
                </Menu.Item>
                <Menu.Item key="customers">
                     <Icon type="idcard" />
                    <span>{this.context.intl.formatMessage({ id: 'menu-customers' })}</span>
                </Menu.Item>
                <Menu.Item key="hcp">
                    <Icon type="medicine-box" />
                    <span>{this.context.intl.formatMessage({ id: 'menu-hcps' })}</span>
                </Menu.Item>
                <SubMenu key="operations" title={<span><Icon type="appstore" /><span>{this.context.intl.formatMessage({ id: 'menu-operations' })}</span></span>}>
                    <SubMenu key="health" title={<span><Icon type="appstore" /><span>{this.context.intl.formatMessage({ id: 'menu-operations-health' })}</span></span>}>
                        <Menu.Item key="inNetwork">
                            <Icon type="medicine-box" />
                            <span>{this.context.intl.formatMessage({ id: 'menu-innetwork' })}</span>
                        </Menu.Item>
                        <Menu.Item key="cashClaim">
                            <Icon type="medicine-box" />
                            <span>{this.context.intl.formatMessage({ id: 'menu-cashClaim' })}</span>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="medicalLiability">
                        <Icon type="medicine-box" />
                        <span>{this.context.intl.formatMessage({ id: 'menu-medicalLiability' })}</span>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="reports" title={<span><Icon type="area-chart" /><span>{this.context.intl.formatMessage({ id: 'menu-reports' })}</span></span>}>
                </SubMenu>
                <SubMenu key="corporation" title={<span><Icon type="home" /><span>{this.context.intl.formatMessage({ id: 'menu-corporation' })}</span></span>}>
                    <Menu.Item key="users">
                        <Icon type="user" />
                        <span>{this.context.intl.formatMessage({ id: 'menu-users' })}</span>
                    </Menu.Item>
                    <Menu.Item key="hierarchy">
                        <Icon type="layout" />
                        <span>{this.context.intl.formatMessage({ id: 'menu-hierarchy' })}</span>
                    </Menu.Item>
                    <Menu.Item key="partners">
                        <Icon type="star" />
                        <span>{this.context.intl.formatMessage({ id: 'menu-partners' })}</span>
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Icon type="setting" />
                        <span>{this.context.intl.formatMessage({ id: 'menu-setting' })}</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
            </Sider>
            <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
                <Row>
                    <Col span={2}>
                        <Icon
                            className={styles.anticon}
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                            />
                    </Col>
                    <Col span={19}></Col>
                    <Col span={3}>
                        <Button onClick={this.logout} type="dashed" icon="logout">logout</Button>
                    </Col>
                </Row>
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                {this.props.children}
            </Content>
            </Layout>
        </Layout>
        );
    }
}