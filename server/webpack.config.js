// @ts-ignore
const path = require('path');
module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),  // 指向于 server/src 目录
            '@shares': path.resolve(__dirname, '../shares'),  // 指向于 shares 目录
        },
    },
    
};