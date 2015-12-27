import React from 'react';
import resolver from 'alt-resolver';
import AltContainer from 'alt-container';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';
// import Chart from './chart';
import connectToStores from 'alt-utils/lib/connectToStores';
// import NodeCountInput from './nodeCountInput';
import Graph from '../d3/graph';
import D3Chart from '../d3/d3Chart';

@connectToStores
export default class ChartContainer extends React.Component {
  static getStores() {
    return [ChartStore];
  }

  static getPropsFromStores() {
    return ChartStore.getState();
  }

  componentWillMount() {
    ChartActions.generateChartData(40, 15, true);
  }

  render() {
    return (
      <AltContainer stores={[ChartStore]} inject={
        {
         data: (props) => {
           return ChartStore.getState().data
         },
         labels: (props) => {
           return ChartStore.getState().labels
         }
        }
       }>
        <D3Chart />
      </AltContainer>
    );
  }
};
