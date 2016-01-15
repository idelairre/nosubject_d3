import React from 'react';
import ReactDOM from 'react-dom';
import graphGenerator from '../source/graphGenerator';

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
      .friction(0.4)
      .linkDistance(300)
      .charge(-10000)
      .linkStrength((x) => {
        return x.weight * 5
      });

    this.force2 = d3.layout.force()
      .nodes([])
      .links([])
      .gravity(0)
      .linkDistance(0)
      .linkStrength(8)
      .charge(-300)
      .size([this.width, this.height])
  }

  addNodes(nodes) {
    for (let i = 0; nodes.length > i; i += 1) {
      this.addNode(nodes[i]);
    }
    this.redrawLinks(this.force.nodes());
  };

  addNode(node) {
    let nodes = this.force.nodes();
    node.x = 500;
    node.y = 300;
    nodes.push(node);
    this.addLabels(node);
  };

  addLabels(node) {
    let labelAnchors = this.force2.nodes();
    let labelAnchorLinks = this.force2.links();
    let labelNode1 = {
      node: node,
      x: 500,
      y: 300
    };
    let labelNode2 = {
      node: node,
      x: 500,
      y: 300
    };
    labelAnchors.push(labelNode1);
    labelAnchors.push(labelNode2);
    labelAnchorLinks.push({
      source: labelNode1,
      target: labelNode2,
      weight: 1
    });
    this.update();
  }

  clearGraph() {
    this.removeAllLinks();
    this.removeAllNodes();
  }

  findNode(label) {
    let nodes = this.force.nodes();
    for (let i = 0; nodes.length > i; i += 1) {
      if (nodes[i]["label"] === label) {
        return nodes[i];
      }
    }
  }

  findLinks(label) {
    let links = this.force.links();
    let linkArray = [];
    for (let i = 0; links.length > i; i += 1) {
      if (links[i].source.label === label || links[i].target === label) {
         linkArray.push(links[i]);
      }
    }
    return linkArray;
  }

  redrawLinks(nodes) {
    let links = graphGenerator.generateLinks(nodes, graphGenerator.storedArticles);
    this.force.links(links);
    this.update();
  }

  removeAllLinks() {
    this.force.links().splice(0, this.force.links().length);
    this.force2.links().splice(0, this.force2.links().length);
    this.update();
  };

  removeAllNodes() {
    this.force.nodes().splice(0, this.force.nodes().length);
    this.force2.nodes().splice(0, this.force2.nodes().length);
    this.update();
  };

  removeNode(label) {
    let node = this.findNode(label);
    let nodes = this.force.nodes();
    let labelAnchors = this.force2.nodes();
    // this is hideous but no other way works
    this.force2.nodes([]);
    this.force2.links([]);

    nodes.splice(node.index, 1);
    this.update();

    for (let i = 0; nodes.length > i; i += 1) {
      this.addLabels(nodes[i]);
    }
    this.redrawLinks(nodes);
    return nodes;
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
      .data(this.force.nodes(), (datum) => {
        return datum.label;
      });

    node.on('mouseenter', (node) => {
      link.style('stroke', (datum) => {
        return datum.source.label === node.label || datum.target.label === node.label ? '#B02E2E' : '#CCC';
      });
      text.style('text-decoration', (datum, index) => {
        return datum.node.label && index % 2 === 0 ? 'underline' : 'none';
      });
    });

    node.on('mouseleave', (node) => {
      link.style('stroke', '#CCC');
      text.style('text-decoration', 'none');
    });

    let nodeEnter = node.enter().append('svg:g')
      .attr('class', (datum) => {
        return 'node';
      });

    nodeEnter.append('svg:circle')
      .attr('r', 8.5)
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

    anchorNode
      .on('mouseover', function (datum) {
        d3.select(this.childNodes[1])
        .style('text-decoration', 'underline');
      })
      .on('mouseleave', function (datum) {
        d3.select(this.childNodes[1])
        .style('text-decoration', 'none');
      })
      .on('click', function (datum) {
        window.location = `http://nosubject.com/${datum.node.label}`;
      });

    let anchorNodeEnter = anchorNode.enter().append('svg:g')
      .attr('class', 'anchorNode');

    anchorNodeEnter.append('svg:circle')
      .attr('r', 0)
      .style('fill', '#FFF')
      .style('height', 28);

    anchorNodeEnter.append('svg:text')
      .text((datum, index) => {
        return index % 2 === 0 ? "" : datum.node.label;
      })
      .attr('class', (datum) => {
        return datum.node.label;
      })
      .style('fill', '#555')
      .style('font-family', 'Arial')
      .style('font-size', 18)

    anchorNode.exit().remove();

    let text = this.vis.selectAll('text').data(this.force2.nodes());

    this.force.start();
    this.force2.start();

    this.force.on('tick', (tick) => {
      node.call(this.updateNode);
      anchorNode.each(function (datum, index) {
        if (index % 2 === 0) {
          datum.x = datum.node.x;
          datum.y = datum.node.y;
        } else {
          let b = this.childNodes[1].getBoundingClientRect();
          let diffX = datum.x - datum.node.x; // wat?
          let diffY = datum.y - datum.node.y;
          let dist = Math.sqrt(diffX * diffX + diffY * diffY);
          let shiftX = b.width * (diffX - dist) / (dist * 2);
          shiftX = Math.max(-b.width, Math.min(0, shiftX));
          let shiftY = 5;
          this.childNodes[1].setAttribute('transform', `translate(${shiftX}, ${shiftY})`);
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
