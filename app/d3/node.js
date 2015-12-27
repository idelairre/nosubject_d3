import React from 'react';

export default class Node extends React.Component {
  render() {
    console.log(this.props);
    let color = d3.scale.category20();
    return (
      <circle
        r={5}
        cx={this.props.x}
        cy={this.props.y}
        style={{
          "fill": color(this.props.group),
          "stroke": "#FFF",
          "strokeWidth" : "1.5px"
        }}
        />
      );
  }
}
