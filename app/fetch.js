import axios from 'axios';
import path from 'path';
import differenceInMinutes from 'date-fns/difference_in_minutes'
import config from './config';

const https = require('https');
const Datastore = require('nedb')
  , db = new Datastore({ filename: path.join(__dirname, config.datastore.authentication), autoload: true });

let instance, tokenInstance;

axios.defaults.headers.common['Accept-Language'] = config.locale;

/**
 * update token
 * @param {string} token
 */
export const updateToken = (token = '') => {
	if (tokenInstance){
		clearInterval(tokenInstance);
	}
	tokenInstance = setInterval(() => updateToken(), 1000 * 60 * 30);
	if (token){
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	}
	else {
		db.findOne({}, 'accessToken', function(err, doc){
			instance = doc || {};
			// if token is almost expire
			if (differenceInMinutes(new Date(instance.accessTokenExpiresAt), new Date()) < 15){
				// if refresh token is valid
				if (differenceInMinutes(new Date(instance.refreshTokenExpiresAt), new Date()) > 0){
					axios.post('oauth/token', convertFormData({
						grant_type: 'refresh_token',
						client_id: 'd7f70d91-4b43-79f5-71de-b1ec77c33220',
						client_secret: '7L5yjLEMXH15dYC',
						refresh_token: instance.refreshToken
					  }), {
						headers: {
						  'content-type': 'application/x-www-form-urlencoded',
						}
					  }).then(res => {
						if (res.status === 200){
							db.remove({ _id: instance._d }, function(err, ar){});
							db.insert(res.data, function(err, data){});
							instance = res.data;
						}
					  });
				}
			}
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + instance.accessToken;
		});
	}
};

/**
 * get request instance
 */
export const getInstance = () => {
	if (instance) return instance;
	instance = axios.create({
		withCredentials: true,
		httpsAgent: new https.Agent({  
			rejectUnauthorized: false,
			secureProtocol: true
		}),
		baseURL: config.server.http,
		timeout: 10000,
	});
	return instance;
};

export default getInstance();