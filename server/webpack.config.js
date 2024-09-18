const path = require('path');
module.exports = {
    resolve: {
        alias: {
            'component': path.resolve(__dirname, 'dist/src/Component/Definition'),
        }
    }
};