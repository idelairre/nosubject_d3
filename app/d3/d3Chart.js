import GraphGenerator from './graphGenerator';
import React from 'react';
var d3Chart = {};

d3Chart.create = function (width, height, element, nodes, links, labelAnchors, labelAnchorLinks) {
  console.log(arguments);
  if (!nodes || !links || !labelAnchors || !labelAnchors) {
    nodes = [];
    links = [];
    labelAnchors = [];
    labelAnchorLinks = [];
  }

  var labelDistance = 0;

  var vis = d3.select(element)
              .append('svg:svg')
              .attr('width', width)
              .attr('height', height);

  var force = d3.layout.force()
                .size([width, height])
                .nodes(nodes)
                .links(links)
                .gravity(0.5)
                .linkDistance(50)
                .charge(-5000)
                .linkStrength(function (x) {
                  return x.weight * 5
                })
                .start();

  // graph that displays labels
  var force2 = d3.layout.force()
                  .nodes(labelAnchors)
                  .links(labelAnchorLinks)
                  .gravity(0)
                  .linkDistance(0)
                  .linkStrength(8)
                  .charge(-100)
                  .size([width, height])
                  // .start();

  var link = vis.selectAll('line.link')
                .data(links)
                .enter()
                .append('svg:line')
                .attr('class', 'link')
                .style('stroke', '#CCC');

  var node = vis.selectAll('g.node')
                .data(force.nodes())
                .enter()
                .append('svg:g')
                .attr('class', 'node');

  node.append('svg:circle')
      .attr('r', 7)
      .style('fill', '#555')
      .style('stroke', '#FFF')
      .style('stroke-width', 3);

  node.call(force.drag);

  var anchorLink = vis.selectAll('line.anchorLink')
                      .data(labelAnchorLinks)
                      .enter()
                      .append('svg:line');

  var anchorNode = vis.selectAll('g.anchorNode')
                      .data(force2.nodes())
                      .enter()
                      .append('svg:g')
                      .attr('class', 'anchorNode');

  anchorNode.append('svg:circle')
            .attr('r', 0)
            .style('fill', '#FFF');

  anchorNode.append('svg:text')
            .text(function (datum, index) {
                return index % 2 == 0 ? "" : datum.node.label;
            });

  anchorNode.style('fill', '#555')
            .style('font-family', 'Arial')
            .style('font-size', 16);

  var updateLink = function () {
    this.attr('x1', function (datum) {
      return datum.source.x;
    }).attr('y1', function (datum) {
      return datum.source.y;
    }).attr('x2', function (datum) {
      return datum.target.x;
    }).attr('y2', function (datum) {
      return datum.target.y;
    });
  }

  var updateNode = function () {
    this.attr('transform', function (datum) {
      return 'translate(' + datum.x + ", " + datum.y + ')';
    });
  }

  anchorNode.on('click', function () {
      window.location.href = `http://nosubject.com/${d3.select(this).text()}`;
  });

  force.on('tick', function () {
   force2.start();

   node.call(updateNode);

   anchorNode.each(function (datum, index) {
     if (index % 2 === 0) {
       datum.x = datum.node.x;
       datum.y = datum.node.y;
     } else {
       var b = this.childNodes[1].getBBox();
       var diffX = datum.x - datum.node.x; // wat?
       var diffY = datum.y - datum.node.y

       var dist = Math.sqrt(diffX * diffX + diffY * diffY);

       var shiftX = b.width * (diffX - dist) / (dist * 2);
       shiftX = Math.max(-b.width, Math.min(0, shiftX));
       var shiftY = 5;
       this.childNodes[1].setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')');
     }
   });

   anchorNode.call(updateNode);

   link.call(updateLink);
   anchorLink.call(updateLink);

  });
  return vis;
}

export default d3Chart;
