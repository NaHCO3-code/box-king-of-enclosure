// @ts-ignore
const path = require('path');
module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@shares': path.resolve(__dirname, '../shares'),
        }
    }
};