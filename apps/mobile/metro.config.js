const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Monorepo configuration for shared packages
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Watch for changes in shared packages
config.watchFolders = [workspaceRoot];

// Let Metro know where to find node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;