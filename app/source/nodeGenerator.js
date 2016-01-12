import alt from '../alt';
import ChartActions from '../actions/chartActions';
import graphGenerator from './graphGenerator';
import { AsyncDispatch } from 'alt-async';

class NodeGenerator extends AsyncDispatch {
  constructor(dispatcher, name) {
    super(dispatcher, name);
  }

  addNodes(nodeCount, minLinks, shuffle) {
    return this.send(null, status => {
        return graphGenerator.populateNodes(nodeCount, minLinks, shuffle);
    }, {
      success: ChartActions.generatedNodes,
      failure: ChartActions.generatingNodesFailed
    });
  }
}

const nodeGenerator = new NodeGenerator(alt, "NodeGenerator");

export default nodeGenerator;
