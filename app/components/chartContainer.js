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
    ChartActions.generateNodes(100, 10, true);
    // ChartActions.generateLinkedNodes("Frustration");
    // ChartActions.generateLinkedNodes("Acting out");
    // ChartActions.generateCategoryNodes("Academia");

    // setInterval(() => {
    //   ChartActions.generateNodes(5, 15, true);
    //   console.log('adding new nodes...')
    // }, 3000);

    // setTimeout(() => {
    //   ChartActions.generateLinkedNodes("Acting out");
    //   console.log('adding new nodes...')
    // }, 6000);

    // setTimeout(() => {
    //   ChartActions.generateLinkedNodes("Frustration");
    //   console.log('adding new nodes...')
    // }, 3000);

    // setTimeout(() => {
    //   ChartActions.generateLinkedNodes("Alan Sheridan");
    //   console.log('adding new nodes...')
    // }, 8000);
    //
    // setTimeout(() => {
    //   ChartActions.generateLinkedNodes("Action");
    //   console.log('adding new nodes...')
    // }, 7000);

    // setTimeout(() => {
    //   ChartActions.generateLinkedNodes("Activity");
    //   console.log('adding new nodes...')
    // }, 9000);
    // setTimeout(() => {
    //   ChartActions.generateLinkedNodes("Psychoanalysis");
    //   console.log('adding new nodes...')
    // }, 10000);
    //
    // setTimeout(() => {
    //   ChartActions.generateNodes(10, 15, true);
    //   console.log('adding new nodes...')
    // }, 15000);
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
