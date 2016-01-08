import alt from '../alt';
import graphGenerator from '../generator/graphGenerator';
import nodeGenerator from '../source/nodeGenerator';
import linkedNodeGenerator from '../source/linkedNodeGenerator';
import categoryNodeGenerator from '../source/categoryNodeGenerator';

class ChartActions {
  clearGraph() {
    return graphGenerator.clearGraph();
  }

  clearedGraph(data) {
    return data;
  }

  clearingGraphFailed(errorMessage) {
    return errorMessage;
  }

  generateNodes(nodeCount, minLinks, shuffle) {
    return nodeGenerator.addNodes(nodeCount, minLinks, shuffle);
  }

  generatedNodes(data) {
    return data;
  }

  generatingNodesFailed(errorMessage) {
    return errorMessage;
  }

  generateLinkedNodes(title) {
    return linkedNodeGenerator.generateLinkedNodes(title)
  }

  generatedLinkedNodes(data) {
    return data;
  }

  generatedLinkedNodesFailed(errorMessage) {
    return errorMessage;
  }

  generateCategoryNodes(title) {
    return categoryNodeGenerator.generateCategoryNodes(title);
  }

  generatedCategoryNodes(data) {
    return data;
  }

  generatingCategoryNodesFailed(errorMessage) {
    return errorMessage;
  }

  removeNode(node) {
    return graphGenerator.removeNode(node);
  }

  removedNode(data) {
    return data;
  }

  removingNodeFailed(errorMessage) {
    return errorMessage;
  }
}


export default alt.createActions(ChartActions);
