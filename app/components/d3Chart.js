import React from 'react';
import ReactDOM from 'react-dom';
import graphGenerator from '../generator/graphGenerator';
import { includes, trim, union, difference } from 'lodash';

class D3Chart {
  constructor(element, height, width) {
    this.element = element;
    this.height = height;
    this.width = width;
  }

  initialize(element, height, width) {
    this.element = element;
    this.height = height;
    this.width = width;
    this.vis = d3.select(this.element)
      .append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'graph');

    this.force = d3.layout.force()
      .size([this.width, this.height])
      .nodes([])
      .links([])
      .gravity(0.5)
      .linkDistance(350)
      .charge(-3000)
      .linkStrength((x) => {
        return x.weight * 5
      });

    this.force2 = d3.layout.force()
      .nodes([])
      .links([])
      .gravity(0)
      .linkDistance(0)
      .linkStrength(8)
      .charge(-100)
      .size([this.width, this.height])
  }

  validateLink (link) {
    let nodes = this.force.nodes();
    let links = this.force.links();
    if (nodes.indexOf(link.source) === -1) {
      throw new Error(`link source at ${JSON.stringify(link)} invalid, ${nodes.indexOf(link)}`);
    }
    if (nodes.indexOf(link.target) === -1) {
      throw new Error(`link target at ${JSON.stringify(link)} invalid, ${nodes.indexOf(link)}`);
    }
  }

  redrawLinks(nodes) {
    let links = graphGenerator.generateLinks(nodes, graphGenerator.storedArticles);
    for (let i = 0; links.length > i; i += 1) {
      this.addLink(links[i]);
    }
    this.update();
    // graphGenerator.checkNodes(this.force.nodes(), this.force.links());
  }

  graphContainsLink(testLink) {
    let links = this.force.links();
    let found = false;
      links.map((link) => {
        try {
          if (links.source.label === testLink.source.label && links.target.label === testLink.target.label) {
            found = true;
          }
        } catch (error) {
          console.error()
        }
      });
    return found;
  }

  graphContainsNode(testNode) {
    let nodes = this.force.nodes();
    let found = false;
    nodes.map((node) => {
      if (node.label === testNode.label) {
        found = true;
      }
    });
    return found;
  }

  addNodes(data) {
    try {
      for (let i = 0; data.nodes.length > i; i += 1) {
        this.addNode(data.nodes[i]);
      }

      this.redrawLinks(this.force.nodes());
    } catch (error) {
      console.error(error);
    }
  };

  addNode(node) {
    try {
        let nodes = this.force.nodes();
        let labelAnchors = this.force2.nodes();
        let labelAnchorLinks = this.force2.links();
        let labelNode1 = {
          node: node
        };
        let labelNode2 = {
          node: node
        };
        nodes.push(node);
        labelAnchors.push(labelNode1);
        labelAnchors.push(labelNode2);
        labelAnchorLinks.push({
          source: labelAnchors.length - 1,
          target: labelAnchors.length - 2,
          weight: Math.random()
        });
        this.update();
    } catch (error) {
      console.error(error);
    }
  };

  addLink(link) {
    // console.log('graph contains link? ', this.graphContainsLink(link));
    // if (this.graphContainsLink(link)) {
    //   return;
    // }
    try {
      let links = this.force.links();
      links.push(link);
      this.update();
    } catch (error) {
      console.error(error);
    }
  };

  updateLink() {
    this.attr('x1', (datum) => {
      return datum.source.x;
    }).attr('y1', (datum) => {
      return datum.source.y;
    }).attr('x2', (datum) => {
      return datum.target.x;
    }).attr('y2', (datum) => {
      return datum.target.y;
    });
  }

  updateNode() {
    this.attr('transform', (datum) => {
      return 'translate(' + datum.x + ", " + datum.y + ')';
    });
  }

  update() {
    let link = this.vis.selectAll('line.link')
      .data(this.force.links(), (datum) => {
        return datum.source.label + "-" + datum.target.label;
      });

    let linkEnter = link.enter()
      .insert('svg:line', 'g.node')
      .attr('class', 'link')
      .style('stroke', '#CCC');

    link.exit().remove();

    let node = this.vis.selectAll('g.node')
      .data(this.force.nodes(), (datum) =>{
        return datum.label;
      });

    let nodeEnter = node.enter().append('svg:g')
      .attr('class', 'node');

    nodeEnter.append('svg:circle')
      .attr('r', 8)
      .style('fill', '#555')
      .style('stroke', '#FFF')
      .style('stroke-width', 3);

    nodeEnter.call(this.force.drag);
    node.exit().remove();

    let anchorLink = this.vis.selectAll('line.anchorLink')
      .data(this.force2.links());

    let anchorLinkEnter = anchorLink.enter()
      .append('svg:line')
      .attr('class', 'anchorLink');

    anchorLink.exit().remove();

    let anchorNode = this.vis.selectAll('g.anchorNode')
      .data(this.force2.nodes());

    let anchorNodeEnter = anchorNode.enter().append('svg:g')
      .attr('class', 'anchorNode');

    anchorNodeEnter.append('svg:circle')
      .attr('r', 0)
      .style('fill', '#FFF')

    anchorNodeEnter.append('svg:text')
      .text((datum, index) => {
        return index % 2 === 0 ? "" : datum.node.label;
      })
      .style('fill', '#555')
      .style('font-family', 'Arial')
      .style('font-size', 18);

    anchorNode.exit().remove();

    this.force.start();
    this.force2.start();

    this.force.on('tick', (tick) => {
      node.call(this.updateNode);
      anchorNode.each(function (datum, index) {
        if (index % 2 === 0) {
          datum.x = datum.node.x;
          datum.y = datum.node.y;
        } else {
          try {
            let b = this.childNodes[1].getBoundingClientRect();
            let diffX = datum.x - datum.node.x; // wat?
            let diffY = datum.y - datum.node.y;
            let dist = Math.sqrt(diffX * diffX + diffY * diffY);
            let shiftX = b.width * (diffX - dist) / (dist * 2);
            shiftX = Math.max(-b.width, Math.min(0, shiftX));
            let shiftY = 5;
            this.childNodes[1].setAttribute('transform', `translate(${shiftX}, ${shiftY})`);
          } catch (error) {
            console.error(error);
          }
        }
      });

      anchorNode.call(this.updateNode);

      link.call(this.updateLink);
      anchorLink.call(this.updateLink);
      this.force.start();
      this.force2.start();
    });
  }
}

let d3Chart = new D3Chart();

export default d3Chart;
