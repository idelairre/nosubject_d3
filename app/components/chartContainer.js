import React from 'react';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';
// import Chart from './chart';
import connectToStores from 'alt-utils/lib/connectToStores';
// import NodeCountInput from './nodeCountInput';
import Graph from '../d3/graph';

@connectToStores
export default class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  static getStores() {
    return [ChartStore];
  }

  static getPropsFromStores() {
    return ChartStore.getState();
  }

  componentWillMount() {
    ChartActions.generateChartData(this.props.nodeCount, this.props.minLinks, this.props.shuffle);
    this.setState({ data: ChartStore.getState().data});
  }

  render() {
    return (
        <Graph data={this.state.data} />
    );
  }
};
