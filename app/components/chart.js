import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from '../d3/d3Chart';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeCount: this.props.initialNodeCount,
      minLinksCount: this.props.initialMinLinksCount,
      shuffle: this.props.initialShuffleValue,
      nodes: this.props.nodes,
      links: this.props.links,
      labelAnchors: this.props.labelAnchors,
      labelAnchorLinks: this.props.labelAnchorLinks
     };
  }
// nodes, links, labelAnchors, labelAnchorLinks
  generateGraph() {
    console.log('generate graph called');
    let element = ReactDOM.findDOMNode(this);
    d3Chart.create(2000, 1000, element, this.state.nodes, this.state.links, this.state.labelAnchors, this.state.labelAnchorLinks);
  }

  render() {
    return (
      <div className="Chart"></div>
    );
  }
};
//
// Chart.propTypes = {
//   nodeCount: React.PropTypes.number,
//   minLinksCount: React.PropTypes.number,
//   shuffle: React.PropTypes.bool
// };

// Chart.defaultProps = {
//   initialNodeCount: 50,
//   initialMinLinksCount: 15,
//   initialShuffleValue: true
// };
