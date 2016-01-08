import alt from '../alt';
import { getActionCreators } from 'alt-async'
import { createStore } from 'alt-utils/lib/decorators';
import ChartActions from '../actions/chartActions';
import { union } from 'lodash';

const LinkedNodeGenerator = getActionCreators("LinkedNodeGenerator");
const NodeGenerator = getActionCreators("NodeGenerator");
const CategoryNodeGenerator = getActionCreators("CategoryNodeGenerator");

@createStore(alt)
class ChartStore {
  constructor() {
    this.state = { data: { nodes: [] }, newData: { nodes: [] } };
    this.bindListeners({
      handleClearedGraph: ChartActions.clearedGraph,
      handleClearingGraphFailed: ChartActions.clearingGraphFailed,
      handleGeneratedNodes: [CategoryNodeGenerator.success, LinkedNodeGenerator.success, NodeGenerator.success],
      handleGeneratingNodesFailed: [CategoryNodeGenerator.failure, LinkedNodeGenerator.failure, NodeGenerator.failure],
      handleRemovedNode: ChartActions.removedNode,
      handleRemovingNodeFailed: ChartActions.removingNodeFailed
    });
  }

  handleClearedGraph(data) {
    this.setState(data);
  }

  handleClearingGraphFailed(errorMessage) {
    console.error(errorMessage);
  }

  handleGeneratedNodes(data) {
    this.setState({
      data: {
        nodes: this.state.data.nodes.concat(data.nodes)
      },
      newData: {
        nodes: data.nodes
      }
    });
    console.log('updated data: nodes: ', this.state.data.nodes.length);
  }

  handleGeneratingNodesFailed(errorMessage) {
    console.error(errorMessage);
  }

  handleRemovedNode(nodes) {
    this.setState({ data: { nodes: nodes } });
  }

  handleRemovingNodeFailed(errorMessage) {
    console.error(errorMessage);
  }
}

export default ChartStore;
