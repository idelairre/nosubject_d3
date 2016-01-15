import chai, { assert } from 'chai';
import graphGenerator from '../app/source/graphGenerator';
import testBacklinks from './data/test_backlinks';
import { difference } from 'lodash';

describe('GraphGenerator', function() {
  beforeEach(function() {
    graphGenerator.storedNodes = [];
    graphGenerator.storedArticles = [];
  });

  describe('GraphGenerator#fetchArticle', function() {
    it('fetches an article from backlinks.json by title', function() {
      let article = graphGenerator.fetchArticle("Act");
      assert.ok(article);
      assert.equal(article.title, "Act");
    });
  });

  describe('GraphGenerator#findNode', function() {
    it('returns the node with the given label amongs the given nodes', async function(done) {
      try {
        let nodes = await graphGenerator.generateLinkedNodes('Act');
        let node = await graphGenerator.findNode('Act', nodes)
        assert.ok(nodes);
        assert.ok(node);
        assert.equal(node.label, 'Act');
        done();
      } catch (error) {
        done(error)
      }
    });
  });

  describe('GraphGenerator#generateArticles', function() {
    it('generates a cache of articles that have atleast the minimum link count given', async function(done) {
      try {
        let articles = await graphGenerator.generateArticles(15);
        assert.ok(articles);
        assert.isArray(articles);
        let articlesBelowLinkCount = articles.some((article) => {
          return article.links.length < 15;
        });
        assert.equal(articlesBelowLinkCount, false);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('generates no undefined elements', async function(done) {
      try {
        let articles = await graphGenerator.generateArticles(15);
        let undefinedElements = articles.some((article) => {
          return article === undefined;
        });
        assert.equal(undefinedElements, false);
        done();
      } catch (error) {
        done(error)
      }
    });

    it('generates no duplicate articles', async function(done) {
      try {
        let articles = await graphGenerator.generateArticles(15);
        let duplicates = [];
        for (let i = 0; i < articles.length - 1; i += 1) {
          if (articles[i + 1].title === articles[i].title) {
            duplicates.push(articles[i]);
          }
        }
        assert.equal(duplicates.length, 0);
        done();
      } catch (error) {
        done(error)
      }
    });

    it('is alphabetically sorted', async function(done) {
      try {
        let articles = await graphGenerator.generateArticles(15);
        let duplicates = [];
        let sortedArticles = articles.sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        });
        assert.equal(sortedArticles, articles);
        done();
      } catch (error) {
        done(error)
      }
    });
  });

  describe('GraphGenerator#generateNodes', function() {
    it('generates the given number of nodes', async function(done) {
      try {
        let articles = await graphGenerator.generateArticles(15);
        let nodes = graphGenerator.generateNodes(15, articles);
        assert.equal(nodes.length, 15);
        done();
      } catch (error) {
        done(error)
      }
    });
  });

  describe('GraphGenerator#generateLinkedNodes', function() {
    it('generates the given node', async function(done) {
      try {
        let nodes = await graphGenerator.generateLinkedNodes('1968');
        let node = await graphGenerator.findNode('1968', nodes);
        assert.equal(node.label, '1968')
        done();
      } catch (error) {
        done(error);
      }
    });

    it('generates no duplicate articles', async function(done) {
      try {
        await graphGenerator.generateLinkedNodes('Alienation');
        let articles = graphGenerator.storedArticles;
        let sortedArticles = articles.sort((a, b) => {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        });
        let duplicates = [];
        for (let i = 0; i < articles.length - 1; i += 1) {
          if (articles[i + 1].title === articles[i].title) {
            duplicates.push(articles[i]);
          }
        }
        assert.equal(duplicates.length, 0);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('generates no duplicate nodes', async function(done) {
      try {
        let nodes = await graphGenerator.generateLinkedNodes('Alienation');
        let sortedNodes = nodes.sort((a, b) => {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        });
        let duplicates = [];
        for (let i = 0; i < sortedNodes.length - 1; i += 1) {
          if (sortedNodes[i + 1].label === sortedNodes[i].label) {
            duplicates.push(sortedNodes[i]);
          }
        }
        assert.equal(duplicates.length, 0);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('only generates nodes that link to or from the target node', async function(done) {
      try {
        let nodes = await graphGenerator.generateLinkedNodes('Alienation');
        let article = graphGenerator.fetchArticle('Alienation');

        let testNode = nodes[nodes.length - 1];
        let articles = graphGenerator.storedArticles;
        let testArticle = await graphGenerator.fetchArticle(testNode.label, articles);
        let foundAlienation = false;
        for (let i in testArticle.links) {
          if (testArticle.links[i].title === 'Alienation') {
            foundAlienation = true;
          }
        }
        assert.isTrue(foundAlienation, 'the node at the end of the array is backlinked to the test node');

        foundAlienation = false;
        let foundAlienationArr = [];
        for (let i in articles) {
          for (let j in articles[i].links) {
            if (articles[i].links[j].title === 'Alienation') {
              foundAlienation = true;
              foundAlienationArr.push(foundAlienation);
            }
            foundAlienation = false;
          }
        }
        assert.isFalse(foundAlienationArr.some((foundAlienation) => {
          return !foundAlienation
        }));

        let truthArray = article.links.map((link) => { // the article's links are assumed to link from the article hue hue hue
          if (graphGenerator.fetchArticle(link.title) !== undefined) {
            return link.title;
          }
        });
        truthArray.push(article.title);
        for (let i = 0; nodes.length > i; i += 1) {
          let found = graphGenerator.fetchArticle(nodes[i].label);
          for (let j = 0; found.links.length > j; j += 1) {
            if (found.links[j].title === 'Alienation') {
              truthArray.push(found.title);
            }
          }
        }
        truthArray = truthArray.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });

        truthArray = truthArray.filter((item, pos) => {
          return truthArray.indexOf(item) === pos;
        });

        truthArray = truthArray.filter((element) => {
          return (typeof element !== "undefined");
        });

        truthArray = truthArray.map((article) => {
          return !!article;
        }); // so its an array of truth
        assert.equal(nodes.length, truthArray.length, 'the combined total of the links in the test node and all the nodes that reference the test node is the same as the amount of nodes generated'); // its so true
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
