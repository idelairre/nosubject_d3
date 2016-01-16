import React from 'react';
import InlineCss from 'react-inline-css';

export default class ToggleBacklinks extends React.Component {
  static defaultProps = { initialValue: false };
  static propTypes = { value: React.PropTypes.bool };

  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue };
  }

  handleCheckbox() {
    this.setState({ value: !this.state.value });
    ::this.props.handleBacklinks(!this.state.value);
  }

  render() {
    return (
      <InlineCss stylesheet={`
        & button {
          border: 1px solid #A9A9A9;
          height: 23px;
          background: white;
          margin-left: -1px;
          margin-right: 0px;
          align-items: flex-end;
        }`}>
        <button className={this.props.className} onClick={::this.handleCheckbox} >incl. backlinked nodes?: {`${this.state.value}`}</button>
      </InlineCss>
    );
  }
}
