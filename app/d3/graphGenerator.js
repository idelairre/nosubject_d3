import backlinks from '../../output/backlinks';
import 'babel-polyfill';

export default class GraphGenerator {
  constructor() {};
  async initializeGraphData(nodeCount, minimumLinkCount, shuffleArticles) {
    let articlesWithLinks = await this.generateArticlesWithLinks(minimumLinkCount);
    if (shuffleArticles) {
      articlesWithLinks = await this.shuffle(articlesWithLinks);
    }

    try {
      let [ nodes, labelAnchors ] = await this.generateNodes(nodeCount, articlesWithLinks);
      let [ links, labelAnchorLinks ] = await this.generateLinks(nodes, articlesWithLinks);
      await this.checkGraphJson(nodes, links, labelAnchors, labelAnchorLinks);
      console.log('done');
      return ([ nodes, links, labelAnchors, labelAnchorLinks ]);
    } catch (error) {
      console.log(error);
    }
  }

  shuffle(array) {
    console.log('shuffling...');
    return new Promise((resolve, reject) => {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      resolve(array);
    });
  }

  generateArticlesWithLinks(minimumLinkCount) {
    console.log('generating articles...');

    console.log('initial data: ', backlinks.length);

    return new Promise((resolve, reject) => {
      // only get articles greater than the minimum length
      let articlesWithLinks = backlinks.filter((article) => {
        if (article.links.length > minimumLinkCount) {
          return article;
        }
      });

      console.log('first pass: ', articlesWithLinks.length);

      // sort articles
      articlesWithLinks = articlesWithLinks.sort((a, b) => {
        return a.title.toLowerCase() - b.title.toLowerCase();
      });

      // remove duplicates
      for (let i = 0; i < articlesWithLinks.length - 1; i += 1) {
        if (articlesWithLinks[i + 1] && articlesWithLinks[i].title.toLowerCase() === articlesWithLinks[i + 1].title.toLowerCase()) {
          delete articlesWithLinks[i];
        }
      }

      articlesWithLinks = articlesWithLinks.filter((element) => {
        return (typeof element !== "undefined");
      });

      console.log('second pass: ', articlesWithLinks.length);
      resolve(articlesWithLinks);
    });
  }

  generateNodes(nodeCount, articles) {
    console.log(`generating ${nodeCount} nodes...`);
    let nodes = [], labelAnchors = [];
    return new Promise ((resolve, reject) => {
      for (let i = 0; i < nodeCount - 1; i += 1) {
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
      };
      console.log('nodes & anchorlabels: ', nodes.length, labelAnchors.length);
      resolve([ nodes, labelAnchors ]);
    });
  }

  generateLinks(nodes, articles) {
    console.log('node array size: ', nodes.length, 'articles: ', articles.length);
    return new Promise((resolve, reject) => {
      let links = [], labelAnchorLinks = [];
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = 0; j < articles[i].links.length; j += 1) {
          nodes.map((node) => {
            if (node.label === articles[i].links[j].title) {
              links.push({
                source: i,
                target: nodes.indexOf(node),
                weight: Math.random()
              });
            }
          });
        }
        labelAnchorLinks.push({
          source : i * 2,
          target : i * 2 + 1,
          weight : Math.random()
        });
      }
      resolve([ links, labelAnchorLinks ]);
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
      let targetIndex = links[j].target;
      let sourceIndex = links[j].source;
      if (nodes[targetIndex]) {
        console.log(`target node ${JSON.stringify(nodes[targetIndex])} referenced at link ${JSON.stringify(links[j])} is OK`);
      } else {
        console.error(`target node ${JSON.stringify(nodes[targetIndex])} referenced at link ${JSON.stringify(links[j])} is shit, index position: ${targetIndex}`);
        delete nodes[j];
        errors += 1;
      }
      if (nodes[sourceIndex]) {
        console.log(`source node ${JSON.stringify(nodes[sourceIndex])} referenced at link ${JSON.stringify(links[j])} is OK`);
      } else {
        console.error(`source node ${JSON.stringify(nodes[sourceIndex])} referenced at link ${JSON.stringify(links[j])} is shit, index position: ${sourceIndex}`);
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
      let targetIndex = labelAnchorLinks[i].target;
      let sourceIndex = labelAnchorLinks[i].source;
      if (labelAnchors[targetIndex]) {
        console.log(`target node ${JSON.stringify(labelAnchors[targetIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is OK`);
      } else {
        console.error(`target node ${JSON.stringify(labelAnchors[targetIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is shit, index position: ${targetIndex}`);
        delete labelAnchorLinks[i];
        errors += 1;
      }
      if (labelAnchors[sourceIndex]) {
        console.log(`source node ${JSON.stringify(labelAnchors[sourceIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is OK`);
      } else {
        console.error(`source node ${JSON.stringify(labelAnchors[sourceIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is shit, index position: ${sourceIndex}`);
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
