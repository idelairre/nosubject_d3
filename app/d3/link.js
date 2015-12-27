import React from 'react';

export default class Link extends React.Component {
  render() {
    return (
      <line
        x1={this.props.datum.source.x}
        y1={this.props.datum.source.y}
        x2={this.props.datum.target.x}
        y2={this.props.datum.target.y}
        style={{
          "stroke": "#999",
          "strokeOpacity": "0.6",
          "strokeWidth": Math.sqrt(this.props.datum.value)
        }}
        />
    );
  }
}
