import alt from '../alt';
import ChartActions from '../actions/chartActions';
import graphGenerator from '../generator/graphGenerator';
import { AsyncDispatch } from 'alt-async';

class Initializer extends AsyncDispatch {
  constructor(dispatcher, name) {
    super(dispatcher, name);
  }

  generateGraph(nodeCount, minLinks, shuffle) {
    return this.send(null, status => {
        return graphGenerator.initializeGraphData(nodeCount, minLinks, shuffle);
    }, {
      success: ChartActions.generatedChartData,
      failure: ChartActions.generatingChartDataFailed
    });
  }
}

const initializer = new Initializer(alt, "Initializer");

export default initializer;
