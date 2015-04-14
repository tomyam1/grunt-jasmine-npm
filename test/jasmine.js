'use strict';

var Chai = require('chai'),
  SinonChai = require("sinon-chai"),
  Sinon = require('sinon'),
  Grunt = require('grunt'),
  Path = require('path'),
  JasmineReporters = require('jasmine-reporters'),
  ExitCodeReporter = require('jasmine/lib/reporters/exit_code_reporter'),
  JasmineSpecReporter = require('jasmine-spec-reporter'),
  _ = require('lodash'),
  expect = Chai.expect;

Chai.use(SinonChai);


describe('jasmine', function() {

  var task, Jasmine;

  beforeEach(function() {

    delete require.cache[require.resolve('jasmine')];
    delete require.cache[require.resolve('../tasks/jasmine')];
    Jasmine = require('jasmine');

    Sinon.spy(Jasmine.prototype, 'addReporter');

    task = require('../tasks/jasmine');
    task(Grunt);

    Grunt.task.init([]);
    Grunt.config.init({});
    Grunt.task.options({ done: null, error: null });

    Grunt.log.muted = true;
  });

  describe('jasmine.specFiles', function() {

    var specFiles;

    beforeEach(function() {
      // get the specFiles at the time that jasmuine.execute() was called
      // don't know why, but we can't do any expectation inside this execute wrapper
      // they will never report to Mocha if failed
      var execute = Jasmine.prototype.execute;
      Jasmine.prototype.execute = function() {
        specFiles = _.cloneDeep(this.specFiles);
        execute.apply(this, arguments);
      };
    });

    it('should be an empty array when no source are given to the task', function(done) {
      Grunt.config('jasmine', {
        test: { }
      });
      Grunt.task.options({ done: function() {
        expect(specFiles).to.eql([]);
        done();
      } });
      Grunt.task.run('jasmine:test');
      Grunt.task.start();
    });

    it('should be the source files given to the task, resolved to full paths', function(done) {
      Grunt.config('jasmine', {
        test: {
          src: [
            'test/spec/**/*.spec.js' ,
            '!test/spec/fail.spec.js'
          ]
        }
      });
      Grunt.task.options({ done: function() {
        expect(specFiles).to.eql([
          Path.resolve('test/spec/test1.spec.js'),
          Path.resolve('test/spec/test2.spec.js')
        ]);
        done();
      } });
      Grunt.task.run('jasmine:test');
      Grunt.task.start();
    });


  });

  describe('reporters', function() {

    describe('when not given', function() {
      it('should add jasmine-spec-reporter', function(done) {
        Grunt.config('jasmine', {
          test: { }
        });
        Grunt.task.run('jasmine:test');
        Grunt.task.options({ done: function() {
          // the second call is due to onComplete() (its an exit_code_reporter)
          expect(Jasmine.prototype.addReporter).to.have.callCount(2);
          expect(Jasmine.prototype.addReporter.firstCall.args[0]).to.be.an.instanceof(JasmineSpecReporter);
          expect(Jasmine.prototype.addReporter.secondCall.args[0]).to.be.an.instanceof(ExitCodeReporter);
          done();
        } });
        Grunt.task.start();
      });
    });

    describe('when element is a valid reporter name', function() {
      it('should add it as a reporter', function(done) {
        Grunt.config('jasmine', {
          test: {
            options: {
              reporters: [
                'JUnitXmlReporter',
                'NUnitXmlReporter',
                'TapReporter',
                'TeamCityReporter',
                'TerminalReporter',
                'JasmineSpecReporter'
              ]
            }
          }
        });
        Grunt.task.run('jasmine:test');
        Grunt.task.options({ done: function() {
          // the second call is due to onComplete() (its an exit_code_reporter)
          expect(Jasmine.prototype.addReporter).to.have.callCount(7);
          expect(Jasmine.prototype.addReporter.getCall(0).args[0]).to.be.an.instanceof(JasmineReporters.JUnitXmlReporter);
          expect(Jasmine.prototype.addReporter.getCall(1).args[0]).to.be.an.instanceof(JasmineReporters.NUnitXmlReporter);
          expect(Jasmine.prototype.addReporter.getCall(2).args[0]).to.be.an.instanceof(JasmineReporters.TapReporter);
          expect(Jasmine.prototype.addReporter.getCall(3).args[0]).to.be.an.instanceof(JasmineReporters.TeamCityReporter);
          expect(Jasmine.prototype.addReporter.getCall(4).args[0]).to.be.an.instanceof(JasmineReporters.TerminalReporter);
          expect(Jasmine.prototype.addReporter.getCall(5).args[0]).to.be.an.instanceof(JasmineSpecReporter);
          expect(Jasmine.prototype.addReporter.getCall(6).args[0]).to.be.an.instanceof(ExitCodeReporter);
          done();
        } });
        Grunt.task.start();
      })
    });

    describe('when element is an object', function() {
      it('should add a reporter by the type property', function(done) {
        Grunt.config('jasmine', {
          test: {
            options: {
              reporters: [
                { type: 'JUnitXmlReporter' },
                { type: 'NUnitXmlReporter' },
                { type: 'TapReporter' },
                { type: 'TeamCityReporter' },
                { type: 'TerminalReporter' },
                { type: 'JasmineSpecReporter' }
              ]
            }
          }
        });
        Grunt.task.run('jasmine:test');
        Grunt.task.options({ done: function() {
          // the second call is due to onComplete() (its an exit_code_reporter)
          expect(Jasmine.prototype.addReporter).to.have.callCount(7);
          expect(Jasmine.prototype.addReporter.getCall(0).args[0]).to.be.an.instanceof(JasmineReporters.JUnitXmlReporter);
          expect(Jasmine.prototype.addReporter.getCall(1).args[0]).to.be.an.instanceof(JasmineReporters.NUnitXmlReporter);
          expect(Jasmine.prototype.addReporter.getCall(2).args[0]).to.be.an.instanceof(JasmineReporters.TapReporter);
          expect(Jasmine.prototype.addReporter.getCall(3).args[0]).to.be.an.instanceof(JasmineReporters.TeamCityReporter);
          expect(Jasmine.prototype.addReporter.getCall(4).args[0]).to.be.an.instanceof(JasmineReporters.TerminalReporter);
          expect(Jasmine.prototype.addReporter.getCall(5).args[0]).to.be.an.instanceof(JasmineSpecReporter);
          expect(Jasmine.prototype.addReporter.getCall(6).args[0]).to.be.an.instanceof(ExitCodeReporter);
          done();
        } });
        Grunt.task.start();
      })
    });
  });

});