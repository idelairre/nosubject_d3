import alt from '../alt';
import { createStore, datasource } from 'alt-utils/lib/decorators';
import ChartActions from '../actions/chartActions';

@createStore(alt)
class ChartStore {
   constructor() {
      this.state = { data: null, labelAnchorLinks: null, nodeCount: 50, minLinks: 15, shuffle: false };
      this.bindListeners({
         handleGenerateChartData: ChartActions.GENERATE_CHART_DATA,
      });
   }

   handleGenerateChartData(data) {
     this.setState({ data : data });
     console.log(this.state.data);
   }

}

export default ChartStore;
