const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar alias de módulos
config.resolver.extraNodeModules = {
  app: path.resolve(__dirname, 'app'),
  services: path.resolve(__dirname, 'services'),
  components: path.resolve(__dirname, 'components'),
  hooks: path.resolve(__dirname, 'hooks'),
  constants: path.resolve(__dirname, 'constants'),
  utils: path.resolve(__dirname, 'utils'),
};

module.exports = withNativeWind(config, { input: './global.css' });
