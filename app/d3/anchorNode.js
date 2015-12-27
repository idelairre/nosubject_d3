import React from 'react';
import ReactDOM from 'react-dom';

export default class AnchorNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { boundingBox: this.props.initialBoundingBox };
  }

  componentDidMount() {
    this.setState({ boundingBox: ReactDOM.findDOMNode(this).childNodes[1].getBBox() });
  }

  render() {
    let label = '';
    this.props.index % 2 === 0 ? label = "" : label = this.props.label;

    let datum = {};

    let transform = '';
    if (this.props.index % 2 === 0) {
        datum.x = this.props.node.x;
        datum.y = this.props.node.y;
    } else {
      let diffX = this.props.x - this.props.node.x;
      let diffY = this.props.y - this.props.node.y;
      let dist = Math.sqrt(diffX * diffX + diffY * diffY);
      let shiftX = this.state.boundingBox.width * (diffX - dist) / (dist * 2);
      shiftX = Math.max(-this.state.boundingBox.width, Math.min(0, shiftX));
      let shiftY = 5;
      transform = `translate(${shiftX || 0}, ${shiftY})`;
  }

    return (
      <g className="anchorNode" transform={`translate(${this.props.x}, ${this.props.y})`}>
        <circle
        r={0} />
        <text
          transform={transform}
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

AnchorNode.defaultProps = {
  initialTransform: '',
  initialLabel: '',
  initialX: 0,
  initialY: 0,
  initialBoundingBox: {}
}

AnchorNode.propTypes = {
  transform: React.PropTypes.string,
  label: React.PropTypes.string,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  boundingBox: React.PropTypes.object
}
