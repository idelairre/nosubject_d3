import React from 'react';

export default class AnchorLink extends React.Component {
  render() {
    return (
      <line
        x1={this.props.datum.source.x}
        y1={this.props.datum.source.y}
        x2={this.props.datum.target.x}
        y2={this.props.datum.target.y}
        />
    );
  }
}
