import alt from '../alt';
import { createStore, datasource } from 'alt-utils/lib/decorators';
import ChartActions from '../actions/chartActions';
import { getActionCreators } from 'alt-async'

const { success, failure, begin, end } = getActionCreators('generateGraph');

@createStore(alt)
class ChartStore {
   constructor() {
      this.state = { data: null, labels: null, nodeCount: 50, minLinks: 15, shuffle: false };
      this.bindListeners({
         handleGenerateChartData: success
      });
   }

   handleGenerateChartData(chartData) {
     let [ data, labels ] = chartData;
     this.state.data = data;
     this.state.labels = labels;
     console.log(data, labels);
   }

}

export default ChartStore;
