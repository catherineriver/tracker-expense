const withTM = require('next-transpile-modules')(['@ui', '@api', '@utils']);
import path = require("path");

module.exports = withTM({
    webpack(config) {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@ui': path.resolve(__dirname, '../../packages/ui/src'),
            '@api': path.resolve(__dirname, '../../packages/api/src'),
            '@utils': path.resolve(__dirname, '../../packages/utils/src'),
            'react-native$': 'react-native-web',
        };
        return config;
    },
});
