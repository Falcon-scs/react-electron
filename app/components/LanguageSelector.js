import React from 'react';
import PropTypes from 'prop-types';
import { changeSystemLanguage } from '../actions/System/index';

// components
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';

const languages = [
    'ar',
    'en',
    'fr'
];

  export default class App extends React.Component<Props, Context> {
    props: Props;
    context: Context;

    static contextTypes = {
        intl: PropTypes.object
    };

    state = {
        menu: <Menu.Item />
    }

    componentDidMount() {
        const m = [];
        languages.map(lang => {
            if (lang === this.context.intl.locale) return;
            m.push(<Menu.Item key={`language_selector_${lang}`}>
                <a rel="noopener noreferrer" onClick={changeSystemLanguage.bind(this, this.context.intl.locale, lang, this.context.intl)}>{this.context.intl.formatMessage({ id: lang })}</a>
            </Menu.Item>);
        });

        this.setState({ menu: m });
    }
    
    

    render() {
        return (
            <Dropdown trigger={['click']} overlay={<Menu>{this.state.menu}</Menu>} placement="bottomLeft">
               <Button>{this.context.intl.formatMessage({ id: this.context.intl.locale })}</Button>
            </Dropdown>
        );
      }
  };