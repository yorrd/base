// This section sets up some basic app metadata,
// the entire section is optional.

App.info({
    id: '',
    name: '',
    author: 'Adornis Ventures UG (haftungsbeschränkt)',
    description: 'Realization: https://adornis.de',
    email: 'baseproject@adornis.de',
    website: '',
    version: '0.0.1',
});

// Set up resources such as icons and launch screens.
App.icons({
    android_mdpi: 'public/img/icon/android/icon_48.png',
    android_hdpi: 'public/img/icon/android/icon_72.png',
    android_xhdpi: 'public/img/icon/android/icon_96.png',
    android_xxhdpi: 'public/img/icon/android/icon_144.png',
    android_xxxhdpi: 'public/img/icon/android/icon_192.png',
    ios_spotlight: 'public/img/icon/ios/icon_40.png',
    ios_spotlight_2x: 'public/img/icon/ios/icon_80.png',
    ios_settings_3x: 'public/img/icon/ios/icon_87.png',
    ipad_2x: 'public/img/icon/ios/icon_152.png',
    iphone_3x: 'public/img/icon/ios/icon_180.png',
});

App.launchScreens({
    android_mdpi_portrait: 'public/img/splash/splash_mdpi_p.9.png',
    android_mdpi_landscape: 'public/img/splash/splash_mdpi_l.9.png',
    android_hdpi_portrait: 'public/img/splash/splash_hdpi_p.9.png',
    android_hdpi_landscape: 'public/img/splash/splash_hdpi_l.9.png',
    android_xhdpi_portrait: 'public/img/splash/splash_xhdpi_p.9.png',
    android_xhdpi_landscape: 'public/img/splash/splash_xhdpi_l.9.png',
    android_xxhdpi_portrait: 'public/img/splash/splash_xxhdpi_p.9.png',
    android_xxhdpi_landscape: 'public/img/splash/splash_xxhdpi_l.9.png',
    iphone_2x: 'public/img/splash/splash_xhdpi_p_iphone.9.png',
    ipad_portrait: 'public/img/splash/splash_xhdpi_p_ipad.9.png',
    ipad_landscape: 'public/img/splash/splash_xhdpi_l_ipad.9.png',
    ipad_portrait_2x: 'public/img/splash/splash_xxhdpi_p_ipad2x.9.png',
    ipad_landscape_2x: 'public/img/splash/splash_xxhdpi_l_ipad2x.9.png',
    iphone6p_portrait: 'public/img/splash/splash_xxhdpi_p_iphone6p.9.png',
    iphone6p_landscape: 'public/img/splash/splash_xxhdpi_l_iphone6p.9.png',
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// allow access to outside stuff
// App.accessRule('http://*');
// App.accessRule('https://*');
// App.accessRule('file:///*');
// App.accessRule('cdvfile://*');
