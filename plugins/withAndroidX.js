const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Plugin to add AndroidX and Jetifier properties to gradle.properties
 * This is required to resolve conflicts between AndroidX and old Support Library
 */
const withAndroidX = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) =>
        !(item.type === 'property' && item.key === 'android.useAndroidX') &&
        !(item.type === 'property' && item.key === 'android.enableJetifier')
    );

    config.modResults.push(
      {
        type: 'property',
        key: 'android.useAndroidX',
        value: 'true',
      },
      {
        type: 'property',
        key: 'android.enableJetifier',
        value: 'true',
      }
    );

    return config;
  });
};

module.exports = withAndroidX;
