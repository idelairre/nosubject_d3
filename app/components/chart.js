import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from '../d3/d3Chart';

export default class Chart extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  }

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    // d3Chart.create(el, {
    //   width: '100%',
    //   height: '300px'
    // }, this.getChartState());
  }

  componentDidUpdate() {
    // let el = ReactDOM.findDOMNode(this);
    // d3Chart.update(el, this.getChartState());
  }

  getChartState() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  }

  componentWillUnmount() {
    var el = ReactDOM.findDOMNode(this);
    // d3Chart.destroy(el);
  }

  render() {
    return (
      <div className="Chart"></div>
    );
  }
};
