'use strict';

var Jasmine = require('jasmine'),
  JasmineReporters = require('jasmine-reporters'),
  JasmineSpecReporter = require('jasmine-spec-reporter'),
  Joi = require('joi'),
  Path = require('path'),
  _ = require('lodash');


module.exports = function(grunt) {

  grunt.registerMultiTask('jasmine', function() {

    var done = this.async(),
      options = this.options(),
      jasmine = new Jasmine();

    // JasmineSpecReporter - for jasmine-spec-reporter
    // JUnitXmlReporter, NUnitXmlReporter, TapReporter, TeamCityReporter, TerminalReporter
    var reporterNames = [ 'JasmineSpecReporter'].concat(Object.keys(JasmineReporters));

    // validate options
    var optionsValidationRet = Joi.validate(options, Joi.object().keys({
      reporters: Joi.array().items(
        Joi.alternatives().try(
          Joi.valid(reporterNames)
            .description('The type of reporter to use.'),
          Joi.object().keys({
            type: Joi.valid(reporterNames).required()
              .description('The type of reporter to use.'),
            options: Joi.object().unknown(true)
              .description('The options to pass to the constructor of the reporter.')
          })
        )
      ).min(1).default([ 'JasmineSpecReporter' ])
        .description('A list of reporters to add to Jasmine')
    }));

    if (optionsValidationRet.err) {
      return done(optionsValidationRet.err);
    }

    options = optionsValidationRet.value;

    function getReporter(type, options) {
      if (type == 'JasmineSpecReporter') {
        return new JasmineSpecReporter(options);
      }
      return new JasmineReporters[type](options)
    }

    // add all reporters to jasmine
    options.reporters.forEach(function(reporter) {
      if (typeof reporter == 'string') {
        jasmine.addReporter(getReporter(reporter));
      } else {
        jasmine.addReporter(getReporter(reporter.type, reporter.options));
      }
    });

    // resolve the full paths of each spec file
    jasmine.specFiles = _.map(this.filesSrc, function(src) {
      return Path.resolve(src);
    });

    jasmine.onComplete(done);

    jasmine.execute();
  });
};