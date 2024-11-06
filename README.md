Paso 1: Crear el proyecto de Cordova

cordova create TaskManager com.example.taskmanager TaskManager
cd TaskManager

Paso 2: Agregar plataformas y plugins

cordova platform add android

Luego, agrega los plugins necesarios para las notificaciones locales:

cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-local-notification
