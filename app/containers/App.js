// @flow

import React from 'react';
import { connect } from 'react-redux';
import LocaleProvider from 'antd/lib/locale-provider';
import PropTypes from 'prop-types';
import Ws from 'ws';
import Datastore from 'nedb';
import path from 'path';
import { Helmet } from 'react-helmet';

import frFR from 'antd/lib/locale-provider/fr_FR';
import enEN from 'antd/lib/locale-provider/en_GB';
import arAR from 'antd/lib/locale-provider/ar_EG';

import { addLocaleData, IntlProvider } from 'react-intl';

import 'moment/locale/fr';
import 'moment/locale/ar-ly';
import 'moment/locale/en-gb';

// components
import message from 'antd/lib/message';
import Layout from '../containers/Layout';

import ar from '../translations/ar.json';
import en from '../translations/en.json';
import fr from '../translations/fr.json';
import config from './../config.json';


let appLocale = {
  data: {},
  messages: {}
};

const db = new Datastore({ filename: path.join(__dirname, config.datastore.settings), autoload: true });

type Props = {
  children: React.Node
};

class App extends React.Component<Props, Context> {
  props: Props;
  context: Context;

  static childContextTypes = {
    socket: PropTypes.object,
    user: PropTypes.object
  };

  state = {
    socket: {
      connected: false
    }
  };

  static contextTypes = {
    user: PropTypes.object,
    socket: PropTypes.object
  }
  
  
  getChildContext() {
    return { ...this.context, user: {}, socket: this.state.socket };
  }

  componentWillMount() {
    const dis = this;
    db.findOne({}).exec(function(err, doc) { //eslint-disable-line
      if (err) return;
      if (doc && doc.locale) {
        appLocale = doc;
        appLocale.data = 
          doc.locale === 'ar' ? { ...arAR } :
          doc.locale === 'fr' ? { ...frFR } : 
          { ...enEN }
        ;
        appLocale.messages = 
          doc.locale === 'ar' ? { ...ar } :
          doc.locale === 'fr' ? { ...fr } : 
          { ...en }
        ;
      }
      else {
        appLocale = {
          locale: 'en',
        };
        db.insert(appLocale, function(err, doc){});
      }

      if (doc && doc.access_token){
        const conenctSocket = () => {
          let socket = { conencted: false };
          console.log('connecting to:' + config.server.ws);
          message.warning('Connecting to Server');
          socket = new Ws(config.server.ws + `?access_token=${doc.access_token}`, { rejectUnauthorized: false });
        
          socket.connected = false;
          socket.on('open', function open(){
            socket.connected = true;
            message.success('Connected to system !');
          });
        
          let timer = parseInt(config.server.reconnectIn);
          const showMsg = t => message.error('Failed to connect to server, reconnecting in (' + timer + ') seconds.', t); 
        
          socket.on('close', function close() {
            console.log('closed');
            const cntr = setInterval(() => {
              if (timer === 0){
                conenctSocket();
                clearInterval(cntr);
              }
              else showMsg(5);
              timer -= 5;
            }, 5000);
          });
        
          socket.on('error', function(){
            console.log('error');
          });
          
          return socket;
        };

        this.state.socket = conenctSocket();
      }
      appLocale.data = {
        en: enEN,
        fr: frFR,
        ar: arAR
      };
      appLocale.messages = {
        ar,
        fr,
        en
      };
      addLocaleData(appLocale.data[appLocale.locale]);
      dis.setState({ appLocale });
    });
  }

  render() {
    if (!this.state.appLocale) return null;
    return (
      <div>
        <LocaleProvider locale={this.state.appLocale.data[this.state.appLocale.locale]}>
          <IntlProvider locale={this.state.appLocale.locale} messages={this.state.appLocale.messages[this.state.appLocale.locale]}>
            {this.props.router.location.pathname === '/login' ? this.props.children :   
              <Layout>
                {this.props.children}
              </Layout>  
            }
          </IntlProvider>
        </LocaleProvider>
        <Helmet>
            <meta charSet="utf-8" />
            <html dir={this.state.appLocale.locale === 'ar' ? 'rtl' : 'ltr'} lang={this.state.appLocale.locale} />
            {this.state.appLocale.locale === 'ar' ? <link rel="stylesheet" type="text/css" href="./antd.rtl.css" /> : <link rel="stylesheet" type="text/css" href="../node_modules/antd/dist/antd.css" /> }
        </Helmet>
      </div>
    );
  }
}
const state = store => store;
export default connect(state)(App);
