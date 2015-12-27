import alt from '../alt';
// import graphGenerator from '../d3/graphGenerator';
import generateGraph from '../source/chartSource';

class ChartActions {
   generateChartData(nodes, minLinks, shuffle) {
    //  graphGenerator.initializeGraphData(nodes, minLinks, shuffle);
    return generateGraph(nodes, minLinks, shuffle);
   }

   generatedChartData(data) {
     return data;
   }

   generatingChartDataFailed(errorMessage) {
     return errorMessage;
   }
}

export default alt.createActions(ChartActions);
