// @flow
import Datastore from 'nedb';
import path from 'path';
import config from '../../config.json';
import fs from 'fs';
import notification from 'antd/lib/notification';

export const changeSystemLanguage = (current: string, language: string = '', intl: object) => {

    console.log('path.join(__dirname, config.datastore.settings)', path.join(__dirname, config.datastore.settings));
    const db = new Datastore({ filename: path.join(__dirname, config.datastore.settings), autoload: true });
    db.update({ locale: current}, { locale: language }, function(){
        notification.success({
            message: intl.formatMessage({ id: 'system-notification-languageChanged-title' }),
            description: intl.formatMessage({ id: 'system-notification-languageChanged-message' }),
          });
        config.locale = language;
        try { fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(config), 'utf-8'); }
        catch(e) { console.log(e); }
    });
}
