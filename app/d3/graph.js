import React from 'react';
import Link from './link';
import Node from './node';

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.initialHeight,
      width: this.props.initialWidth,
      force: d3.layout.force()
                .size([this.props.initialWidth, this.props.initialHeight])
                .linkDistance(30)
                .charge(-120)
    }
    console.log(this.state);
  }

  componentDidMount() {
    let self = this;
    this.state.force
              .nodes(this.props.data.nodes)
              .links(this.props.data.links)
              .start();
    this.state.force.on("tick", (tick, b, c) => {
      self.forceUpdate()
    });
  }

  drawLinks() {
    let links = this.props.data.links.map((link, index) => {
      return (
        <Link datum={link} key={index} />
      );
    });
    return (
      <g>{links}</g>
    );
  }

  drawNodes() {
    let nodes = this.props.data.nodes.map((node, index) => {
      return (
        <Node key={index} x={node.x} y={node.y} group={node.group} />
      );
    });
    return nodes;
  }

  render() {
    let links = this.drawLinks();
    let nodes = this.drawNodes();
    return (
      <div>
        <div style={{"marginLeft": "20px", "fontFamily": "Helvetica"}}>
        </div>
        <svg
          width={this.state.width}
          height={this.state.height}>
          {links}
          {nodes}
        </svg>
      </div>
    );
  }
}

Graph.defaultProps = {
  initialHeight: 400,
  initialWidth: 400,
  initialData: { links: [], nodes: [] }
}

// Graph.propTypes = {
//   height: React.PropTypes.number,
//   width: React.PropTypes.number,
//   data: React.PropTypes.shape({
//     nodes: React.PropTypes.array,
//     links: React.PropTypes.array
//   })
// }

// React.PropTypes.shape({
//   source: React.PropTypes.number,
//   target: React.PropTypes.number,
//   weight: React.PropTypes.number
// })
