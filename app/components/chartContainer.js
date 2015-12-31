import React from 'react';
import resolver from 'alt-resolver';
import AltContainer from 'alt-container';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';
import connectToStores from 'alt-utils/lib/connectToStores';
import Chart from './chart';
import categories from '../../output/categories';

@connectToStores
export default class ChartContainer extends React.Component {
  static getStores() {
    return [ChartStore];
  }

  static getPropsFromStores() {
    return ChartStore.getState();
  }

  componentWillMount() {
    ChartActions.generateNodes(150, 10, true);
      // ChartActions.generateCategoryNodes("Sexuality");

    // setTimeout(() => {
    //   ChartActions.generateCategoryNodes("Neurosis");
    //   console.log('adding new nodes...')
    // }, 2000);
    //
    // setTimeout(() => {
    //   ChartActions.generateCategoryNodes("Music");
    //   console.log('adding new nodes...')
    // }, 4000);
    // //
    // setTimeout(() => {
    //   ChartActions.generateCategoryNodes("Sexuality");
    //   console.log('adding new nodes...')
    // }, 3000);
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
