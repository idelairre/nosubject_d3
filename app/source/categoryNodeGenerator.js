import alt from '../alt';
import ChartActions from '../actions/chartActions';
import graphGenerator from '../generator/graphGenerator';
import { AsyncDispatch } from 'alt-async';

class CategoryNodeGenerator extends AsyncDispatch {
  constructor(dispatcher, name) {
    super(dispatcher, name);
  }

  generateCategoryNodes(title) {
    return this.send(null, status => {
        return graphGenerator.generateCategoryNodes(title);
    }, {
      success: ChartActions.generatedNodes,
      failure: ChartActions.generatingNodesFailed
    });
  }
}

const categoryNodeGenerator = new CategoryNodeGenerator(alt, "CategoryNodeGenerator");

export default categoryNodeGenerator;
