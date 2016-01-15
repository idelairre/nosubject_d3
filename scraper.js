import async from 'async';
import bot from 'nodemw';
import byline from 'byline';
import console from 'better-console';
import Utils from './etc/utils';
import fsp from 'fs-promise';
import inquirer from 'inquirer';
import pace from 'pace';
import { snakeCase } from 'lodash';
import 'babel-polyfill';

export default class Scraper {
  constructor(server, path, debug, silent) {
    this.client = new bot({
      server: server, // host name of MediaWiki-powered site
      path: path, // path to api.php script
      debug: debug // is more verbose when set to true
    });
    this.save = true;
    this.silent = silent;
  }

  prompt() {
    let questions = [{
      type: 'list',
      name: 'option',
      message: 'What do you want to do?',
      choices: [
        'Initialize graph json'
      ]
    }, {
      type: 'confirm',
      name: 'save',
      message: 'Save article json to file?',
      default: true
    }];
    inquirer.prompt(questions, (answers) => {
      this.save = answers.save;
      switch (answers.option) {
        case 'Initialize graph json':
          this.generateArticles().then(articles => this.populateArticleBacklinks(articles));
          break;
      }
    });
  }

  fetchAllArticles() {
    return new Promise((resolve, reject) => {
      this.client.getAllPages((error, data) => {
        if (error) {
          reject(error);
          return;
        }
        let articles = Utils.fixUtf8(JSON.stringify(data, null, 3));
        resolve(JSON.parse(articles));
        if (this.save) {
          fsp.writeFile('./output/articles.json', articles, (error) => {
            error ? console.error(error) : null;
          });
        }
      });
    });
  }

  fetchArticleBacklinks(article) {
    return new Promise((resolve, reject) => {
      let links = {};
      this.client.getBacklinks(article, (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        links = Utils.fixUtf8(JSON.stringify(data));
        if (this.save) {
          fsp.outputFile(`./output/backlinks/${snakeCase(article)}.json`, links, (error) => {
            error ? console.error(error) : null;
          });
          resolve(JSON.parse(links));
        }
      });
    });
  }

  async generateArticles() {
    let articles = [];
    try {
      articles = await fsp.readJson('./output/articles.json');
    } catch (error) {
      !this.silent ? console.error(error) : null;
      articles = this.fetchAllArticles();
    } finally {
      return Promise.resolve(articles);
    }
  }

  async generateArticleBacklinks(article) {
    let response = {};
    try {
      response = await fsp.readJson(`./output/backlinks/${snakeCase(article.title)}.json`);
    } catch (error) {
      !this.silent ? console.error(error) : null;
      response = this.fetchArticleBacklinks(article.title);
    } finally {
      return Promise.resolve(response);
    }
  }

  async populateArticleBacklinks(articles) {
    try {
      let i = 0;
      let articlesArray = [];
      let pace = {};
      if (!this.silent) {
        pace = require('pace')(articles.length - 1);
      }
      for (i; articles.length > i; i += 1) {
        articles[i].links = await this.generateArticleBacklinks(articles[i]);
        !this.silent ? pace.op() : null;
        articlesArray.push(articles[i]);
        if (i === articles.length - 1) {
          fsp.outputFile('./output/backlinks.json', JSON.stringify(articlesArray, null, 3)).then((error) => {
            error ? console.error(error) : null;
          });
          return Promise.resolve(articlesArray);
        }
      }
    } catch (error) {
      reject(error);
    }
  }
}
