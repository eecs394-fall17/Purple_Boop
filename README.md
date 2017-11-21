# Run This on Your Device
1. Download the Ionic View app on your app store
2. Enter the app id: d16919d3

# How to run this app on your Computer

## Install Ionic CLI and Cordova:
```bash
$ sudo npm install -g ionic cordova
```

Clone and cd into the repository
```bash
$ git clone https://github.com/eecs394-fall17/Green-Team.git
$ cd Green-Team/
```
Install all the dependencies
```bash
$ npm install
```
### Run on web browser
```bash
$ ionic serve
```

### Run on android 
```bash
$ ionic cordova build android
$ ionic cordova run android
```

### Run on ios 
```bash
$ cd platforms/ios/cordova/
$ npm install ios-sim@latest
$ cd ..
$ cd ..
$ cd ..
$ ionic cordova build ios
$ ionic cordova run ios
```

