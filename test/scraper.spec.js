import bot from 'nodemw';
import chai, { assert } from 'chai';
import fsp from 'fs-promise';
import isPromise from 'is-promise';
import malformedArticles from './data/test_malformed_articles';
import malformedLinks from './data/test_malformed_links';
import sinon from 'sinon';
import Scraper from '../scraper';
import testArticles from './data/test_articles';
import testBacklinks from './data/test_backlinks';
import testOutput from './data/test_output';
import Utils from '../etc/utils';
import 'babel-polyfill';

let scraper = {};
let stub = {};
let client = {};
let res = {};

describe('Scraper', async function() {
  before(function() {
    scraper = new Scraper('nosubject.com', '/', false, true);
    scraper.test = true;
  });
  describe('Scraper#fetchAllArticles()', async function() {
    before(function() {
      sinon.stub(scraper.client, "getAllPages").callsArgWith(0, null, malformedArticles);
      sinon.stub(fsp, 'outputFile').returns(null);
      scraper.save = true;
    });

    it('should return a promise', function() {
      assert(isPromise(scraper.fetchAllArticles()));
    });

    it('should fetch a list of articles', async function(done) {
      try {
        let response = await scraper.fetchAllArticles();
        assert.ok(response);
        assert.isArray(response);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('should call method to fix utf8 encoding', async function (done) {
      this.timeout(15000);
      sinon.stub(Utils, "fixUtf8").returns(JSON.stringify(testArticles));
      try {
        let response = await scraper.fetchAllArticles();
        assert.ok(response);
        sinon.assert.called(scraper.client.getAllPages);
        sinon.assert.called(Utils.fixUtf8);
        done();
      } catch (error) {
        done(error);
      }
      Utils.fixUtf8.restore();
    });

    it('should fix any malformed utf8 characters', async function (done) {
      try {
        let response = await scraper.fetchAllArticles();
        assert.ok(response);
        assert.notEqual(response, malformedArticles, 'the response should at least be different from the default client\'s response');
        assert.notEqual(response[response.length - 1].title, 'Ã‰crits', 'the utf8 fixer should at least change the string');
        assert.equal(response[response.length - 1].title, 'Écrits', 'the utf8 fixer should parse invalid characters');
        done();
      } catch (error) {
        done(error);
      }
    });

    it('if the user opts to save, it should write the response data to articles.json', async function(done) {
      this.timeout(15000);
      try {
        let response = await scraper.fetchAllArticles();
        assert.equal(scraper.save, true);
        done();
      } catch (error) {
        done(error);
      }
    });

    after(function() {
      fsp.outputFile.restore();
      scraper.client.getAllPages.restore()
    });
  });

  describe('Scraper#fetchArticleBacklinks()', function() {
    before(function() {
      let fspPromise = sinon.stub(fsp, 'outputFile').returns(null);
      let outputPromise = sinon.stub(scraper.client, 'getBacklinks');
      outputPromise.onCall(1).callsArgWith(1, null, testBacklinks[0].links);
      outputPromise.onCall(2).callsArgWith(1, null, testBacklinks[0].links);
      outputPromise.onCall(3).callsArgWith(1, null, [{"pageid":2805,"ns":0,"title":"Knowledge"}]);
      outputPromise.onCall(4).callsArgWith(1, null, [{"pageid":9254,"ns":0,"title":"Alexandre Koyré","redirect":""}]);
      outputPromise.onCall(5).callsArgWith(1, null, malformedLinks);
    });

    it('should return a promise', function() {
      assert(isPromise(scraper.fetchArticleBacklinks()));
    });

    it('should fetch backlink data', async function(done) {
      this.timeout(15000);
      try {
        let response = await scraper.fetchArticleBacklinks('Slavoj Zizek Cocaine Fest 2012: The Porno');
        assert.ok(response);
        assert.isArray(response);
        assert.equal(JSON.stringify(response), JSON.stringify(testBacklinks[0].links), 'given well formed data, the response from the scraper is the same as the response from the nodemw bot');
        done();
      } catch (error) {
        done(error);
      }
    });

    it('if the user opts to save, it should check to see if backlinks directory exists and create it if it doesn\'t', async function(done) {
      this.timeout(15000);
      try {
        let response = await scraper.fetchArticleBacklinks('Slavoj Zizek Cocaine Fest 2012: The Porno');
        sinon.assert.called(fsp.outputFile);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('should provide proper callback method to nodemw client', async function (done) {
      this.timeout(15000);
      let data = [{"pageid":2805,"ns":0,"title":"Knowledge"}];
      try {
        let response = await scraper.fetchArticleBacklinks('Absolute knowledge');
        assert.ok(response);
        sinon.assert.called(scraper.client.getBacklinks);
        assert.equal(response[0].title, data[0].title, 'the test data and data provided by the callback should be the same');
        done();
      } catch (error) {
        done(error);
      }
      scraper.client.getBacklinks.restore();
    });

    it('should call method to fix utf8 encoding', async function (done) {
      this.timeout(15000);
      sinon.stub(Utils, "fixUtf8").returns(JSON.stringify([{"pageid":9254,"ns":0,"title":"Alexandre Koyré","redirect":""}]));
      try {
        let response = await scraper.fetchArticleBacklinks('Alexandre Koyre');
        sinon.assert.called(Utils.fixUtf8);
        done();
      } catch (error) {
        done(error);
      }
      Utils.fixUtf8.restore();
    });

    it('should fix any malformed utf8 characters', async function (done) {
      this.timeout(15000);
      sinon.stub(scraper.client, "getBacklinks").callsArgWith(1, null, malformedLinks);
      try {
        let response = await scraper.fetchArticleBacklinks('Ecrits');
        assert.ok(response);
        assert.notEqual(response, malformedLinks);
        assert.equal(response[response.length - 2].title, 'Écrits', 'the utf8 parser should correct the accent mark over the E');
        assert.equal(response[response.length - 1].title, 'Écrits: A Selection', 'the utf8 parser should correct the accent mark over the E');
        done();
      } catch (error) {
        done(error);
      }
    });

    after(function() {
      scraper.client.getBacklinks.restore();
      fsp.outputFile.restore();
      res = {};
    });
  });

  describe('Scraper#generateArticles', function () {
    before(function () {
      let readJson = sinon.stub(fsp, "readJson").withArgs('./output/articles.json').returns(Promise.resolve(testArticles));
      readJson.onCall(1).throws();
      let fetchArticlesStub = sinon.stub(scraper, "fetchAllArticles").returns(Promise.resolve(testArticles));
      fetchArticlesStub.returns(Promise.resolve(testArticles));
    });

    it('should check to see if the article file exists and require it if it does', async function(done) {
      try {
        let response = await scraper.generateArticles();
        assert.ok(response);
        sinon.assert.called(fsp.readJson);
        assert.equal(response, testArticles, 'the stub data and required data are the same');
        done();
      } catch (error) {
        done(error);
      }
    });

    it('should fetch data from wiki if articles.json doesn\'t exist', async function(done) {
      try {
        let response = await scraper.generateArticles();
        sinon.assert.called(scraper.fetchAllArticles);
        done();
      } catch (error) {
        done(error);
      }
    });

    after(function () {
      fsp.readJson.restore();
      scraper.fetchAllArticles.restore();
    })
  })

  describe('Scraper#generateArticleBacklinks()', function() {
    before(function() {
      stub = {
        article: {
          title: 'Dandyism',
          links: [{
            pageid: 1000,
            ns: 0,
            title: 'Wizardry'
          }]
        }
      };
      sinon.stub(fsp, 'readJson').returns(Promise.resolve(JSON.stringify(stub)));
    });

    it('should check to see if the article file exists and require that file if it does', async function(done) {
      try {
        let response = await scraper.generateArticleBacklinks('Dandyism');
        sinon.assert.called(fsp.readJson);
        assert.equal(response, JSON.stringify(stub), 'the stub data and required data are the same');
        done();
      } catch (error) {
        done(error);
      }
    });

    after(function() {
      fsp.readJson.restore();
    })
  });

  describe('Scraper#populateArticleBacklinks()', async function() {
    before(function() {
      sinon.stub(fsp, 'outputFile').withArgs('./output/backlinks.json').returns(Promise.resolve(null));
      sinon.stub(scraper, 'generateArticleBacklinks')
           .withArgs(testArticles[0]).returns(Promise.resolve(testBacklinks[0].links))
           .withArgs(testArticles[1]).returns(Promise.resolve(testBacklinks[1].links))
           .withArgs(testArticles[2]).returns(Promise.resolve(testBacklinks[2].links));
    });

    it('called the same number of times as the array size', async function(done) {
      try {
        let response = await scraper.populateArticleBacklinks(testArticles);
        sinon.assert.callCount(scraper.generateArticleBacklinks, testArticles.length);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('appends a list of backlinked articles to each article', async function(done) {
      this.timeout(15000);
      try {
        let response = await scraper.populateArticleBacklinks(testArticles);
        assert.ok(response);
        assert.equal(JSON.stringify(response), JSON.stringify(testBacklinks));
        done();
      } catch (error) {
        done(error);
      }
    });

    it('writes backlinks.json once it appended all backlinks to articles', async function(done) {
      this.timeout(15000);
      try {
        let response = await scraper.populateArticleBacklinks(testArticles);
        sinon.assert.called(fsp.outputFile);
        done();
      } catch (error) {
        done(error);
      }
    });

    after(function() {
      fsp.outputFile.restore();
      scraper.generateArticleBacklinks.restore();
    });
  });
});

describe('Utils', function () {
  describe('Utils#fixUtf8', function () {
    it('should fix malformed utf8 encoded strings: ÃƒÅ tres vivants --> Êtres vivants', function () {
      assert.equal(Utils.fixUtf8('ÃƒÅ tres vivants'), 'Êtres vivants');
    });

    it('should fix malformed utf8 encoded strings: Ãƒâ€°chec --> Échec', function () {
      assert.equal(Utils.fixUtf8('Ãƒâ€°chec'), 'Échec');
    });

    it('should fix malformed utf8 encoded strings: ?â€°crits --> Écrits', function () {
      assert.equal(Utils.fixUtf8('?â€°crits'), 'Écrits');
    });

    it('should leave question marks at the end of strings alone', function () {
      assert.equal(Utils.fixUtf8('Today, Iraq. Tomorrow ... Democracy?'), 'Today, Iraq. Tomorrow ... Democracy?');
    })
  });
});
