import React from 'react';
import ChartActions from '../../actions/chartActions';
import InlineCss from 'react-inline-css';

export default class AddRandomNodes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodeCount: null, minLinks: null, shuffle: true, shuffleStatus: "true" };
  }

  handleAddNodes() {
    if (this.state.minLinks) {
      ChartActions.generateNodes(this.state.nodeCount, this.state.minLinks, this.state.shuffle);
      this.setState({ nodeCount: null });
    }
  }

  handleChangeNodeCount(event) {
    this.setState({ nodeCount: event.target.value });
  }

  handleChangeLinkCount(event) {
    this.setState({ minLinks: event.target.value });
  }

  handleChangeShuffle() {
    if (this.state.shuffle === true) {
      this.setState({ shuffle: false, shuffleStatus: "false" });
    } else {
      this.setState({ shuffle: true, shuffleStatus: "true" });
    }
  }

  render() {
    return (
      <InlineCss stylesheet={`
      & .button {
        border: 1px solid #A9A9A9;
        height: 23px;
        background: white;
        margin-left: -1px;
        margin-right: 0px;
        align-items: flex-end;
      }
      & .nodeInput {
        margin-left: -1px;
       }`}>
       <div className={this.props.className}>
        <input type="number" placeholder="nodes" onChange={::this.handleChangeNodeCount} />
        <input className="nodeInput" type="number" placeholder="links" onChange={::this.handleChangeLinkCount} />
        <button className="button" onClick={::this.handleChangeShuffle}>shuffle: {this.state.shuffleStatus}</button>
        <button className="button" onClick={::this.handleAddNodes}>add nodes</button>
      </div>
      </InlineCss>
    );
  }
}
