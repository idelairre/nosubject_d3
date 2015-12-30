import alt from '../alt';
import initializer from '../source/graphInitializer';
import nodeGenerator from '../source/nodeGenerator';

class ChartActions {
   generateGraph(nodeCount, minLinks, shuffle) {
      return initializer.generateGraph(nodeCount, minLinks, shuffle);
   }

   generatedGraph(data) {
     return data;
   }

   generatedGraph(errorMessage) {
     return errorMessage;
   }

   generateNodes(nodeCount, shuffle) {
     return nodeGenerator.addNode(nodeCount, shuffle);
   }

   generatedNodes(data) {
     return data;
   }

   generatingNodesFailed(errorMessage) {
     return errorMessage;
   }
}


export default alt.createActions(ChartActions);
