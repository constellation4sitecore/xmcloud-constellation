// Code: workaraound to inject project settings into 
import isServer from './utils/is-server';
let config = {};
if(isServer()) {
     config = require('../../../../../src/temp/config');
};
export default config;
