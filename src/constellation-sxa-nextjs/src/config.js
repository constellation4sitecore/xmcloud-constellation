// Code: workaraound to inject project settings into 
import isServer from './utils/is-server';
let config = {};
if(isServer()) {
    const importSync = require('import-sync');
     config = importSync('../../../../../src/temp/config');
};
export default config;
