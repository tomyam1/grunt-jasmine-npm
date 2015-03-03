# grunt-jasmine-npm
Run jasmine tests with the [official](https://github.com/jasmine/jasmine-npm) runner.
Uses [jasmine-reporters](https://github.com/larrymyers/jasmine-reporters) or [jasmine-spec-reporter](https://github.com/bcaudan/jasmine-spec-reporter) for reporting.


## Example


    jasmine: {
      test: {
        options: {
          // defaults to [ 'JasmineSpecReporter' ]
          reporters: [
            'TerminalReporter'
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