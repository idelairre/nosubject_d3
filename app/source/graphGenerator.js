import backlinks from '../../output/backlinks';
import d3Chart from '../components/d3Chart';
import { union } from 'lodash';
import 'babel-polyfill';

class GraphGenerator {
  constructor() {
    this.storedArticles = [];
    this.storedNodes = [];
  };

  clearGraph() {
    d3Chart.clearGraph();
    this.storedNodes = d3Chart.force.nodes();
    return this.storedNodes;
  }

  ensureNodeUniqueness(nodes) {
    try {
      // sort
      nodes = nodes.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        } else if (a.label > b.label) {
          return 1;
        } else {
          return 0;
        }
      });
      // ensure uniqueness amongst self
      for (let i = 0; i < nodes.length - 1; i += 1) {
        if (nodes[i + 1] && nodes[i + 1].label === nodes[i].label) {
          delete nodes[i];
        }
      }
      // remove undefined
      nodes = nodes.filter((element) => {
        return (typeof element !== "undefined");
      });
      // ensure uniqueness amonst stored nodes
      this.storedNodes.map((storedNode) => {
        nodes.map((node) => {
          if (storedNode.label === node.label) {
            nodes.splice(nodes.indexOf(node), 1);
          }
        });
      });
      return Promise.resolve(nodes);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  ensureArticleUniqueness(articles) {
    try {
      // sort articles
      articles = articles.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        } else {
          return 0;
        }
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
      return Promise.resolve(articles);
    } catch (error) {
      return Promise.reject(error);
    }
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
    try {
      for (let i = 0; nodes.length > i; i += 1) {
        if (nodes[i].label === title) {
          return nodes[i];
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async generateArticles(minLinkCount) {
    try {
      let articles = [];
      // only get articles greater than the minimum length
      for (let i = backlinks.length; i -= 1;) {
        if (backlinks[i].links.length > minLinkCount) {
          articles.push(backlinks[i]);
        }
      }
      articles = await this.ensureArticleUniqueness(articles);
      this.storedArticles = union(this.storedArticles, articles);
      return Promise.resolve(articles);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async generateLinkedNodes(title, toggleBacklinkedNodes) {
    try {
      let article = await this.fetchArticle(title);
      if (!article) {
        throw new Error(`Article title "${JSON.stringify(title)}" not found`);
      }
      let articles = [];
      articles.push(article);
      for (let i = 0; article.links.length > i; i += 1) {
        let foundArticle = this.fetchArticle(article.links[i].title)
        if (foundArticle !== undefined) {
          articles.push(foundArticle);
        }
      }
      if (toggleBacklinkedNodes) {
        for (let i = 0; backlinks.length > i; i += 1) {
          for (let j = 0; backlinks[i].links.length > j; j += 1) {
            if (backlinks[i].links[j].title === title) {
              articles.push(backlinks[i]);
              break;
            }
          }
        }
      }

      articles = await this.ensureArticleUniqueness(articles);
      this.storedArticles = union(this.storedArticles, articles);
      this.storedArticles = await this.ensureArticleUniqueness(this.storedArticles);

      let nodes = this.generateNodes(articles.length, articles);
      nodes = await this.ensureNodeUniqueness(nodes);
      this.storedNodes = union(this.storedNodes, nodes);
      return Promise.resolve(nodes);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  generateLinks(nodes, articles) {
    try {
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
    } catch (error) {
      console.error(error);
    }
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

  async populateNodes(nodeCount, minLinks, shuffle) {
    try {
      let articles = await this.generateArticles(minLinks);
      shuffle ? articles = await this.shuffle(articles) : null;
      let nodes = this.generateNodes(nodeCount, articles);
      nodes = this.ensureNodeUniqueness(nodes); // need a method to generate more nodes until the asked for amount is reached
      this.storedNodes = union(this.storedNodes, nodes);
      return nodes;
    } catch (error) {
      console.error(error);
    }
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
