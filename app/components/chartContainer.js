import React from 'react';
import resolver from 'alt-resolver';
import AltContainer from 'alt-container';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';
import connectToStores from 'alt-utils/lib/connectToStores';
import Chart from './chart';

@connectToStores
export default class ChartContainer extends React.Component {
  static getStores() {
    return [ChartStore];
  }

  static getPropsFromStores() {
    return ChartStore.getState();
  }

  componentWillMount() {
    ChartActions.generateGraph(50, 10, true);
    // setInterval(() => {
    //   ChartActions.generateNodes(10, true);
    //   console.log('adding new nodes...')
    // }, 5000);
    // setTimeout(() => {
    //   ChartActions.generateNodes(10, true);
    //   console.log('adding new nodes...')
    // }, 2000);
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
         },
         newData: (props) => {
           return ChartStore.getState().newData
         },
         newLabels: (props) => {
           return ChartStore.getState().newLabels
         }
        }
       }>
        <Chart />
      </AltContainer>
    );
  }
};
