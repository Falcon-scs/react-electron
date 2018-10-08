// @flow
import notification from 'antd/lib/notification';
import Datastore from 'nedb';
import config from '../../config.json';
import path from 'path';
import { updateToken } from '../../fetch';

export const DO_LOGIN = 'DO_LOGIN';
export const DO_LOGOUT = 'DO_LOGOUT';

const db = new Datastore({ filename: path.join(__dirname, config.datastore.authentication), autoload: true });

export const userLogin = (data, remember = false) => dispatch => {
    data = { ...data, data: data.user, user: undefined };
    if (remember){
        db.remove({}, { multi: true }, function (err, numRemoved) {});
        db.insert(data, function (err, newDoc) {})
    }
    updateToken(data.accessToken);
    dispatch({
        type: DO_LOGIN,
        payload: { ...data }
    });
};

export const userLogout = () => {
    db.remove({}, { multi: true }, function (err, numRemoved) {});
    return ({
        type: DO_LOGOUT
    })
}