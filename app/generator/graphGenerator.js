import backlinks from '../../output/backlinks';
import { includes } from 'lodash';
import 'babel-polyfill';

class GraphGenerator {
  constructor() {
  };

  async generateNewNodes(nodeCount, shuffle) {
    console.warn(`generating ${nodeCount} new nodes`);
    try {
      let articles = this.storedArticles || await this.generateArticlesWithLinks(15);
      shuffle ? articles = await this.shuffle(articles) : null;
      let [ nodes, labelAnchors ] = await this.generateNodes(nodeCount, articles);
      console.log('new nodes: ', nodes.length, 'new labels: ', labelAnchors.length);
      let [ links, labelAnchorLinks ] = await this.generateLinks(nodes, articles);
      let data = {
        nodes: nodes,
        links: links
      };

      let labels = {
        labelAnchors: labelAnchors,
        labelAnchorLinks: labelAnchorLinks
      };

      console.warn('new nodes generated');
      return ([ data, labels ]);
    } catch (error){
      console.log(error);
    }
  }

  async initializeGraphData(nodeCount, minimumLinkCount, shuffleArticles) {
    let articlesWithLinks = await this.generateArticlesWithLinks(minimumLinkCount);
    shuffleArticles ? articlesWithLinks = await this.shuffle(articlesWithLinks) : null;
    let [ nodes, labelAnchors ] = await this.generateNodes(nodeCount, articlesWithLinks);
    let [ links, labelAnchorLinks ] = await this.generateLinks(nodes, articlesWithLinks);
    // await this.checkGraphJson(nodes, links, labelAnchors, labelAnchorLinks);

    let data = {
      nodes: nodes,
      links: links
    };

    let labels = {
      labelAnchors: labelAnchors,
      labelAnchorLinks: labelAnchorLinks
    };
    console.warn('done');
    return [data, labels];
  }

  shuffle(array) {
    console.log('shuffling...');
    return new Promise((resolve, reject) => {
      for (let i = array.length - 1; i > 0;  i-= 1) {
          let j = Math.floor(Math.random() * (i + 1));
          let temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      console.log('shuffling done');
      resolve(array);
    });
  }

  generateArticlesWithLinks(minimumLinkCount) {
    console.log(`generating articles with ${minimumLinkCount} or less links...`);

    console.log('initial data: ', backlinks.length);

    return new Promise((resolve, reject) => {
      // only get articles greater than the minimum length
      let articlesWithLinks = [];

      for (let i = backlinks.length; i -= 1;) {
        if (backlinks[i].links.length > minimumLinkCount) {
          articlesWithLinks.push(backlinks[i]);
        }
      }

      console.log('first pass: ', articlesWithLinks.length);

      // sort articles
      articlesWithLinks = articlesWithLinks.sort((a, b) => {
        return a.title.toLowerCase() - b.title.toLowerCase();
      });

      // remove duplicates
      for (let i = articlesWithLinks.length - 1; i -= 1;) {
        if (articlesWithLinks[i - 1] && articlesWithLinks[i].title.toLowerCase() === articlesWithLinks[i - 1].title.toLowerCase()) {
          delete articlesWithLinks[i];
        }
      }

      articlesWithLinks = articlesWithLinks.filter((element) => {
        return (typeof element !== "undefined");
      });

      console.log('second pass: ', articlesWithLinks.length);
      console.log('done');
      this.storedArticles = articlesWithLinks;
      console.log('articles stored: ', !!this.storedArticles.length);
      resolve(articlesWithLinks);
    });
  }

  generateNodes(nodeCount, articles) {
    console.log(`generating ${nodeCount} nodes from ${articles.length} articles...`);
    let nodes = [], labelAnchors = [];
    return new Promise ((resolve, reject) => {
      try {
        for (let i = (nodeCount - 1 || 2); i -= 1;) {
          let node = {
            label : articles[i].title
          };
          nodes.push(node);
          labelAnchors.push({
            node : node
          });
          labelAnchors.push({
            node : node
          });
          resolve([ nodes, labelAnchors ]);
        }
      } catch (error) {
        console.error(error);
      }
      // console.log('nodes & anchorlabels: ', nodes.length, labelAnchors.length);
    });
  }

  generateLinks(nodes, articles) {
    // console.log('node array size: ', nodes.length, 'articles: ', articles.length);
    return new Promise((resolve, reject) => {
      try {
        let links = [], labelAnchorLinks = [];
        for (let i = nodes.length; i -= 1;) {
          for (let j = articles[i].links.length; j -= 1;) {
            nodes.map((node) => {
              if (node.label === articles[i].links[j].title) {
                links.push({
                  source: nodes[i],
                  target: node,
                  weight: Math.random()
                });
              }
            });
          }
          labelAnchorLinks.push({
            source : i / 2,
            target : i / 2 - 1,
            weight : Math.random()
          });
        }
        // console.log('labelAnchorLinks : ', labelAnchorLinks.length);
        resolve([ links, labelAnchorLinks ]);
      } catch (error) {
        resolve(error);
      }
    });
  }

  checkGraphJson(nodes, links, labelAnchors, labelAnchorLinks) {
    this.checkNodes(nodes, links);
    this.checkLabels(labelAnchors, labelAnchorLinks);
  }

  checkNodes(nodes, links) {
    let errors = 0;
    console.log('checking nodes');
    for (let j = 0; j < links.length - 1; j += 1) {
      let targetIndex = nodes.indexOf(links[j].target);
      let sourceIndex = nodes.indexOf(links[j].source);
      if (nodes[targetIndex]) {
        // console.log(`target node ${JSON.stringify(nodes[targetIndex])} referenced at link ${JSON.stringify(links[j])} is OK`);
      } else {
        console.error(`target node at ${targetIndex} referenced at link ${JSON.stringify(links[j])} is shit, index position: ${targetIndex}`);
        delete nodes[j];
        errors += 1;
      }
      if (nodes[sourceIndex]) {
        // console.log(`source node ${JSON.stringify(nodes[sourceIndex])} referenced at link ${JSON.stringify(links[j])} is OK`);
      } else {
        console.error(`source node at ${sourceIndex} referenced at link ${JSON.stringify(links[j])} is shit, index position: ${sourceIndex}`);
        delete nodes[j];
        errors += 1;
      }
    }
    console.log('errors: ', errors);
      if (errors > 0) {
      links = links.filter((element) => {
        return (typeof element !== "undefined");
      });
    }
    errors > 0 ? console.log('links repaired') : null;
  }

  checkLabels(labelAnchors, labelAnchorLinks) {
    let errors = 0;
    console.log('checking labels');
    for (let i = 0; labelAnchorLinks.length - 1 > i; i += 1) {
      let targetIndex = labelAnchors.indexOf(labelAnchorLinks[i].target);
      let sourceIndex = labelAnchors.indexOf(labelAnchorLinks[i].source);
      if (labelAnchors[targetIndex]) {
        // console.log(`target node ${JSON.stringify(labelAnchors[targetIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is OK`);
      } else {
        console.error(`target label index ${targetIndex} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is shit, index position: ${targetIndex}`);
        delete labelAnchorLinks[i];
        errors += 1;
      }
      if (labelAnchors[sourceIndex]) {
        // console.log(`source node ${JSON.stringify(labelAnchors[sourceIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is OK`);
      } else {
        console.error(`source label index ${sourceIndex} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is shit, index position: ${sourceIndex}`);
        delete labelAnchorLinks[i];
        errors += 1;
      }
    }
    console.log('errors: ', errors);
      if (errors > 0) {
      labelAnchorLinks = labelAnchorLinks.filter((element) => {
        return (typeof element !== "undefined");
      });
    }
    errors > 0 ? console.log('label links repaired') : null;
  }
}

const graphGenerator = new GraphGenerator();

export default graphGenerator;
