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
    d3Chart.initialize(element, this.state.height, this.state.width);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    let element = ReactDOM.findDOMNode(this);
    d3Chart.addNodes(this.state.newData);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.data.nodes.length !== this.props.data.nodes.length;
  }

  render() {
    return (<div className="chart"></div>);
  }
}

Chart.defaultProps = {
  initialHeight: 800,
  initialWidth: 1800,
  initialData: {
    nodes: []
  }
}

Chart.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  data: React.PropTypes.shape({
    nodes: React.PropTypes.array
  }),
  newData: React.PropTypes.shape({
    nodes: React.PropTypes.array
  })
}
