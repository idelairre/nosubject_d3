import alt from '../alt';
import ChartActions from '../actions/chartActions';
import graphGenerator from '../generator/graphGenerator';
import { AsyncDispatch } from 'alt-async';

class LinkedNodeGenerator extends AsyncDispatch {
  constructor(dispatcher, name) {
    super(dispatcher, name);
  }

  generateLinkedNodes(title) {
    return this.send(null, status => {
        return graphGenerator.generateLinkedNodes(title);
    }, {
      success: ChartActions.generatedLinkedNodes,
      failure: ChartActions.generatingLinkedNodesFailed
    });
  }
}

const linkedNodeGenerator = new LinkedNodeGenerator(alt, "LinkedNodeGenerator");

export default linkedNodeGenerator;
