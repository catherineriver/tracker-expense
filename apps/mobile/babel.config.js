module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@ui': '../../packages/ui',
            '@utils': '../../packages/utils',
            '@api': '../../packages/api',
          },
        },
      ],
    ],
  };
};