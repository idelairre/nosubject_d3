import React from 'react';
import resolver from 'alt-resolver';
import AltContainer from 'alt-container';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';
import connectToStores from 'alt-utils/lib/connectToStores';
import Chart from './chart';
import NodeControls from './buttons/nodeControls';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

@connectToStores
export default class ChartContainer extends React.Component {
  static getStores() {
    return [ChartStore];
  }

  static getPropsFromStores() {
    return ChartStore.getState();
  }

  componentWillMount() {
    let number = getRandomInt(0, 4);
    switch(number) {
      case 0:
        ChartActions.generateLinkedNodes("Anxiety");
        break;
      case 1:
        ChartActions.generateLinkedNodes("Ideology");
        break;
      case 2:
        ChartActions.generateLinkedNodes("Jouissance");
        break;
      case 3:
        ChartActions.generateLinkedNodes("Alienation");
        break;
      }
  }

  render() {
    return (
      <AltContainer stores={[ChartStore]} inject={
        {
         nodes: (props) => {
           return ChartStore.getState().nodes
         }
        }
       }>
        <NodeControls />
        <Chart />
      </AltContainer>
    );
  }
};