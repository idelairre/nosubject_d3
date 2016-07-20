import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from './d3Chart';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';

export default class Chart extends React.Component {
    static defaultProps = {
      initialHeight: 800,
      initialWidth: 1800,
      initialNodes: []
    };

    static propTypes = {
      height: React.PropTypes.number,
      width: React.PropTypes.number,
      nodes: React.PropTypes.array
    };

    constructor(props) {
      super(props);
      this.state = {
        height: this.props.initialHeight,
        width: this.props.initialWidth,
        nodes: this.props.initialNodes
      }
    }

    componentDidMount() {
      let element = ReactDOM.findDOMNode(this);
      d3Chart.initialize(element, this.state.height, this.state.width);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
      d3Chart.addNodes(this.state.nodes);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.nodes.length !== this.props.nodes.length;
    }

    render() {
      return (<div className="chart"></div>);
      }
    }
