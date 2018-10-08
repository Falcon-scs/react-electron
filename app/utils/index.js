const querystring = require('querystring');

export const convertFormData = data => querystring.stringify(data);