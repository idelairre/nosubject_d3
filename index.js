import bot from 'nodemw';
import prompt from 'prompt';
import fs from 'fs';
import byline from 'byline';
import { handleErrors } from './decorators';
import { decorate } from 'core-decorators';
import console from 'better-console';

@handleErrors
class Scraper {
  constructor() {
    // pass configuration object
    this.client = new bot({
      server: 'nosubject.com',  // host name of MediaWiki-powered site
      path: '/',                  // path to api.php script
      debug: false                 // is more verbose when set to true
    });
    this.articles = [];
    this.backlinks = [];
    this.index = [];
    this.categories = [];
  }

  prompt() {
    console.log(' 1: get article,\n 2: get all articles,\n 3: get article backlinks,\n 4: get article categories,\n 5: get article external links,\n 6: get categories, \n 7: get pages in category, \n 8: generate article database,\n 9: generate backlink database,\n 10: generate backlink JSON,\n 11: generate category database,\n 12: generate external link database,\n 13: generate label anchors,\n14: generate links');
    return prompt.get(['option', 'object'], (error, result) => {
      switch(parseInt(result.option)) {
        case 1:
          this.getArticle(result.object);
          break;
        case 2:
          this.getAllArticles();
          break;
        case 3:
          this.getBacklinks(result.object);
          break;
        case 4:
          this.getArticleCategories(result.object);
          break;
        case 5:
          this.getExternalLinks(result.object);
          break;
        case 6:
          this.getCategories();
          break;
        case 7:
          this.getPagesInCategory(result.object);
          break;
        case 8:
          this.generateArticleDatabase();
          break;
        case 9:
          this.generateBacklinkDatabase();
          break;
        case 10:
          this.generateBacklinksJSON();
          break;
        case 11:
          this.generateCategoryDatabase();
          break;
        case 12:
          this.generateExternalLinkDatabase();
          break;
        case 13:
          this.generateNodesAndLabelAnchors();
          break;
        case 14:
          this.generateLinks();
          break;
      }
    });
  }

  /*
  NB: modified code from Lenny Domnitser. Blow is his original copyright info

  This is the unpacked source code of the "fix encoding" bookmarklet,
  available at <http://domnit.org/bookmarklets/>.

  Version 1.1

  2007 Lenny Domnitser, copyright waived
  */

  fixUtf8(string) {
    const win2byte = {
      '\u20AC': '\x80', '\u201A': '\x82', '\u0192': '\x83', '\u201E': '\x84',
      '\u2026': '\x85', '\u2020': '\x86', '\u2021': '\x87', '\u02C6': '\x88',
      '\u2030': '\x89', '\u0160': '\x8A', '\u2039': '\x8B', '\u0152': '\x8C',
      '\u017D': '\x8E', '\u2018': '\x91', '\u2019': '\x92', '\u201C': '\x93',
      '\u201D': '\x94', '\u2022': '\x95', '\u2013': '\x96', '\u2014': '\x97',
      '\u02DC': '\x98', '\u2122': '\x99', '\u0161': '\x9A', '\u203A': '\x9B',
      '\u0153': '\x9C', '\u017E': '\x9E', '\u0178': '\x9F'
    };

    let codeArray = [];
    for (let code in win2byte) {
      codeArray.push(code);
    }
    let codes = '(?:[\\x80-\\xBF]|' + codeArray.join('|') + ')';
    let pat = new RegExp('[\\xC2-\\xDF]' + codes + '|[\\xE0-\\xEF]' + codes + '{2}' + '|[\\xF0-\\xF4]' + codes + '{3}', 'g');

    function getbyte(s) {
      let b = win2byte[s];
      return b || s;
    }

    function sub(s) {
      let array = [];
      for (let code in s.substring(1)) {
        array.push(getbyte(s[1 + parseInt(code)]));
      }
      s = s[0] + array.join('');
      return decodeURIComponent(escape(s));
    }

    function fix(string) {
      console.log(`string after string to fix: ${string}`);
      string = string.replace(pat, (result) => {
        return sub(result);
      });
      console.log(`string after first pass: ${string}`);
      string = string.replace(pat, (result) => {
        return sub(result);
      });
      console.log(`string after second pass: ${string}\n`);
      return string;
    }

    return fix(string);

  };

  generateArticleDatabase() {
    this.getAllArticles().then((response) => {
      for (let item in this.index) {
        this.getArticle(this.index[item]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  generateBacklinkDatabase() {
    console.log('generating backlink database...');
    this.getAllArticles().then((response) => {
      for (let item in this.index) {
        this.getBacklinks(this.index[item]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  generateCategoryDatabase() {
    this.getCategories().then((response) => {
      for (let item in this.categories) {
        this.getPagesInCategory(this.categories[item]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  generateExternalLinkDatabase() {
    console.log('generating external link database...');
    this.getAllArticles().then((response) => {
      for (let item in this.index) {
        this.getExternalLinks(this.index[item]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  generateIndex(data, callback) {
    let string = '';
    for (let i in data) {
      this.index.push(data[i].title);
      string += `${data[i].title}\n`;
    }
    data = string;
    if (callback) {
      return callback(data);
    } else {
      return data;
    }
  }

  generateBacklinksJSON() {
    fs.readdir('./output/backlinks', (error, files) => {
      this.handleErrors(error);
      let i = 0, requests = files.length;
      let jsonArray = [];
      while (files.length > i) {
        let article = files[i];
        this.generateBacklinkJSON(article).then((response) => {
          jsonArray.push(response);
          requests -= 1;
          if (requests === 0) {
            console.log('json array:', jsonArray);
            fs.writeFile('output/backlinks.json', JSON.stringify(jsonArray, null, 3), (error) => {
              this.handleErrors(error);
            });
          }
        });
        i += 1;
      }
    });
  }

  generateBacklinkJSON(article) {
    return new Promise((resolve, reject) => {
      let stream = fs.createReadStream(`./output/backlinks/${article}`, { encoding: 'utf8'});
      stream = byline.createStream(stream);
      stream.on('data', (line) => {
        // console.log(`${article}: ${line}`);
        let json = {
          title: article.replace(/.json/, ''),
          links: JSON.parse(line)
        };
        resolve(json);
      });
    });
  }

  generateBacklinkD3Nodes() {
    let stream = fs.createReadStream(`./output/backlinks.json`, { encoding: 'utf8'});
    stream = byline.createStream(stream);
    stream.on('data', (line) => {

    });
  }

  getAllArticles(callback) {
    let pages = {};
    return new Promise((resolve, reject) => {
      this.client.getAllPages((error, data) => {
        if (error) {
          reject(error);
        } else {
          // need to make options for generating a database
          this.generateIndex(data, (response) => {
            pages = response;
            console.log(pages);
            pages = this.fixUtf8(JSON.stringify(data, null, 3));
            fs.writeFile('output/articles.json', pages, (error) => {
              this.handleErrors(error);
            });
            resolve(pages);
          });
        };
      });
    });
  }

  getArticle(article) {
    return new Promise((resolve, reject) => {
      this.client.getArticle(article, (error, data) => {
        if (error) {
          reject(error);
        } else {
          this.save(article, data);
          resolve(data);
        }
      });
    });
  }

  getArticleCategories(article) {
    console.log('fetching categories');
    let categories = {};
    return new Promise((resolve, reject) => {
      this.client.getArticleCategories(article, (error, data) => {
        if (error) {
          reject(error);
        } else {
          categories = this.fixUtf8(JSON.stringify(data));
          this.save('article_categories', `${article}`, categories);
          resolve(categories);
        }
      });
    });
  }

  getBacklinks(article) {
    let links = {};
    return new Promise((resolve, reject) => {
      this.client.getBacklinks(article, (error, data) => {
        if (error) {
          reject(error);
        } else {
          links = this.fixUtf8(JSON.stringify(data));
          this.save('backlinks', `${this.fixUtf8(article)}`, links);
          resolve(links);
        }
      });
    });
  }

  getExternalLinks(article) {
    // console.log('fetching external links...');
    let links = {};
    return new Promise((resolve, reject) => {
      this.client.getExternalLinks(article, (error, data) => {
        if (error) {
          reject(error);
        } else {
          links = this.formatLinks(data);
          this.save('external_links', `${article}_external_links`, links);
          resolve(links);
        }
      });
    });
  }

  getCategories() {
    let categories = [];
    return new Promise((resolve, reject) => {
      this.client.getCategories((error, data) => {
        if (error) {
          reject(error);
        } else {
          categories = data;
          this.categories = categories;
          resolve(categories);
        }
      });
    });
  }

  generateNodesAndLabelAnchors() {
    let labelAnchors = [];
    let nodes = [];
    let i = 0;
    let articlesJson = require('./output/articles.json');
    while (i < articlesJson.length) {
      let node = {
        label: articlesJson[i].title
      };
      console.log(i + ': ' + JSON.stringify(node));
      nodes.push(node);
      labelAnchors.push({ node : node });
      labelAnchors.push({ node : node });
      console.log(articlesJson.length - i, ' left');
      if (i === articlesJson.length - 1) {
        console.log('called', labelAnchors);
        fs.writeFile('output/labelAnchors.json', JSON.stringify(labelAnchors, null, 3), (error) => {
          this.handleErrors(error);
        });
        fs.writeFile('output/nodes.json', JSON.stringify(nodes, null, 3), (error) => {
          this.handleErrors(error);
        });
      }
      i += 1;
    }
  }

  generateLinks() {
    // note this is arbitrary for now
    let links = [];
    let labelAnchorLinks = [];
    let articlesJson = require('./output/articles.json');
    let i = 0, j = 0;
    while (i < articlesJson.length) {
      while (j < i) {
          links.push({
            source : i,
            target : j,
            weight : 1
          });
          j += 1;
        }

        labelAnchorLinks.push({
          source : i * 2,
          target : i * 2 + 1,
          weight : 1
        });
        if (i === articlesJson.length - 1 && j === articlesJson.length - 1) {
          fs.writeFile('output/links.json', JSON.stringify(links, null, 3), (error) => {
            this.handleErrors(error);
          });
          fs.writeFile('output/labelAnchorLinks.json', JSON.stringify(labelAnchorLinks, null, 3), (error) => {
            this.handleErrors(error);
          });
      }
      i += 1;
    }
  }

  getPagesInCategory(category) {
    let pages = [];
    new Promise((resolve, reject) => {
      this.client.getPagesInCategory(category, (error, data) => {
        if (error) {
          reject(error);
        } else {
          pages = data;
          // pages = this.formatCategoryPages(pages);
          // console.log(pages.toJSON());
          this.save('categories', `${category}_pages`, JSON.stringify(pages));
          resolve(pages);
        }
      });
    });
  }

  save(location, filename, data) {
    filename = filename.replace(/\//g, "-");
    fs.writeFile(`output/${location}/${filename}.json`, data, (error) => {
      this.handleErrors(error);
    });
  }

}

let scraper = new Scraper();

scraper.prompt();
