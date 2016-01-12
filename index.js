import bot from 'nodemw';
import prompt from 'prompt';
import fsp from 'fs-promise';
import byline from 'byline';
import console from 'better-console';
import 'babel-polyfill';

class Scraper {
  constructor() {
    // pass configuration object
    this.client = new bot({
      server: 'nosubject.com',  // host name of MediaWiki-powered site
      path: '/',                  // path to api.php script
      debug: false                 // is more verbose when set to true
    });
    this.categories = [];
  }

  prompt() {
     console.log('1: generate backlink JSON');
     console.log('2: generate category database');
     console.log('3: generate article database');
    return prompt.get(['option', 'object'], (error, result) => {
      switch(parseInt(result.option)) {
        case 1:
          this.generateBacklinksJSON();
          break;
        case 2:
          this.generateCategoryDatabase();
          break;
        case 3:
          this.generateArticleDatabase()
          break;
      }
    });
  }

  checkArticleBacklinks(title) {
    for (let i = backlinks.length; i -= 1;) {
      if (title === backlinks[i].title) {
        console.log('found');
        for (let j = backlinks[i].links.length; j -= 1;) {
          console.log(backlinks[i].links[j]);
        }
      }
    }
  }

  /*
  NB: modified code from Lenny Domnitser. Below is his original copyright info

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
      // console.log(`string to fix: ${string}\n`);
      for (let i = 0; i < 5; i += 1) {
        // console.log(`string after ${i + 1} pass(es): ${string}\n`);
        string = string.replace(pat, (result) => {
          return sub(result);
        });
      }
      return string;
    }

    return fix(string);
  };

  generateArticleDatabase() {
    let articles = require('./output/articles.json');
    // console.log(JSON.stringify(articles));
    let articleArray = [];
    for (let i = 0; articles.length - 1 > i; i += 1) {
      console.log(articles[i])
      articleArray.push(articles[i].title);
    }
    fsp.writeFile('./output/articles.json', JSON.stringify(articleArray, null, 3), (error) => {
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

  async generateCategoryDatabase() {
    let categories = await this.getCategories();
    let categoriesArray = [];
    let requests = 0;
    let i = 0
    while (categories.length > i) {
      i += 1;
      let categoryHash = { title: null, articles: [] };
      categoryHash.title = categories[i];
      console.log(categories[i]);
      requests += 1;
      this.getArticlesInCategory(categories[i]).then((response) => {
        requests -= 1;
        categoryHash.articles = response;
        categoryHash.articles.map((article) => {
          article.title = this.fixUtf8(article.title);
          console.log('pushing ', article.title, ', ' , requests, ' articles left');
        });
        categoriesArray.push(categoryHash);
        if (requests === 0) {
          fsp.writeFile('./output/categories.json', JSON.stringify(categoriesArray, null, 3), (error) => {
            console.log(error);
          });
        }
      });
    }
  }

  generateIndex(data, callback) {
    let string = '';
    for (let i in data) {
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
    fsp.readdir('./output/backlinks', (error, articles) => {
      if (error) {
        throw new Error(error);
      }
      let i = 0, requests = articles.length;
      let jsonArray = [];
      while (articles.length > i) {
        i += 1;
        let article = articles[i];
        let backlinks = this.generateBacklinkJSON(article);
        jsonArray.push(backlinks);
        requests -= 1;
        if (requests === 0) {
          console.log('json array:', jsonArray);
          fsp.writeFile('output/backlinks.json', JSON.stringify(jsonArray, null, 3), (error) => {
          });
        }
      }
    });
  }

  generateBacklinkJSON(article) {
    return new Promise((resolve, reject) => {
      let stream = fsp.createReadStream(`./output/backlinks/${article}`, { encoding: 'utf8'});
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

  getAllArticles(callback) {
    let pages = {};
    return new Promise((resolve, reject) => {
      this.client.getAllPages((error, data) => {
        if (error) {
          reject(error);
        }
        this.generateIndex(data, (response) => {
          pages = response;
          console.log(pages);
          pages = this.fixUtf8(JSON.stringify(data, null, 3));
          fsp.writeFile('./output/articles.json', pages, (error) => {
            throw new Error(error);
          });
          resolve(pages);
        });
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
    return new Promise((resolve, reject) => {
      this.client.getArticleCategories(article, (error, data) => {
        if (error) {
          reject(error);
        }
        let categories = this.fixUtf8(JSON.stringify(data));
        this.save('article_categories', `${article}`, categories);
        resolve(categories);
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

  formatCategories(categories) {
    return new Promise((resolve, reject) => {
      try {
        for (let i in categories) {
          categories[i] = this.fixUtf8(categories[i]);
        }
        categories = categories.sort((a, b) => {
          return a.toLowerCase() - b.toLowerCase();
        });
        categories = categories.filter(function(item, pos) {
            return categories.indexOf(item) == pos;
        })
        resolve(categories);
      } catch (error) {
        reject(error);
      }
    });
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.client.getCategories((error, data) => {
        if (error) {
          resolve(error);
        }
        this.formatCategories(data).then((response) => {
          resolve(response);
        });
      });
    });
  }

  getArticlesInCategory(category) {
    return new Promise((resolve, reject) => {
      this.client.getPagesInCategory(category, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  save(location, filename, data) {
    filename = filename.replace(/\//g, "-");
    fsp.writeFile(`./output/${location}/${filename}.json`, data, (error) => {
      throw new Error(error);
    });
  }
}

let scraper = new Scraper();

scraper.prompt();
