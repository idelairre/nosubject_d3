import React from 'react';

export default class AnchorNode extends React.Component {
  render() {
    let label = {};

    if (this.props.index % 2 === 0) {
      label = "";
    } else {
      label = this.props.label;
    }

    return (
      <g className="anchorNode">
        <text
          x={this.props.x}
          y={this.props.y}
          style={{
            "fill": "#555",
            "fontFamily": "Arial",
            "fontSize": "16",
          }}>
          {label}
        </text>
        </g>
      );
  }
}
