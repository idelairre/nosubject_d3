import React from 'react';

export default class Node extends React.Component {
  render() {
    return (
      <g className="node">
        <circle
          r={7}
          cx={this.props.x}
          cy={this.props.y}
          style={{
            "fill": "#555",
            "stroke": "#FFF",
            "strokeWidth" : "3px"
          }}
          />
        </g>
      );
  }
}
