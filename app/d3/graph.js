import React from 'react';
import ReactDOM from 'react-dom';
import Link from './link';
import Node from './node';
import AnchorNode from './anchorNode';
import AnchorLink from './anchorLink';

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.initialHeight,
      width: this.props.initialWidth,
      data: this.props.initialData,
      labels: this.props.initialLabels,
      force: d3.layout.force()
               .size([this.props.initialWidth, this.props.initialHeight])
               .linkDistance(50)
               .charge(-3000)
               .gravity(0.5),
      force2: d3.layout.force()
               .size([this.props.initialWidth, this.props.initialHeight])
               .linkDistance(0)
               .linkStrength(8)
               .gravity(1)
               .charge(-100)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
    let self = this;
    this.state.force
              .nodes(this.state.data.nodes)
              .links(this.state.data.links)
              .linkStrength((x) => {
                return x.weight * 5
              })
              .start();
    this.state.force2
              .nodes(this.state.labels.labelAnchors)
              .links(this.state.labels.labelAnchorLinks)

    this.state.force.on("tick", (tick, b, c) => {
      this.state.force2.start()
      self.forceUpdate()
    });
  }

  drawLinks() {
    let links = this.state.data.links.map((link, index) => {
      return (
        <Link datum={link} key={index} />
      );
    });
    return (
      <g>{links}</g>
    );
  }

  drawNodes() {
    let nodes = this.state.data.nodes.map((node, index) => {
      return (
        <Node key={index} x={node.x} y={node.y} />
      );
    });
    return nodes;
  }

  drawLabelLinks() {
    let labelAnchorLinks = this.state.labels.labelAnchorLinks.map((link, index) => {
      return (
        <AnchorLink datum={link} key={index} />
      );
    });
    return (
      <g>{labelAnchorLinks}</g>
    );
  }

  drawLabelNodes() {
    let labelAnchors = this.state.labels.labelAnchors.map((datum, index) => {
      let transform = '';
      if (index % 2 === 0) {
          datum.x = datum.node.x;
          datum.y = datum.node.y;
        }
      return (
        <AnchorNode index={index} key={index} x={datum.x} y={datum.y} label={datum.node.label} node={datum.node} transform={transform}/>
      );
    });
    return labelAnchors;
  }

  render() {
    let links = this.drawLinks();
    let nodes = this.drawNodes();
    let labelAnchors = this.drawLabelNodes();
    let labelAnchorLinks = this.drawLabelLinks();

    return (
      <div>
        <svg
          width={this.state.width}
          height={this.state.height}>
          {links}
          {nodes}
          {labelAnchors}
          {labelAnchorLinks}
        </svg>
      </div>
    );
  }
}

Graph.defaultProps = {
  initialHeight: 900,
  initialWidth: 2000,
  initialData: { links: [], nodes: [] },
  initialLabels: { labelAnchors: [], labelAnchorLinks: [] },
  initialLabelLinks: {}
}

Graph.propTypes = {
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
