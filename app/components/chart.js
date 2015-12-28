import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from './d3Chart';

export default class Chart extends React.Component {
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
    let element = ReactDOM.findDOMNode(this);
    if (this.state.data.nodes.length !== 0) {
      d3Chart.create(element, this.state.width, this.state.height, this.state.data, this.state.labels);
      d3Chart.addNode('fuck');
      // d3Chart.addNode('twat');
      // d3Chart.addLink('twat', 'fuck');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.data.nodes.length !== 0;
  }

  render() {
    return (
      <div className="chart"></div>
    );
  }
}

Chart.defaultProps = {
  initialHeight: 900,
  initialWidth: 2000,
  initialData: { links: [], nodes: [] },
  initialLabels: { labelAnchors: [], labelAnchorLinks: [] },
  initialLabelLinks: {}
}

Chart.propTypes = {
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
