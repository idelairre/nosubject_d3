import backlinks from '../../output/backlinks';
import categories from '../../output/categories';
import { union } from 'lodash';
import d3Chart from '../components/d3Chart';
import 'babel-polyfill';

class GraphGenerator {
  constructor() {
    this.storedArticles = [];
    this.storedNodes = [];
  };

  clearGraph() {
    d3Chart.clearGraph();
    this.storedNodes = [];
    return this.storedNodes;
  }

  ensureNodeUniqueness(nodes) {
    this.storedNodes.map((storedNode) => {
      nodes.map((node) => {
        if (storedNode.label === node.label) {
          nodes.splice(nodes.indexOf(node), 1);
        }
      });
    });
    return nodes;
  }

  fetchArticle(title) {
    try {
      for (let i = 0; backlinks.length > i; i += 1) {
        if (backlinks[i].title === title) {
          return backlinks[i];
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  findNode(title, nodes) {
    for (let i = 0; nodes.length > i; i += 1) {
      if (nodes[i].label === title) {
        return nodes[i];
      }
    }
  }

  generateArticles(minLinkCount) {
    return new Promise((resolve, reject) => {
      // only get articles greater than the minimum length
      try {
        let articles = [];
        for (let i = backlinks.length; i -= 1;) {
          if (backlinks[i].links.length > minLinkCount) {
            articles.push(backlinks[i]);
          }
        }
        // sort articles
        articles = articles.sort((a, b) => {
          return a.title.toLowerCase() - b.title.toLowerCase();
        });
        // remove duplicates
        for (let i = 0; articles.length - 1 > i; i += 1) {
          if (articles[i + 1] && articles[i].title.toLowerCase() === articles[i + 1].title.toLowerCase()) {
            delete articles[i];
          }
        }
        articles = articles.filter((element) => {
          return (typeof element !== "undefined");
        });
        this.storedArticles = union(this.storedArticles, articles);
        resolve(articles);
      } catch (error) {
        resolve(error);
      }
    });
  }

  async generateLinkedNodes(title) {
    let article = await this.fetchArticle(title);
    let articles = [];
    articles.push(article);
    for (let i = 0; article.links.length > i; i += 1) {
      let foundArticle = this.fetchArticle(article.links[i].title)
      if (foundArticle !== undefined) {
        articles.push(foundArticle);
      }
    }
    this.storedArticles = union(this.storedArticles, articles);
    let nodes = this.generateNodes(articles.length, articles);
    nodes = this.ensureNodeUniqueness(nodes);
    this.storedNodes = union(this.storedNodes, nodes);
    return nodes;
  }

  generateLinks(nodes, articles) {
    let foundNodes = [];
    let links = [];
    for (let j = 0; articles.length > j; j += 1) {
      let sourceNode = this.findNode(articles[j].title, nodes);
      if (sourceNode !== undefined && articles[j].hasOwnProperty('links')) {
        for (let k = 0; articles[j].links.length > k; k += 1) {
          let targetNode = this.findNode(articles[j].links[k].title, nodes);
          if (targetNode !== undefined && targetNode.label !== sourceNode.label) {
            let link = {
                source: sourceNode,
                target: targetNode,
                weight: Math.random()
              };
            links.push(link);
          }
        }
      }
    }
    return links;
  }

  async populateNodes(nodeCount, minLinks, shuffle) {
    let articles = await this.generateArticles(minLinks);
    shuffle ? articles = await this.shuffle(articles) : null;
    let nodes = this.generateNodes(nodeCount, articles);
    nodes = this.ensureNodeUniqueness(nodes); // need a method to generate more nodes until the asked for amount is reached
    this.storedNodes = union(this.storedNodes, nodes);
    return nodes;
  }

  generateNodes(nodeCount, articles) {
    let nodes = [];
    for (let i = 0; nodeCount > i; i += 1) {
      let node = {
        label: articles[i].title
      };
      nodes.push(node);
    }
    return nodes;
  }

  removeNode(node) {
    this.storedNodes = d3Chart.removeNode(node);
    return this.storedNodes;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    Promise.resolve(array);
  }
}

const graphGenerator = new GraphGenerator();

export default graphGenerator;
