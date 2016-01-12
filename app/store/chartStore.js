import alt from '../alt';
import { getActionCreators } from 'alt-async'
import { createStore } from 'alt-utils/lib/decorators';
import ChartActions from '../actions/chartActions';
import { union } from 'lodash';

const LinkedNodeGenerator = getActionCreators("LinkedNodeGenerator");
const NodeGenerator = getActionCreators("NodeGenerator");

@createStore(alt)
class ChartStore {
  constructor() {
    this.state = { nodes: [] };
    this.bindListeners({
      handleClearedGraph: ChartActions.clearedGraph,
      handleClearingGraphFailed: ChartActions.clearingGraphFailed,
      handleGeneratedNodes: [LinkedNodeGenerator.success, NodeGenerator.success],
      handleGeneratingNodesFailed: [LinkedNodeGenerator.failure, NodeGenerator.failure],
      handleRemovedNode: ChartActions.removedNode,
      handleRemovingNodeFailed: ChartActions.removingNodeFailed
    });
  }

  handleClearedGraph(nodes) {
    this.setState({ nodes: nodes });
  }

  handleClearingGraphFailed(errorMessage) {
    console.error(errorMessage);
  }

  handleGeneratedNodes(nodes) {
    this.setState({ nodes: nodes });
  }

  handleGeneratingNodesFailed(errorMessage) {
    console.error(errorMessage);
  }

  handleRemovedNode(nodes) {
    this.setState({ nodes: nodes });
  }

  handleRemovingNodeFailed(errorMessage) {
    console.error(errorMessage);
  }
}

export default ChartStore;
