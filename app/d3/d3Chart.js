import articles from '../../output/articles';
import backlinks from '../../output/backlinks';

const width = 2000, height = 960;
let labelDistance = 0;

let d3Chart = {};

// links: { source: <nodeArrayPos>, target: <nodeArrayPos>, weight: <number> }
// labelAnchorLinks: { node: { source: <nodeArrayPos>, target: <nodeArrayPos>, weight: <number> } };

var nodes = [];

// { source: <nodeArrayPos>, target: <nodeArrayPos>, weight: <number> }
var links = [];

// data for graph 2
// object signature: { node: { source: <nodeArrayPos>, target: <nodeArrayPos>, weight: <number> } };
var labelAnchorLinks = [];
var labelAnchors = [];

console.log('initial data: ', backlinks.length);

let articlesWithLinks = backlinks.filter((article) => {
  if (article.links.length > 0) {
    return article;
  }
});

console.log('first pass: ', articlesWithLinks.length);

articlesWithLinks.sort((a, b) => {
  return a.title.toLowerCase() - b.title.toLowerCase();
});

for (let i = 0; i < articlesWithLinks.length - 1; i += 1) {
  if (articlesWithLinks[i].title.toLowerCase() === articlesWithLinks[i + 1].title.toLowerCase()) {
    delete articlesWithLinks[i];
  }
}

articlesWithLinks = articlesWithLinks.filter((element) => {
  return (typeof element !== "undefined");
});

console.log('second pass: ', articlesWithLinks.length);

for(let i = 0; i < articlesWithLinks.length; i += 1) {
	let node = {
		label : articlesWithLinks[i].title
	};
	nodes.push(node);
	labelAnchors.push({
		node : node
	});
	labelAnchors.push({
		node : node
	});
};

for (let i = 0; i < nodes.length; i += 1) {
  for (let j = 0; j < articlesWithLinks[i].links.length; j += 1) {
    nodes.map((node) => {
      if (node.label == articlesWithLinks[i].links[j].title) {
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
    weight : 1
  });
}

let vis = d3.select('body')
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height);

let force = d3.layout.force()
              .size([width, height])
              .nodes(nodes)
              .links(links)
              .gravity(1)
              .linkDistance(50)
              .charge(-3000)
              .linkStrength(function (x) {
                return x.weight * 10
              });

 force.start();

// graph that displays labels
let force2 = d3.layout.force()
                .nodes(labelAnchors)
                .links(labelAnchorLinks)
                .gravity(0)
                .linkDistance(0)
                .linkStrength(8)
                .charge(-100)
                .size([width, height]);

force2.start();

let link = vis.selectAll('line.link')
              .data(links)
              .enter()
              .append('svg:line')
              .attr('class', 'link')
              .style('stroke', '#CCC');

let node = vis.selectAll('g.node')
              .data(force.nodes())
              .enter()
              .append('svg:g')
              .attr('class', 'node');

node.append('svg:circle')
    .attr('r', 5)
    .style('fill', '#555')
    .style('stroke', '#FFF')
    .style('stroke-width', 3);

node.call(force.drag);

let anchorLink = vis.selectAll('line.anchorLink')
                    .data(labelAnchorLinks)
                    .enter()
                    .append('svg:line');

let anchorNode = vis.selectAll('g.anchorNode')
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
          .style('font-size', 12);


let updateLink = function () {
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

let updateNode = function () {
  this.attr('transform', function (datum) {
    // console.log('"this" context: ', this.attr, ' datum: ', datum);
    return 'translate(' + datum.x + ", " + datum.y + ')';
  });
}

force.on('tick', function () {
 force2.start();

 node.call(updateNode);

 anchorNode.each(function (datum, index) {
   if (index % 2 == 0) {
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

d3Chart = vis;

export default d3Chart;