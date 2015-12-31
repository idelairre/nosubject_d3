import alt from '../alt';
import nodeGenerator from '../source/nodeGenerator';
import linkedNodeGenerator from '../source/linkedNodeGenerator';
import categoryNodeGenerator from '../source/categoryNodeGenerator';

class ChartActions {
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
}


export default alt.createActions(ChartActions);
