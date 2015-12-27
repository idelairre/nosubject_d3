import React from 'react';
import ChartActions from '../actions/chartActions';

export default class NodeCountInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodeCount: this.props.nodeCount };
  }
  componentDidMount() {
    console.log(this.props);
  }

  handleChange = (nodeCount) => {
    // this.setState({ nodeCount: nodeCount});
    // console.log(this.state);
    // ChartActions.generateChartData(this.state.nodeCount, this.props.minLinks, this.props.shuffle);
  }

  render() {
    return (
      <input type="number" defaultValue={this.props.nodeCount} onchange={::this.handleChange()} />
    );
  }
}
