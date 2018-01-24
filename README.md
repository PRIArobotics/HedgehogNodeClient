# HedgehogNodeClient
[![Build Status](https://travis-ci.org/PRIArobotics/HedgehogNodeClient.svg?branch=master)](https://travis-ci.org/PRIArobotics/HedgehogNodeClient)
[![Dependency Status](https://david-dm.org/priarobotics/HedgehogNodeClient/status.svg)](https://david-dm.org/priarobotics/HedgehogNodeClient)

NodeJS client library for the Hedgehog Educational Robotics Controller

## Development
### Tools
For following tools are used for development the Hedgehog NodeJS library.
Thus, if you want to start working on the API, you will need to install them first.
- Dependency Management: [NPM](https://www.npmjs.com/)
- Build Automation: [Grunt](http://gruntjs.com/)
- Typings Management: [Typings](https://github.com/typings/typings)
- Testing: [Mocha](http://mochajs.org/)
- Linting: [TSLint](https://palantir.github.io/tslint/) (Available via Grunt task. No installation required!)
- Protobuffer Compiler: [Protoc](https://github.com/google/protobuf) can be downloaded [here](https://github.com/google/protobuf/releases)  

### Setup
```
$ npm install     # Install required NPM modules
$ typings install # Install TypeScript type definitions
$ grunt protoc    # Generate Protobuffer Javascript files
```

### Running tests
In order to execute all tests, simply execute:
```
$ npm test
```

### Usage Example
```TypeScript
// Create a hedgehog client instance
let hedgehog = new HedgehogClient('tcp://127.0.0.1:10789');

// Control motors and servos
// hedgehog.move(port, power)
hedgehog.move(0, 100);
hedgehog.move(2, 100);

// hedgehog.set_servo(port, enabled, position)
hedgehog.setServo(0, true, 1023);

// Read sensor values
// hedgehog.getAnalog(0) returns a promise which resolves to the sensor value
// Thus, with async await syntax, we can do:
const value = await hedgehog.getAnalog(0);

// Same with digital sensors
const value = await hedgehog.getDigital(8);
```

### Coding Styleguide
Code is linted via TSLint.
Read the [styleguide entry](https://github.com/PRIArobotics/hedgehog-ide/wiki/Styleguide) in the hedgehog-ide project's wiki.
