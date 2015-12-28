import React from 'react';
import ReactDOM from 'react-dom';
import graphGenerator from '../generator/graphGenerator';

let d3Chart = {};

d3Chart.create = function(element, width, height, data, labels) {
  if (data.nodes.length === 0 || data.links.length === 0) {
    return;
  }
  let self = this;
  this.data = data;
  this.labels = labels;



  this.addNode = function(label) {
    let nodes = force.nodes();
    let labelNodes = force2.nodes();
    let node = {
      "label": label
    };
    let labelNode = {
      node: node
    };
    nodes.push(node);
    labelNodes.push(labelNode);
    labelNodes.push(labelNode);
    self.labels.labelAnchorLinks.push({
      source: self.labels.labelAnchors.indexOf(labelNode),
      target: self.labels.labelAnchors.indexOf(labelNode) + 1,
      weight: Math.random()
    })
    self.update();
  };

  this.removeNode = function(label) {
    let i = 0;
    let n = findNode(label);
    while (i < self.links.length) {
      if ((links[i]['source'] == n) || (self.links[i]['target'] == n)) {
        self.links.splice(i, 1);
      } else i++;
    }
    self.data.nodes.splice(findNodeIndex(label), 1);
    self.update();
  };

  this.removeLink = function(source, target) {
    for (let i = 0; i < links.length; i++) {
      if (links[i].source.id == source && links[i].target.id == target) {
        links.splice(i, 1);
        break;
      }
    }
    update();
  };

  this.removeallLinks = function() {
    links.splice(0, links.length);
    update();
  };

  this.removeAllNodes = function() {
    nodes.splice(0, links.length);
    update();
  };

  this.addLink = function(source, target, value) {
    links.push({
      "source": findNode(source),
      "target": findNode(target),
      "value": value
    });
    update();
  };

  let findNode = function(label) {
    for (let i in nodes) {
      if (nodes[i]["id"] === label) {
        return nodes[i];
      }
    };
  };

  let findNodeIndex = function(label) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].label == label) {
        return i;
      }
    };
  };

  let labelDistance = 0;
  let vis = d3.select(element)
    .append('svg:svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'graph');

  let force = d3.layout.force()
    .size([width, height])
    .nodes(this.data.nodes)
    .links(this.data.links)
    .gravity(0.5)
    .linkDistance(50)
    .charge(-5000)
    .linkStrength(function(x) {
      return x.weight * 5
    });

  // graph that displays labels
  let force2 = d3.layout.force()
    .nodes(this.labels.labelAnchors)
    .links(this.labels.labelAnchorLinks)
    .gravity(0)
    .linkDistance(0)
    .linkStrength(8)
    .charge(-100)
    .size([width, height])

  this.update = function() {
    let link = vis.selectAll('line.link')
      .data(this.data.links);

    link.enter()
      .append('svg:line')
      .attr('class', 'link')
      .style('stroke', '#CCC');

    // link.exit().remove();

    let node = vis.selectAll('g.node')
      .data(force.nodes());

    node.enter().append('svg:g')
      .attr('class', 'node');

    node.append('svg:circle')
      .attr('r', 7)
      .style('fill', '#555')
      .style('stroke', '#FFF')
      .style('stroke-width', 3);

    node.call(force.drag);
    // node.exit().remove();

    let anchorLink = vis.selectAll('line.anchorLink')
      .data(force2.links());

    anchorLink.enter()
      .append('svg:line');


    let anchorNode = vis.selectAll('g.anchorNode')
      .data(force2.nodes())

    anchorNode.enter().append('svg:g')
      .attr('class', 'anchorNode');

    anchorNode.append('svg:circle')
      .attr('r', 0)
      .style('fill', '#FFF')

    anchorNode.append('svg:text')
      .text(function(datum, index) {
        return index % 2 === 0 ? "" : datum.node.label;
      })
      .style('fill', '#555')
      .style('font-family', 'Arial')
      .style('font-size', 16)


    this.updateLink = function() {
      this.attr('x1', function(datum) {
        return datum.source.x;
      }).attr('y1', function(datum) {
        return datum.source.y;
      }).attr('x2', function(datum) {
        return datum.target.x;
      }).attr('y2', function(datum) {
        return datum.target.y;
      });
    }

    this.updateNode = function() {
      try {
        this.attr('transform', function(datum) {
          return 'translate(' + datum.x + ", " + datum.y + ')';
        });
      } catch (error) {
        console.log(error);
      }
    }

    force.on('tick', function(tick) {
      node.call(self.updateNode);

      anchorNode.each(function(datum, index) {
        if (index % 2 === 0) {
          datum.x = datum.node.x;
          datum.y = datum.node.y;
        } else {
          try {
            let b = this.childNodes[1].getBBox() || 100;
            let diffX = datum.x - datum.node.x; // wat?
            let diffY = datum.y - datum.node.y

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

      anchorNode.call(self.updateNode);

      link.call(self.updateLink);
      anchorLink.call(self.updateLink);
      force.start();
      force2.start();
    });
    force.start();
    force2.start();
  }
}

d3Chart.destroy = function(element) {
  // this.vis.remove();
  // let graph = d3.selectAll('chart.graph');
  // console.log(graph[0])
  // graph.remove();
}

export default d3Chart;
