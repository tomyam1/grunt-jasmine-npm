# grunt-jasmine-npm
Runs jasmine tests with the [official](https://github.com/jasmine/jasmine-npm) runner.
Uses [jasmine-reporters](https://github.com/larrymyers/jasmine-reporters) or [jasmine-spec-reporter](https://github.com/bcaudan/jasmine-spec-reporter) for reporting.

## Install

    npm install grunt-jasmine-npm


## Options

- `reporters` - A list of reporters to add to Jasmine. Defaults to `[ 'JasmineSpecReporter' ]`.

  Each item can be either a string or an object.

  If its a string, it must be 'JasmineSpecReporter' or one the reporter names in jasmine-reporters: 'JUnitXmlReporter', 'NUnitXmlReporter', 'TapReporter', 'TeamCityReporter' or 'TerminalReporter'.
  No options will be passed to the constructor of the reporter.

  If its an object, it must have a `type` property as above. Its can have an `options` property which will be passed to the constructor of the reporter.


## Example

To report to the console with jasmine-spec-reporter (with its default options) write a jUnit report to the reports directory with the JUnitXmlReporter reporter of jasmine-reporters:


    jasmine: {
      test: {
        options: {
          reporters: [
            'JasmineSpecReporter'
            {
              type: 'JUnitXmlReporter',
              options: {
                savePath: 'reports'
              }
            }
          ]
        },
        src: [

          // helpers
          'src/**/*.helper.js'
          'src/**/*.helper.coffee'

          // specs
          'src/**/*.spec.js'
          'src/**/*.spec.coffee'
        ]
      },
    },

