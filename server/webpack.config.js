// @ts-ignore
const path = require('path');
module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'dist/server/src'),
            'component': path.resolve(__dirname, 'dist/server/src/Component/Definition'),
            '@shares': path.resolve(__dirname, 'dist/shares'),
        }
    }
};