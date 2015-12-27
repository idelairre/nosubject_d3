import GraphGenerator from './graphGenerator';
import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { Motion, spring } from 'react-motion';

export default class D3Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          height: this.props.initialHeight,
          width: this.props.initialWidth,
          data: this.props.initialData,
          labels: this.props.initialLabels
        }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  renderChart(interpolated) {
    let element = ReactFauxDOM.createElement('chart');
    let labelDistance = 0;

    let vis = d3.select(element)
                .append('svg:svg')
                .attr('width', this.state.width)
                .attr('height', this.state.height);

    let force = d3.layout.force()
                  .size([this.state.width, this.state.height])
                  .nodes(this.state.data.nodes)
                  .links(this.state.data.links)
                  .gravity(0.5)
                  .linkDistance(50)
                  .charge(-5000)
                  .linkStrength(function (x) {
                    return x.weight * 5
                  })
                  .start()

    // graph that displays labels
    let force2 = d3.layout.force()
                    .nodes(this.state.labels.labelAnchors)
                    .links(this.state.labels.labelAnchorLinks)
                    .gravity(0)
                    .linkDistance(0)
                    .linkStrength(8)
                    .charge(-100)
                    .size([this.state.width, this.state.height])
                    .start();

    let link = vis.selectAll('line.link')
                  .data(this.state.data.links)
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
        .attr('r', 7)
        .style('fill', '#555')
        .style('stroke', '#FFF')
        .style('stroke-width', 3);

    node.call(force.drag);

    let anchorLink = vis.selectAll('line.anchorLink')
                        .data(this.state.labels.labelAnchorLinks)
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
              .text((datum, index) => {
                  return index % 2 == 0 ? "" : datum.node.label;
              });

    anchorNode.style('fill', '#555')
              .style('font-family', 'Arial')
              .style('font-size', 16);

    let updateLink = function() {
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

    let updateNode = function() {
      this.attr('transform', (datum) => {
        return 'translate(' + datum.x + ", " + datum.y + ')';
      });
    }

    anchorNode.on('click', () => {
        window.location.href = `http://nosubject.com/${d3.select(this).text()}`;
    });

    force.on('tick', (tick) => {
     force2.start();

     node.call(updateNode);

     anchorNode.each((datum, index) => {
       if (index % 2 === 0) {
         datum.x = datum.node.x;
         datum.y = datum.node.y;
       }
        // else {
      //    var b = vis.childNodes[1].getBBox();
      //    var diffX = datum.x - datum.node.x; // wat?
      //    var diffY = datum.y - datum.node.y
       //
      //    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
       //
      //    var shiftX = b.width * (diffX - dist) / (dist * 2);
      //    shiftX = Math.max(-b.width, Math.min(0, shiftX));
      //    var shiftY = 5;
      //    this.childNodes[1].setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')');
      //  }
     });

     anchorNode.call(updateNode);

     link.call(updateLink);
     anchorLink.call(updateLink);

    });
    return element.toReact();
  }

  render() {
    return (
      <Motion defaultStyle={{x: 0}} style={{x: spring(10, [120, 17])}}>
        {interpolated => this.renderChart(interpolated)}
      </Motion>
    );
  }
}

D3Chart.defaultProps = {
  initialHeight: 900,
  initialWidth: 2000,
  initialData: { links: [], nodes: [] },
  initialLabels: { labelAnchors: [], labelAnchorLinks: [] },
  initialLabelLinks: {}
}

D3Chart.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  data: React.PropTypes.shape({
    nodes: React.PropTypes.array,
    links: React.PropTypes.array
  }),
  labels: React.PropTypes.shape({
    labelAnchors: React.PropTypes.array,
    labelAnchorLinks: React.PropTypes.array
  })
}
