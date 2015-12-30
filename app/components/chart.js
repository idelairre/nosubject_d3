import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from './d3Chart';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.initialHeight,
      width: this.props.initialWidth
    }
  }

  componentWillUpdate(nextProps) {
    // console.log(nextProps);
  }

  componentDidMount() {
    let element = ReactDOM.findDOMNode(this);
    d3Chart.create(element, this.state.width, this.state.height);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
    // console.log(this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('current state: ', this.state);
    let element = ReactDOM.findDOMNode(this);
    d3Chart.addNodes(this.state.newData, this.state.newLabels);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.data.nodes.length !== this.props.data.nodes.length;
  }

  render() {
    return ( < div className = "chart" > < /div>);
  }
}

Chart.defaultProps = {
  initialHeight: 1000,
  initialWidth: 2000,
  initialData: {
    links: [],
    nodes: []
  },
  initialLabels: {
    labelAnchors: [],
    labelAnchorLinks: []
  },
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
  }),
  newLabels: React.PropTypes.shape({
    nodes: React.PropTypes.array,
    links: React.PropTypes.array
  }),
  newLabels: React.PropTypes.shape({
    labelAnchors: React.PropTypes.array,
    labelAnchorLinks: React.PropTypes.array
  })
}
