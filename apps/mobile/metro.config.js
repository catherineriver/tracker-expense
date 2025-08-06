const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const workspaceRoot = path.resolve(__dirname, '../../');
const config = getDefaultConfig(__dirname);

config.watchFolders = [
    path.resolve(workspaceRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'packages'),
];

config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.alias = {
    '@ui': path.resolve(workspaceRoot, 'packages/ui/src'),
    '@utils': path.resolve(workspaceRoot, 'packages/utils/src'),
    '@api': path.resolve(workspaceRoot, 'packages/api/src'),
};

module.exports = config;
