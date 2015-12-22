import bot from 'nodemw';
import prompt from 'prompt';
import fs from 'fs';
import { handleErrors } from './decorators';
import { decorate } from 'core-decorators';
import console from 'better-console';

class Scraper {
  constructor() {
    // pass configuration object
    this.client = new bot({
      server: 'nosubject.com',  // host name of MediaWiki-powered site
      path: '/',                  // path to api.php script
      debug: false                 // is more verbose when set to true
    });
    this.index = [];
  }

  prompt() {
    console.log(' 1: get article, 2: get all articles, 3: get article backlinks, 4: get article external links, 5: generate article database, 6: generate backlink database')
    return prompt.get(['option', 'object'], (error, result) => {
      console.log(result.option)
      switch(parseInt(result.option)) {
        case 1:
          this.getArticle(result.object);
        case 2:
          this.getAllArticles();
        case 3:
          this.getBacklinks(result.object);
        case 4:
          this.getExternalLinks(result.object);
        case 5:
          this.generateArticleDatabase();
        case 6:
          this.generateBacklinkDatabase();
        case 7:
          this.generateExternalLinkDatabase();
      }
    });
  }

  formatBacklinks(links, callback) {
    let string = '';
    for (let i in links) {
      string += `${links[i].title}\n`;
    }
    links = string;
    if (callback) {
      callback(links);
    } else {
      return links;
    }
  }

  formatExternalLinks(links, callback) {
    let string = '';
    // stuff goes here
  }

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

  generateJson() {
    let links = [];
    let nodes = [];
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

  getBacklinks(article) {
    console.log('fetching back links...');
    let links = {};
    return new Promise((resolve, reject) => {
      this.client.getBacklinks(article, (error, data) => {
        if (error) {
          reject(error)
        } else {
          links = this.formatBacklinks(data);
          resolve(links);
        }
      });
      this.save('backlinks', `${article}_backlinks`, links);
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
          links = data;
          links = this.formatLinks(data);
          resolve(links);
        }
      });
      this.save('external_links', `${article}_external_links`, links);
    });
  }

  save(location, filename, data) {
    filename = filename.replace(/\//g, "-");
    fs.writeFile(`output/${location}/${filename}.txt`, data, (error) => {
      if (error) {
        console.log(error);
        return;
      }
    });
  }

  getAllArticles(callback) {
    let pages = {};
    return new Promise((resolve, reject) => {
      this.client.getAllPages((error, data) => {
        if (error) {
          reject(error);
        } else {
          this.generateIndex(data, (response) => {
            pages = response;
          });
          resolve(pages);
        };
        // this.save('list', 'all', pages);
      });
    });
  }

}

let scraper = new Scraper();

scraper.prompt();
