import alt from '../alt';
import { getActionCreators } from 'alt-async'
import { createStore } from 'alt-utils/lib/decorators';
import ChartActions from '../actions/chartActions';

const Initializer = getActionCreators("Initializer");
const NodeGenerator = getActionCreators("NodeGenerator");

@createStore(alt)
class ChartStore {
  constructor() {
    this.state = {
      data: {
        nodes: [],
        links: []
      },
      labels: {
        labelAnchors: [],
        labelAnchorLinks: []
      },
      newData: {
        nodes: [],
        links: []
      },
      newLabels: {
        labelAnchors: [],
        labelAnchorLinks: []
      },
      nodeCount: 50,
      minLinks: 15,
      shuffle: false
    };

    this.bindListeners({
      handleGeneratedChartData: Initializer.success,
      handleGeneratingChartDataFailed: Initializer.failure,
      handleGeneratedNodes: NodeGenerator.success,
      handleGeneratingNodesFailed: NodeGenerator.failure
    });
  }

  handleGenerateChartData() {
    // do nothing
  }

  handleGeneratedChartData(chartData) {
    // console.log('generated chart data: ', chartData);
    let [ data, labels ] = chartData;
    this.setState({ data: data, labels: labels, newData: data, newLabels: labels });
  }

  handleGeneratingChartDataFailed(errorMessage) {
    console.error(errorMessage);
  }

  handleGenerateNodes() {
    // do nothing
  }

  handleGeneratedNodes(newChartData) {
    let [ data, labels ] = newChartData;
    this.setState({
      data: {
        nodes: this.state.data.nodes.concat(data.nodes),
        links: this.state.data.links.concat(data.links)
      },
      labels: {
          labelAnchors: this.state.labels.labelAnchors.concat(labels.labelAnchors),
          labelAnchorLinks: this.state.labels.labelAnchorLinks.concat(labels.labelAnchorLinks)
      },
      newData: {
        nodes: data.nodes,
        links: data.links
      },
      newLabels: {
        labelAnchors: labels.labelAnchors,
        labelAnchorLinks: labels.labelAnchorLinks
      }
    });
    console.log('updated data: nodes: ', this.state.data.nodes.length, 'labels: ', this.state.labels.labelAnchors.length);
  }

  handleGeneratingNodesFailed(errorMessage) {
    console.error(errorMessage);
  }
}

export default ChartStore;
