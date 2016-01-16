import alt from '../alt';
import graphGenerator from '../source/graphGenerator';
import nodeGenerator from '../source/nodeGenerator';
import linkedNodeGenerator from '../source/linkedNodeGenerator';

class ChartActions {
  clearGraph() {
    return graphGenerator.clearGraph();
  }

  clearedGraph(nodes) {
    return nodes;
  }

  clearingGraphFailed(errorMessage) {
    return errorMessage;
  }

  generateNodes(nodeCount, minLinks, shuffle) {
    return nodeGenerator.addNodes(nodeCount, minLinks, shuffle);
  }

  generatedNodes(nodes) {
    return nodes;
  }

  generatingNodesFailed(errorMessage) {
    return errorMessage;
  }

  generateLinkedNodes(title, backlinks) {
    return linkedNodeGenerator.generateLinkedNodes(title, backlinks)
  }

  generatedLinkedNodes(nodes) {
    return nodes;
  }

  generatedLinkedNodesFailed(errorMessage) {
    return errorMessage;
  }

  removeNode(node) {
    return graphGenerator.removeNode(node);
  }

  removedNode(nodes) {
    return nodes;
  }

  removingNodeFailed(errorMessage) {
    return errorMessage;
  }
}


export default alt.createActions(ChartActions);
