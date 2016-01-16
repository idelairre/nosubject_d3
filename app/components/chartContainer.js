import React from 'react';
import AltContainer from 'alt-container';
import ChartActions from '../actions/chartActions';
import ChartStore from '../store/chartStore';
import connectToStores from 'alt-utils/lib/connectToStores';
import Chart from './chart';
import NodeControls from './buttons/nodeControls';

@connectToStores
export default class ChartContainer extends React.Component {
  static defaultProps = { nodes: [] };
  static propTypes = { nodes: React.PropTypes.array };

  static getStores() {
    return [ChartStore];
  }

  static getPropsFromStores() {
    return ChartStore.getState();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  componentWillMount() {
    let number = this.getRandomInt(0, 4);
    switch(number) {
      case 0:
        ChartActions.generateLinkedNodes("Anxiety", false);
        break;
      case 1:
        ChartActions.generateLinkedNodes("Ideology", false);
        break;
      case 2:
        ChartActions.generateLinkedNodes("Jouissance", false);
        break;
      case 3:
        ChartActions.generateLinkedNodes("Alienation", false);
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
