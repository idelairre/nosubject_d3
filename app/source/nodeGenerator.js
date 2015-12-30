import alt from '../alt';
import ChartActions from '../actions/chartActions';
import graphGenerator from '../generator/graphGenerator';
import { AsyncDispatch } from 'alt-async';

class NodeGenerator extends AsyncDispatch {
  constructor(dispatcher, name) {
    super(dispatcher, name);
  }

  addNode(nodeCount, shuffle) {
    return this.send(null, status => {
        return graphGenerator.generateNewNodes(nodeCount, shuffle);
    }, {
      success: ChartActions.generatedNodes,
      failure: ChartActions.generatingNodesFailed
    });
  }
}

const nodeGenerator = new NodeGenerator(alt, "NodeGenerator");

export default nodeGenerator;
