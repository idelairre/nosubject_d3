import createAsyncDispatch from 'alt-async';
import ChartActions from '../actions/chartActions';
import alt from '../alt';
import graphGenerator from '../generator/graphGenerator';

const asyncDispatch = createAsyncDispatch(alt);

const generateGraph = asyncDispatch('generateGraph', (send) => (nodeCount, minLinks, shuffle) => {
  return send(null, (status) => {
    return graphGenerator.initializeGraphData(nodeCount, minLinks, shuffle);
  }, {
    success: ChartActions.generatedChartData,
    failure: ChartActions.generatingChartDataFailed
  });
});

export default generateGraph;
