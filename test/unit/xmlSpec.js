/*global angular, describe, expect, it, beforeEach, module, inject, jasmine, spyOn*/

describe('xml', function () {

  var xmlString = '<tests><test id="1"/></tests>';

  beforeEach(module('xml'));

  describe('xmlFilter', function () {

    var filter,
        parser;

    beforeEach(inject(function (xmlParser, xmlFilter) {
      filter = xmlFilter;
      parser = xmlParser;
    }));

    it('will use the xmlParser.parse() method', function () {
      spyOn(parser, 'parse');
      filter(xmlString);
      expect(parser.parse).toHaveBeenCalledWith(xmlString);
    });

    it('will return a ng.element object', function () {
      var returnValue;
      spyOn(angular, 'element').andReturn('ng.xml.element');
      returnValue = filter(xmlString);
      expect(returnValue).toBe('ng.xml.element');
      angular.element.andCallThrough();
    });

    it('should integrate as expected', function () {
      var xml = filter(xmlString);
      expect(xml.find('test').length).toBe(1);
    });

  });

  describe('XMLParser', function () {

    var win;

    beforeEach(inject(function ($window) {
      win = $window;
    }));

    describe('DOMParser', function () {

      var DOMParser;

      beforeEach(function () {
        DOMParser           = jasmine.createSpy('DOMParser');
        DOMParser.prototype = jasmine.createSpyObj('prototype', ['parseFromString']);
        win.DOMParser       = DOMParser;
        win.ActiveXObject   = null;
      });

      it('will use the DOMParser class when it is available', inject(function (xmlParser) {
        expect(DOMParser).toHaveBeenCalled();
        xmlParser.parse(xmlString);
        expect(DOMParser.prototype.parseFromString).toHaveBeenCalled();
      }));

    });

    describe('ActiveXObject', function () {

      var ActiveXObject;

      beforeEach(function () {
        ActiveXObject           = jasmine.createSpy('ActiveXObject');
        ActiveXObject.prototype = jasmine.createSpyObj('prototype', ['loadXml']);
        win.ActiveXObject       = ActiveXObject;
        win.DOMParser           = null;
      });

      it('will use the ActiveXObject class when DOMParser is not available', inject(function (xmlParser) {
        expect(ActiveXObject).toHaveBeenCalled();
        xmlParser.parse(xmlString);
        expect(ActiveXObject.prototype.loadXml).toHaveBeenCalled();
      }));

    });

  });

  /* I'd be super stoked if anyone can get 
   * this test working.
  describe('httpInterceptor', function () {

    var interceptor,
        deferred,
        response,
        promise;

    beforeEach(inject(function ($q, xmlHttpInterceptor) {
      deferred    = $q.defer();
      response    = {data: xmlString};
      promise     = deferred.promise;
      interceptor = xmlHttpInterceptor;
    }));

    it('will return a ng.element object', function () {
      var done = false;
      interceptor(promise).then(function (el) {
        dump(el);
        expect(el).not.toBeUndefined();
        done = true;
      });
      deferred.resolve(response);
      waitsFor(function () {
        return done;
      });
    });

  });
  */

});

