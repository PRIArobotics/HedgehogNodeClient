# HedgehogNodeClient
[![Build Status](https://travis-ci.org/PRIArobotics/HedgehogNodeClient.svg?branch=master)](https://travis-ci.org/PRIArobotics/HedgehogNodeClient)
[![Code Coverage](https://coveralls.io/repos/github/PRIArobotics/HedgehogNodeClient/badge.svg?branch=master)](https://coveralls.io/github/PRIArobotics/HedgehogNodeClient?branch=master)
[![Dependency Status](https://david-dm.org/priarobotics/HedgehogNodeClient/status.svg)](https://david-dm.org/priarobotics/HedgehogNodeClient)

NodeJS client library for the Hedgehog Educational Robotics Controller

## Development
### Tools
The following tools are used for development of the Hedgehog NodeJS library.
- Dependency Management: [NPM](https://www.npmjs.com/)
- Build Automation: [Grunt](http://gruntjs.com/) (installing Grunt CLI globally is advisable)
- Testing: [Mocha](http://mochajs.org/) (installed via NPM, run via `npm test`)
- Coverage: [Istanbul/nyc](https://istanbul.js.org/) (installed via NPM, run via `npm test`)
- Linting: [TSLint](https://palantir.github.io/tslint/) (installed via NPM, run via `grunt tslint`)
- Protobuf Compiler: [protoc](https://github.com/google/protobuf) (can be downloaded [here](https://github.com/google/protobuf/releases), run via `grunt protoc`)
- Code generation: [gsl](https://github.com/SillyFreak/gsl) (optional; requires Python 3.6, installed via `pip install gsl[antlr,yaml]`, run via `npm run gsl-protocol`)

### Setup
```
$ npm install       # Install required NPM modules
$ grunt protoc      # Generate Protobuf Javascript files
$ grunt build       # compile TypeScript sources
```

Optionally, set up code generation to adapt the TypeScript implementation of the Hedgehog protocol (requires Python 3.6):

```
$ pip install gsl[antlr,yaml] hedgehog-protocol-spec
$ npm run gsl-protocol
```

The generated code is tweaked in a few places, so make sure to diff the output against the git version,
and re-apply any tweaks.

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
await hedgehog.move(0, 100);
await hedgehog.move(2, 100);

// hedgehog.set_servo(port, enabled, position)
await hedgehog.setServo(0, true, 1023);

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
