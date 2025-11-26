const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Plugin para agregar permisos de micrófono necesarios para @react-native-voice/voice
 */
const withVoicePermissions = (config) => {
  return withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;

    // Asegurar que el array de uses-permission existe
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    // Permisos necesarios para reconocimiento de voz
    const permissions = [
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
    ];

    permissions.forEach((permission) => {
      // Verificar si el permiso ya existe
      const exists = manifest['uses-permission'].some(
        (item) => item.$?.['android:name'] === permission
      );

      // Si no existe, agregarlo
      if (!exists) {
        manifest['uses-permission'].push({
          $: {
            'android:name': permission,
          },
        });
      }
    });

    return config;
  });
};

module.exports = withVoicePermissions;
